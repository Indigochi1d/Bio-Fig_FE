import styled from "styled-components";
import ScatterWithBars from "../../components/graphs/ScatterWithBar.js";

const StyledScatterWithBarsPage = styled.div`
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

const ScatterWithBarsPage = () => {
  return (
    <StyledScatterWithBarsPage>
      <h1>Scatter With Bar Plot</h1>
      <ChartWrapper>
        <ScatterWithBars/>
      </ChartWrapper>
    </StyledScatterWithBarsPage>
  );
};

export default ScatterWithBarsPage;
