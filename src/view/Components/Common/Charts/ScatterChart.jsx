import React, { useCallback, useEffect, useState } from "react";
import { Chart as ChartJS, Legend } from "chart.js/auto";
import { Chart, Line } from "react-chartjs-2";
import { useRef } from "react";

const ScatterChart = ({
  chartKey = "",
  labels = [],
  datas = [],
  lineTypeToDraw = 0,
  updateCount = 0,
  goodDirection,
  setLines = () => {},
  verticalLines = [],
  verticalLinesCanvasPos = [],
  horizontalLine,
  horizontalLineCanvasPos,
  extendedLines = [],
  extendedLinesCanvasPos = [],
}) => {
  const [data, setData] = useState({
    labels: [1, 2, 3],
    datasets: [],
  });

  const chartRef = useRef(null);
  const [yMax, setYMax] = useState(Number.MIN_SAFE_INTEGER);
  const [yMin, setYMin] = useState(Number.MAX_SAFE_INTEGER);

  const chartClicked = (event) => {
    // chart area
    let chart = chartRef.current;
    let yTop = chart.chartArea.top;
    let yBottom = chart.chartArea.bottom;
    let yMin = chart.scales.y.min;
    let yMax = chart.scales.y.max;
    let xTop = chart.chartArea.left;
    let xBottom = chart.chartArea.right;
    let xMin = chart.scales.x.min;
    let xMax = chart.scales.x.max;

    if (
      event.nativeEvent.offsetY >= yBottom ||
      event.nativeEvent.offsetY <= yTop ||
      event.nativeEvent.offsetX >= xBottom ||
      event.nativeEvent.offsetX <= xTop
    )
      return;
    let newY = 0;

    let newX = 0;

    if (
      event.nativeEvent.offsetY <= yBottom &&
      event.nativeEvent.offsetY >= yTop
    ) {
      newY = Math.abs((event.nativeEvent.offsetY - yTop) / (yBottom - yTop));
      newY = (newY - 1) * -1;
      newY = newY * Math.abs(yMax - yMin) + yMin;
    } else {
      newY = 0;
    }

    if (
      event.nativeEvent.offsetX <= xBottom &&
      event.nativeEvent.offsetX >= xTop
    ) {
      newX = Math.abs((event.nativeEvent.offsetX - xTop) / (xBottom - xTop));
      newX = newX * Math.abs(xMax - xMin) + xMin;
    }

    if (lineTypeToDraw === 0) {
      let vLines = [...verticalLines];
      let vLinesCanvasPos = [...verticalLinesCanvasPos];
      if (verticalLines.length >= 2) {
        vLines = [verticalLines[1]];
        vLinesCanvasPos = [verticalLinesCanvasPos[1]];
      } else {
      }
      vLines.push(newX);
      vLinesCanvasPos.push(event.nativeEvent.offsetX);
      setLines(0, vLinesCanvasPos, vLines);
      setVertAndExtLinesIntersects(
        extendedLines, extendedLinesCanvasPos, vLines, vLinesCanvasPos, setLines);
    } else if (lineTypeToDraw === 1) {
      setLines(1, event.nativeEvent.offsetY, newY);
    } else if (lineTypeToDraw === 2) {
      setVertAndExtLinesIntersects(
        extendedLines, extendedLinesCanvasPos, vLines, vLinesCanvasPos, setLines);
    }
  };

  useEffect(() => {
    let yValues = datas.map((item) => item.data.map((value) => value.y));
    let yMaxValue = yValues[0]?.reduce(
      (a, b) => Math.max(a, b),
      Number.MIN_SAFE_INTEGER
    );
    yMaxValue = yValues[1]?.reduce((a, b) => Math.max(a, b), yMaxValue);
    let yMinValue = yValues[0]?.reduce(
      (a, b) => Math.min(a, b),
      Number.MAX_SAFE_INTEGER
    );
    yMinValue = yValues[1]?.reduce((a, b) => Math.min(a, b), yMinValue);
    setYMax(Math.ceil(yMaxValue) + Math.ceil(yMaxValue / 20));
    setYMin(Math.floor(yMinValue));
    setData({
      labels: labels ?? [1, 2, 3],
      datasets: datas ?? [],
    });
  }, [labels, datas]);

  const drawLines = () => {
    let chart = chartRef.current;
    chart.render();
    const ctx = chart.ctx;
    let yTop = chart.chartArea.top;
    let yBottom = chart.chartArea.bottom;
    let xTop = chart.chartArea.left;
    let xBottom = chart.chartArea.right;
    ctx.save();
    ctx.setLineDash([]);
    verticalLinesCanvasPos.forEach((l) => {
      ctx.beginPath();
      ctx.moveTo(l, yTop);
      ctx.lineTo(l, yBottom);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#4DA9E4";
      ctx.stroke();
      ctx.closePath();
    });
    if (horizontalLineCanvasPos) {
      ctx.beginPath();
      ctx.moveTo(xTop, horizontalLineCanvasPos);
      ctx.lineTo(xBottom, horizontalLineCanvasPos);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#4DA9E4";
      ctx.stroke();
      ctx.closePath();
    }
    if (extendedLinesCanvasPos.length === 2) {
      ctx.beginPath();
      ctx.moveTo(extendedLinesCanvasPos[0].x, extendedLinesCanvasPos[0].y);
      ctx.lineTo(extendedLinesCanvasPos[1].x, extendedLinesCanvasPos[1].y);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#4DA9E4";
      ctx.stroke();
      ctx.closePath();
    }
    ctx.restore();
  };

  useEffect(() => {
    drawLines();
  }, [updateCount]);

  const redrawLines = (chart, vLines, hlines, eLines, goodDirection) => {
    const ctx = chart.ctx;
    let top = chart.chartArea.top;
    let bottom = chart.chartArea.bottom;
    let left = chart.chartArea.left;
    let right = chart.chartArea.right;
    ctx.save();
    vLines.forEach((l) => {
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.moveTo(l, top);
      ctx.lineTo(l, bottom);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#4DA9E4";
      ctx.stroke();
      ctx.restore();
    });
    if (hlines) {
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.moveTo(left, hlines);
      ctx.lineTo(right, hlines);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#4DA9E4";
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }
    if (eLines.length === 2) {
      ctx.beginPath();
      ctx.setLineDash([]);
      let border1 = toBorder(
        extendedLinesCanvasPos[0].x,
        extendedLinesCanvasPos[0].y,
        extendedLinesCanvasPos[1].x,
        extendedLinesCanvasPos[1].y,
        left,
        top,
        right,
        bottom
      );
      let border2 = toBorder(
        extendedLinesCanvasPos[1].x,
        extendedLinesCanvasPos[1].y,
        extendedLinesCanvasPos[0].x,
        extendedLinesCanvasPos[0].y,
        left,
        top,
        right,
        bottom
      );
      ctx.moveTo(border1.x, border1.y);
      ctx.lineTo(extendedLinesCanvasPos[0].x, extendedLinesCanvasPos[0].y);
      ctx.moveTo(eLines[0].x, eLines[0].y);
      ctx.lineTo(eLines[1].x, eLines[1].y);
      ctx.moveTo(border2.x, border2.y);
      ctx.lineTo(extendedLinesCanvasPos[1].x, extendedLinesCanvasPos[1].y);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#4DA9E4";
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }
    if ((hlines && vLines.length === 2) || (eLines.length === 2 && vLines.length === 2)) { 
      let badY2 = 0;
      let goodY2 = 0;
      let intersect1 = {x:0,y:0};
      let intersect2 = {x:0,y:0};
      if (goodDirection) {
        badY2 = bottom;
        goodY2 = top;
      } else {
        badY2 = top;
        goodY2 = bottom;
      }
      if(!hlines) {
        intersect1 = intersectPoint(eLines,vLines[0]);
        intersect2 = intersectPoint(eLines,vLines[1]);
      } else {
        let line=[{x:left,y:hlines},{x:right,y:hlines}]
        intersect1 = intersectPoint(line,vLines[0]);
        intersect2 = intersectPoint(line,vLines[1]);
      }
      ctx.fillStyle = "#FF404080";
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.moveTo(intersect1.x, intersect1.y);
      ctx.lineTo(intersect2.x, intersect2.y);
      ctx.lineTo(intersect2.x, badY2);
      ctx.lineTo(intersect1.x, badY2);
      ctx.closePath();
      ctx.fill();
      ctx.moveTo(left, hlines);
      ctx.lineTo(right, hlines);
      ctx.fillStyle = "#00C78180";
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.moveTo(intersect1.x, intersect1.y);
      ctx.lineTo(intersect2.x, intersect2.y);
      ctx.lineTo(intersect2.x, goodY2);
      ctx.lineTo(intersect1.x, goodY2);
      ctx.closePath();
      ctx.fill();
    }
  };
  useEffect(() => {
    const chart = chartRef.current;
    chart.config._config.plugins = [
      {
        afterRender: () =>
          redrawLines(
            chart,
            verticalLinesCanvasPos,
            horizontalLineCanvasPos,
            extendedLinesCanvasPos,
            goodDirection
          ),
      },
    ];
  }, [
    verticalLinesCanvasPos,
    horizontalLineCanvasPos,
    extendedLinesCanvasPos,
    goodDirection,
  ]);
  return (
    <div>
      <div style={{ margin: "1em", fontSize: "1.5em", fontWeight: 600 }}>
        {chartKey}
      </div>
      <Chart
        ref={chartRef}
        type="scatter"
        onClick={chartClicked}
        data={data}
      />
    </div>
  );
};

export default ScatterChart;

const toBorder = (x1, y1, x2, y2, left, top, right, bottom) => {
  var dx, dy, py, vx, vy;
  vx = x2 - x1;
  vy = y2 - y1;
  dx = vx < 0 ? left : right;
  dy = py = vy < 0 ? top : bottom;
  if (vx === 0) {
    dx = x1;
  } else if (vy === 0) {
    dy = y1;
  } else {
    dy = y1 + (vy / vx) * (dx - x1);
    if (dy < top || dy > bottom) {
      dx = x1 + (vx / vy) * (py - y1);
      dy = py;
    }
  }
  return { x: dx, y: dy };
}

const setVertAndExtLinesIntersects = (extLines, extLinesCanvas, vLines, vLinesCanvas, setLines=()=>{}) => {
  if(extLines.length === 2 && vLines.length === 2) {
    let intersect1 = intersectPoint(
      extLines[0],extLines[1],vLines[0]);
    let intersect2 = intersectPoint(
      extLines[0],extLines[1],vLines[1]);
    let intersectCanvas1 = intersectPoint(
      extLinesCanvas[0],extLinesCanvas[1],vLinesCanvas[0]);
    let intersectCanvas2 = intersectPoint(
      extLinesCanvas[0],extLinesCanvas[1],vLinesCanvas[1]);
    setLines(2, [intersect1, intersect2], [intersectCanvas1, intersectCanvas2]);
  } else if(extLines.length === 2) {
    setLines(2, extLines, extLinesCanvas);
  }
}


const intersectPoint = (line=[{x:0,y:0},{x:5,y:5}], intersectX=1) => {
  let intersect = {};
  intersect.x = intersectX;
  intersect.y = ((line[1].y - line[0].y) / (line[1].x - line[0].x)) * ((intersectX - line[0].x)) + line[0].y;
  return intersect;
}
