import React, { useEffect, useState, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import './TimeSeriesGraph.css';

// Register all required Chart.js components
Chart.register(...registerables);

const TimeSeriesGraph = () => {
    const [datasets, setDatasets] = useState([]);
    const [selectedInstruments, setSelectedInstruments] = useState([]);
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const chartRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        // Fetch the data from the JSON file
        fetch('./huge_datasets.json')
            .then((response) => response.json()) // Ensure you parse the response as JSON
            .then((data) => {
                setDatasets(data);
                selectedInstruments(data[4]); // Select the first instrument by default
            })
            .catch((error) => console.error('Error loading JSON data:', error));
    }, [selectedInstruments]); // Empty array means this effect runs once when the component mounts

    // Mock data update function
    // useEffect(() => {
    //     // const addMockData = () => {
    //     //     const newDatasets = [...datasets]; // Copy existing datasets to avoid direct mutation

    //     //     // Simulate adding new data for each instrument
    //     //     newDatasets.forEach((instrument) => {
    //     //         // Get the current timestamp and a random value for the mock data
    //     //         const newTimestamp = new Date();
    //     //         const newValue = Math.random() * 100; // Random value between 0 and 100

    //     //         // Push the new data point into the instrument's data
    //     //         instrument.data.push({
    //     //             timestamp: newTimestamp,
    //     //             value: newValue,
    //     //             opcQuality: 'Good', // Mock opcQuality (you can change this as needed)
    //     //         });
    //     //     });

    //     //     // Update state with the new datasets
    //     //     setDatasets(newDatasets);
    //     // };

    //     // Set an interval to add new mock data every 5 seconds
    //     // const intervalId = setInterval(addMockData, 5000);

    //     // Cleanup interval on component unmount
    //     // return () => clearInterval(intervalId);
    // }, [datasets]); // This effect depends on the `datasets` state

    useEffect(() => {
        // Destroy previous chart instance if it exists
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Get the first and last timestamp
        const firstTimestamp = new Date(datasets[0]?.data[0]?.timestamp);
        const lastTimestamp = new Date(datasets[datasets.length - 1]?.data[datasets[datasets.length - 1].data.length - 1]?.timestamp);

        // Calculate the time range between the first and last data points
        const timeRange = lastTimestamp - firstTimestamp;

        // Define stepSize dynamically based on time range
        let stepSize;
        let timeUnit;

        // Adjust stepSize and unit based on timeRange
        if (timeRange <= 1000 * 60 * 60) { // Less than 1 hour
            stepSize = 1000; // 1 second
            timeUnit = 'second';
        } else if (timeRange <= 1000 * 60 * 60 * 24) { // Less than 1 day
            stepSize = 1000 * 60; // 1 minute
            timeUnit = 'minute';
        } else if (timeRange <= 1000 * 60 * 60 * 24 * 7) { // Less than 1 week
            stepSize = 1000 * 60 * 60; // 1 hour
            timeUnit = 'hour';
        } else { // More than 1 week
            stepSize = 1000 * 60 * 60 * 24; // 1 day
            timeUnit = 'day';
        }

        // Filter data by date range for each selected instrument
        const filteredDatasets = selectedInstruments.map((instrument) => {
            const filteredData = instrument.data.filter((point) => {
                const timestamp = new Date(point.timestamp);
                return (
                    (!dateRange.start || timestamp >= new Date(dateRange.start)) &&
                    (!dateRange.end || timestamp <= new Date(dateRange.end))
                );
            });

            return {
                label: `${instrument.instrumentName} - ${instrument.sensorType}`,
                data: filteredData.map((point) => ({ x: point.timestamp, y: point.value })),
                borderColor: instrument.color || 'hsl(120, 100%, 50%)',  // Green color for lines
                backgroundColor: instrument.backgroundColor || 'hsla(120, 100%, 50%, 0.1)',  // Light Green
                borderWidth: 2,
                fill: instrument.fill || true,
                tension: instrument.tension || 0.4, // Smooth curve
            };
        });

        // Prepare data for the Chart.js instance
        const chartData = {
            labels: filteredDatasets.length > 0 ? filteredDatasets[0].data.map((point) => point.x) : [],
            datasets: filteredDatasets,
        };

        // Chart options
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const { x, y } = context.raw;
                            const opcQuality = selectedInstruments[context.datasetIndex]?.data[context.dataIndex]?.opcQuality;
                            return `Timestamp: ${x}\nValue: ${y}\nOPC Quality: ${opcQuality || 'N/A'}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: timeUnit,
                        stepSize: stepSize,  // Dynamic stepSize
                    },
                    title: {
                        display: true,
                        text: 'Timestamp',
                        font: {
                            size: 14,
                        },
                    },
                    ticks: {
                        maxTicksLimit: 10, // Limit the number of ticks on the x-axis
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value',
                        font: {
                            size: 14,
                        },
                    },
                    beginAtZero: true,
                },
            },
        };

        // Create a new Chart instance
        chartRef.current = new Chart(canvasRef.current, {
            type: 'line',
            data: chartData,
            options: chartOptions,
        });

        // Cleanup chart instance on component unmount
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [datasets, selectedInstruments, dateRange]);

    const handleInstrumentChange = (event) => {
        const { value, checked } = event.target;
        setSelectedInstruments((prev) => {
            if (checked) {
                // Add the instrument to the selected list
                return [
                    ...prev,
                    datasets.find((dataset) => dataset.instrumentName === value),
                ];
            } else {
                // Remove the instrument from the selected list
                return prev.filter((instrument) => instrument.instrumentName !== value);
            }
        });
    };

    const handleDateRangeChange = (type, value) => {
        setDateRange((prevRange) => ({
            ...prevRange,
            [type]: value,
        }));
    };

    return (
        <div className="chart-container">
            <h2>Time Series Graph</h2>

            {/* Controls Section */}
            <div className="controls">
                {/* Select Instruments */}
                <div className="controls-item">
                    <label className="controls-label">Instruments:</label>
                    <div className="checkbox-group">
                        {datasets.map((dataset) => (
                            <div key={dataset.instrumentName} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={`instrument-${dataset.instrumentName}`}
                                    value={dataset.instrumentName}
                                    onChange={handleInstrumentChange}
                                    checked={selectedInstruments.some(
                                        (instrument) => instrument.instrumentName === dataset.instrumentName
                                    )}
                                />
                                <label htmlFor={`instrument-${dataset.instrumentName}`} className="checkbox-label">
                                    {dataset.instrumentName} - {dataset.sensorType}
                                </label>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Date Range Picker */}
                <div className="controls-item2">
                    <div className="date-column">
                        <label htmlFor="start-date" className="controls-label">Start:</label>
                        <input
                            type="datetime-local"
                            id="start-date"
                            className="date-input"
                            onChange={(e) => handleDateRangeChange('start', e.target.value)}
                        />
                    </div>
                    <div className="date-column">
                        <label htmlFor="end-date" className="controls-label">End:</label>
                        <input
                            type="datetime-local"
                            id="end-date"
                            className="date-input"
                            onChange={(e) => handleDateRangeChange('end', e.target.value)}
                        />
                    </div>
                </div>

            </div>


            {/* Chart Section */}
            <div className="chart-wrapper">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};

export default TimeSeriesGraph;
