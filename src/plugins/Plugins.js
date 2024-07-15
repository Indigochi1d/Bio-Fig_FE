//ERROR Bar 그리는 플러그인
export const errorBarPlugin = {
  id: "errorBarPlugin",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      if (dataset.type === "bar" && dataset.error) {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((bar, index) => {
          const error = dataset.error[index];
          const xPos = bar.x;
          const errorTop = bar.y - error*20;
          const errorBottom = bar.y + error*20;
          // 에러 바 그리기
          ctx.save();
          ctx.strokeStyle = "black";
          ctx.lineWidth = 3;
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
// X,Y축 선 굵게 그리는 플러그인
export const customXYLinePlugin = {
  id: "customXYLinePlugin",
  afterDraw(chart) {
    const {
      ctx,
      chartArea: { top, bottom, left, right },
    } = chart;

    // X 축
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.moveTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.stroke();
    ctx.restore();

    // Y 축
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.moveTo(left, top);
    ctx.lineTo(left, bottom);
    ctx.stroke();
    ctx.restore();
  },
};
export const customGridLinePlugin = {
  id: "customGridLinePlugin",
  afterDraw(chart) {
    const {
      ctx,
      chartArea: { bottom, left },
      scales: { x, y },
    } = chart;

    ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;

    // Y-axis grid lines
    const yStepSize = 2; // y축 스텝 크기
    for (let i = y.min; i <= y.max; i += yStepSize) {
      const yPos = y.getPixelForValue(i);
      ctx.beginPath();
      ctx.moveTo(left, yPos);
      ctx.lineTo(left - 17, yPos);
      ctx.stroke();
    }

    //X-axis grid lines
    const xStepSize = 1;
    for (let i = x.min; i <= x.max; i += xStepSize) {
      const xPos = x.getPixelForValue(i);
      ctx.beginPath();
      ctx.moveTo(xPos, bottom);
      ctx.lineTo(xPos, bottom + 20);
      ctx.stroke();
    }

    ctx.restore();
  },
};
