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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);
//Plugins..
const errorBarPlugin = {
  id: "errorBarPlugin",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      if (dataset.type === "bar" && dataset.error) {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((bar, index) => {
          const error = dataset.error[index];
          const xPos = bar.x;
          const errorTop = bar.y - error;
          const errorBottom = bar.y + error;
          // 에러 바 그리기
          ctx.save();
          ctx.strokeStyle = "black";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(xPos, errorTop);
          ctx.lineTo(xPos, errorBottom);
          ctx.stroke();

          // 에러 바 끝부분의 캡 그리기
          ctx.beginPath();
          ctx.moveTo(xPos - 8, errorTop);
          ctx.lineTo(xPos + 8, errorTop);
          ctx.moveTo(xPos - 8, errorBottom);
          ctx.lineTo(xPos + 8, errorBottom);
          ctx.stroke();
          ctx.restore();
        });
      }
    });
  },
};

const customXYLinePlugin = {
  id: 'customXYLinePlugin',
  afterDraw(chart) {
    const { ctx, chartArea: { top, bottom, left, right } } = chart;

    // X 축
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'black';
    ctx.moveTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.stroke();
    ctx.restore();

    // Y 축
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'black';
    ctx.moveTo(left, top);
    ctx.lineTo(left, bottom);
    ctx.stroke();
    ctx.restore();
  }
};

//Register 부분
ChartJS.register(errorBarPlugin);
ChartJS.register(customXYLinePlugin);



function addOffsetToSameYValues(data) {
  const yValueCount = {};
  const OFFSET_STEP = 0.05;

  data.forEach((point) => {
    if (!yValueCount[point.y]) {
      yValueCount[point.y] = { count: 0, offset: 0 };
    }
    point.x += yValueCount[point.y].offset;
    yValueCount[point.y].offset += OFFSET_STEP;
  });

  return data;
}

export default function ScatterWithBars() {
  const scatterData = [
    { x: 0, y: 4 },
    { x: 0, y: 2.2 },
    { x: 0, y: 1.4 },
    { x: 0, y: 4 },
    { x: 0, y: 1.7 },
    { x: 0, y: 2.5 },
    { x: 0, y: 4 },
  ];

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
        data: [
          { x: 0, y: 2 },
          { x: 1, y: 5 },
          { x: 2, y: 8 },
          { x: 3, y: 10 },
        ],
        backgroundColor: ["#8998fa", "#F69F91", "#A8E19B", "#FDB461"],
        borderColor: "#000000",
        borderWidth: 5,
        error: [30, 30, 30, 30],
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
            const labels = ["Untreated", "Placebo", "Treated", "Dummy"];
            return labels[value] || "";
          },
        },
        title: {
          display: true,
          text: "XTitle",
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
        },
        title: {
          display: true,
          text: "YTitle",
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
