import React from "react";
import ScatterWithBar from "./ScatterWithBar";
import styled from "styled-components";

const App = () => {
  return (
    <Container>
      <h1>Scatter Plot with Bar Chart</h1>
      <ChartWrapper>
        <ScatterWithBar />
      </ChartWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  min-height: 800px;
`;

const ChartWrapper = styled.div`
  width: 768px; 
  height: 100%;
`;

export default App;
