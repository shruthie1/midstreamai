import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import TimeSeriesGraph from './graph';

function Home() {

    return (
        <Container className="home">
            <h1>Welcome to MidstreamAI</h1>
            <p>Midstream operations solutions that deliver tangible benefits.</p>
            <TimeSeriesGraph  />
        </Container>
    );
}

export default Home;
