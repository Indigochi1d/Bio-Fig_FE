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
import { errorBarPlugin, customXYLinePlugin,customGridLinePlugin } from "./plugins/Plugins.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);
//Custom Plugin Register 부분
ChartJS.register(errorBarPlugin,customXYLinePlugin,customGridLinePlugin);

function addOffsetToSameYValues(data) {
  const xyValueCount = {};
  const OFFSET_STEP = 0.05;

  data.forEach((point) => {
    const key = `${point.x}-${point.y}`;
    if (!xyValueCount[key]) {
      xyValueCount[key] = { count: 0, offset: 0 };
    }
    point.x += xyValueCount[key].offset;
    xyValueCount[key].offset += OFFSET_STEP;
  });

  return data;
}

function calculateBarData(savedData) {
  const groupedData = savedData.reduce((acc, { x, y }) => {
    if (!acc[x]) {
      acc[x] = [];
    }
    acc[x].push(y);
    return acc;
  }, {});

  return Object.entries(groupedData).map(([x, yValues]) => ({
    x: parseInt(x, 10),
    y: yValues.reduce((sum, y) => sum + y, 0) / yValues.length,
  }));
}

function calculateStandardDeviation(datas) {
  const ObjtoArrayDatas = datas.reduce((newArrayData, { x, y }) => {
    if (!newArrayData[x]) {
      newArrayData[x] = [];
    }
    newArrayData[x].push(y);
    return newArrayData;
  }, {});

  const arrayData = Object.keys(ObjtoArrayDatas).map(
    (key) => ObjtoArrayDatas[key]
  );

  function stdDev(arr) {
    if (arr.length === 0) return 0;

    const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
    const variance =
      arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  }
  // 각 내부 배열의 표준편차를 계산
  const stdDevs = arrayData.map((innerArray) => stdDev(innerArray));

  return stdDevs;
}

export default function ScatterWithBars() {
  const location = useLocation();
  const { savedData } = location.state || {};
  const scatterData = savedData;
  console.log(scatterData[0].y);
  const barData = calculateBarData(savedData);
  const columnsLabel = location.state.columns;
  const Xtitle = location.state.Xtitle;
  const Ytitle = location.state.Ytitle;
  const StandardDeviationWithSavedData = calculateStandardDeviation(savedData);
  console.log(StandardDeviationWithSavedData);
  const data = {
    datasets: [
      {
        type: "scatter",
        label: "Scatter Dataset",
        data: addOffsetToSameYValues(scatterData),
        backgroundColor: "rgba(0, 0, 0, 1)",
        pointRadius: 7,
      },
      {
        type: "bar",
        label: "Bar Dataset",
        data: barData,
        backgroundColor: ["#8998fa", "#F69F91", "#A8E19B", "#FDB461"],
        borderColor: "#000000",
        borderWidth: 5,
        error: StandardDeviationWithSavedData,
        barPercentage: 0.4,
        categoryPercentage: 0.8,
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
          padding:18,
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
          padding:15,
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
