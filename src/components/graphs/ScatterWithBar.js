import React from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useLocation } from "react-router-dom";
import {
  errorBarPlugin,
  customXYLinePlugin,
  customGridLinePlugin,
} from "../../lib/plugins/Plugins";
import { BarWithErrorBar, BarWithErrorBarsChart, BarWithErrorBarsController } from "chartjs-chart-error-bars";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarWithErrorBarsChart,
  BarWithErrorBar,
  BarWithErrorBarsController,
  Tooltip,
  Legend
);

// Custom Plugin Register 부분
ChartJS.register(errorBarPlugin, customXYLinePlugin, customGridLinePlugin);

function addOffsetToSameYValuesPerBar(scatterData, barYData) {
  const OFFSET_STEP = 0.05; // x축 좌우 이동 정도
  const POINT_RADIUS = 1; // 스캐터 점의 반지름

  barYData.forEach((bar) => {
    const filteredData = scatterData.filter(point => point.x === bar.x);

    // y 값의 중복 여부를 확인
    const yValues = filteredData.map(point => point.y);
    const hasDuplicates = new Set(yValues).size !== yValues.length;

    if (hasDuplicates) {
      const offsetStart = bar.x - (OFFSET_STEP * (filteredData.length - 1) / 2);

      filteredData.forEach((point, index) => {
        point.x = offsetStart + (OFFSET_STEP * index);
      });

      // 스캐터 점이 겹치지 않도록 추가 조정
      let hasOverlap;
      do {
        hasOverlap = false;
        for (let i = 0; i < filteredData.length - 1; i++) {
          for (let j = i + 1; j < filteredData.length; j++) {
            const dx = filteredData[i].x - filteredData[j].x;
            const dy = filteredData[i].y - filteredData[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < POINT_RADIUS * 2) {
              hasOverlap = true;
              // 겹치는 경우 x 위치를 조정
              if (dx === 0) {
                filteredData[j].x += OFFSET_STEP;
              } else {
                const adjustment = OFFSET_STEP / dx;
                filteredData[j].x += dx * adjustment;
              }
            }
          }
        }
      } while (hasOverlap);
    } else {
      filteredData.forEach((point) => {
        point.x = bar.x; // 중복이 없다면 원래의 x 값 유지
      });
    }
  });

  return scatterData;
}



function calculateBarDataWithErrors(savedData, stdDevs) {
  const groupedData = savedData.reduce((acc, { x, y }) => {
    if (!acc[x]) {
      acc[x] = [];
    }
    acc[x].push(y);
    return acc;
  }, {});

  return Object.entries(groupedData).map(([x, yValues], index) => {
    const mean = yValues.reduce((sum, y) => sum + y, 0) / yValues.length;
    const stdDevValue = stdDevs[index];
    return {
      x: parseInt(x, 10),
      y: mean,
      yMin: mean - stdDevValue,
      yMax: mean + stdDevValue,
    };
  });
}

// 표본 표준편차
function calculateStandardDeviation(datas) {
  const groupedData = datas.reduce((acc, { x, y }) => {
    if (!acc[x]) {
      acc[x] = [];
    }
    acc[x].push(y);
    return acc;
  }, {});

  const arrayData = Object.values(groupedData);

  function stdDev(arr) {
    if (arr.length === 0) return 0;
    const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
    const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (arr.length - 1);
    return Math.sqrt(variance);
  }

  const stdDevs = arrayData.map(innerArray => stdDev(innerArray));

  return stdDevs;
}

export default function ScatterWithBars() {
  const location = useLocation();
  const { savedData } = location.state || {};
  const scatterData = savedData;
  const columnsLabel = location.state.columns;
  const Xtitle = location.state.Xtitle;
  const Ytitle = location.state.Ytitle;
  const StandardDeviationWithSavedData = calculateStandardDeviation(savedData);
  // 에러가 적용된 barYData 생성
  const barYData = calculateBarDataWithErrors(savedData, StandardDeviationWithSavedData);
  // 스캐터 데이터에 오프셋 추가
  const adjustedScatterData = addOffsetToSameYValuesPerBar(scatterData, barYData);

  const data = {
    datasets: [
      {
        type: "scatter",
        label: "Scatter Dataset",
        data: adjustedScatterData,
        backgroundColor: "rgba(0, 0, 0, 1)",
        pointRadius: 6,
      },
      {
        type: "barWithErrorBars",
        label: "Bar Dataset",
        data: barYData,
        backgroundColor: ["#8998fa", "#F69F91", "#A8E19B", "#FDB461"],
        borderColor: "#000000",
        borderWidth: 5,
        barPercentage: 0.4,
        categoryPercentage: 0.8,
        errorBarWhiskerLineWidth: 2,
        errorBarLineWidth:3,
        errorBarWhiskerRatio: 0.45
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          font: {
            weight: "bold",
            size: 20,
          },
          color: "black",
          callback: function (value) {
            return columnsLabel[value] || "";
          },
          padding: 18,
        },
        title: {
          display: true,
          text: Xtitle,
          align: "middle",
          color: "black",
          font: {
            size: 30,
            family: "Consolas",
            weight: "bold",
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 2,
          font: {
            color: "black",
            weight: "bold",
            size: 20,
          },
          color: "black",
          padding: 15,
        },
        title: {
          display: true,
          text: Ytitle,
          align: "middle",
          color: "black",
          font: {
            size: 30,
            family: "Consolas",
            weight: "bold",
          },
        },
      },
    },
  };

  return <Scatter data={data} options={options} />;
}
