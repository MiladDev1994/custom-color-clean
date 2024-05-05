import React, { useEffect, useState } from "react";
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart, Line } from "react-chartjs-2";
import { useRef } from "react";

ChartJS.register(...registerables);


const LineChart = ({
  chartKey = "",
  labels = [],
  datas = [],
  lineTypeToDraw = 0,
  updateCount = 0,
  goodDirection,
  isGoodSelected,
  setLines = () => {},
  verticalLines = [],
  verticalLinesCanvasPos = [],
  horizontalLine,
  horizontalLineCanvasPos,
  extendedLines = [],
  extendedLinesCanvasPos = [],
}: any) => {
  const [data, setData] = useState({
    labels: [1, 2, 3],
    datasets: [],
  });

  const chartRef = useRef(null);
  const [yMax, setYMax] = useState(Number.MIN_SAFE_INTEGER);
  const [yMin, setYMin] = useState(Number.MAX_SAFE_INTEGER);

  const chartClicked = (event: any) => {
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
    newX = chart.scales.x.getValueForPixel(event.nativeEvent.offsetX);
    newY = chart.scales.y.getValueForPixel(event.nativeEvent.offsetY);

    let vLines = [...verticalLines];
    let vLinesCanvasPos = [...verticalLinesCanvasPos];
    if (lineTypeToDraw === 0) {
      if (verticalLines.length >= 2) {
        vLines = [verticalLines[1]];
        vLinesCanvasPos = [verticalLinesCanvasPos[1]];
      } else {
      }
      vLines.push(newX);
      vLinesCanvasPos.push(event.nativeEvent.offsetX);
      setLines(0, vLinesCanvasPos, vLines);
    } else if (lineTypeToDraw === 1) {
      setLines(1, event.nativeEvent.offsetY, newY);
    } else if (lineTypeToDraw === 2) {
      setLines(
        2,
        { y: event.nativeEvent.offsetY, x: event.nativeEvent.offsetX },
        { y: newY, x: newX }
        );
    }
  };

  useEffect(() => {
    let yValues = datas.map((item: any) => item.data.map((value: any) => value.y.toPrecision(6))).flat();
    // console.log("yValues", yValues);
    
    let yMaxValue = yValues?.reduce(
      (a: any, b: any) => Math.max(a, b),
      Number.MIN_SAFE_INTEGER
    );
    // yMaxValue = yValues[1]?.reduce((a, b) => Math.max(a, b), yMaxValue);
    let yMinValue = yValues?.reduce(
      (a: any, b: any) => Math.min(a, b),
      Number.MAX_SAFE_INTEGER
    );
    // yMinValue = yValues?.reduce((a, b) => Math.min(a, b), yMinValue);
    // yMinValue = yValues[1]?.reduce((a, b) => Math.min(a, b), yMinValue);
    setYMax(Math.ceil(yMaxValue) + Math.ceil(yMaxValue * 15 / 100));
    setYMin(Math.floor(yMinValue));
    setData({
      labels: labels ?? [1, 2, 3],
      datasets: datas ?? [],
    });
  }, [labels, datas]);

  const setVertAndExtLinesIntersects = (extLines: any, extLinesCanvas: any, vLines: any, vLinesCanvas: any) => {
    let intersect1 = intersectPoint(
      [extLines[0],extLines[1]],vLines[0]);
    let intersect2 = intersectPoint(
      [extLines[0],extLines[1]],vLines[1]);
    let intersectCanvas1 = intersectPoint(
      [extLinesCanvas[0],extLinesCanvas[1]],vLinesCanvas[0]);
    let intersectCanvas2 = intersectPoint(
      [extLinesCanvas[0],extLinesCanvas[1]],vLinesCanvas[1]);
    setLines(3, [intersectCanvas1, intersectCanvas2], [intersect1, intersect2]);
  }

  const drawLines = () => {
    let chart = chartRef.current;
    chart.render();
    const ctx = chart.ctx;
    let yTop = chart.chartArea.top;
    let yBottom = chart.chartArea.bottom;
    let xTop = chart.chartArea.right;
    let xBottom = chart.chartArea.left;
    ctx.save();
    ctx.setLineDash([]);
    
    verticalLinesCanvasPos.forEach((l: any) => {
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
    let chart = chartRef.current;
    let vlcp: any = [];
    let hlcp;
    let elcp: any = [];
    const setTimeoutId = setTimeout(() => {
      if(verticalLinesCanvasPos.length === 0 && verticalLines.length > 0) {
        if(!chart?.scales.x || !datas[0]) return;
  
        let index = datas[0].data.findIndex((item: any) => item.x === Math.floor(verticalLines[0]));
        let x1 = chart.scales.x.getPixelForValue(datas[0].data[index].x);
        index = datas[0].data.findIndex((item: any) => item.x === Math.floor(verticalLines[1]));
        let x2 = chart.scales.x.getPixelForValue(datas[0].data[index].x);
        vlcp.push(x1)
        vlcp.push(x2)
        setLines(0, vlcp, verticalLines);
      }
      if(horizontalLineCanvasPos === undefined && !isNaN(horizontalLine))
      {
        let  y1 = chart.scales.y.getPixelForValue(horizontalLine);
        hlcp = y1;
        setLines(1, hlcp, horizontalLine);
      }
      if(extendedLinesCanvasPos.length === 0 && extendedLines.length > 0) {
        if(!chart.scales.x) return;
        let index = datas[0].data.findIndex((item: any) => item.x === Math.floor(extendedLines[0].x));
        let x1 = chart.scales.x.getPixelForValue(datas[0].data[index].x);
        index = datas[0].data.findIndex((item: any) => item.x === Math.floor(extendedLines[1].x));
        let x2 = chart.scales.x.getPixelForValue(datas[0].data[index].x);
        let  y1 = chart.scales.y.getPixelForValue(extendedLines[0].y);
        let  y2 = chart.scales.y.getPixelForValue(extendedLines[1].y);
          elcp.push({x:x1, y:y1})
          elcp.push({x:x2, y:y2})
          setLines(3, elcp, extendedLines)
      }
      if(extendedLines.length === 2 &&
        extendedLinesCanvasPos.length === 2 &&
        verticalLines.length === 2 &&
        verticalLinesCanvasPos.length === 2 && 
        (extendedLinesCanvasPos[0].x !== verticalLinesCanvasPos[0] &&
          extendedLinesCanvasPos[0].x !== verticalLinesCanvasPos[1])) {
      setVertAndExtLinesIntersects(
          extendedLines,
          extendedLinesCanvasPos,
          verticalLines,
          verticalLinesCanvasPos
        );
      }
    }, 0)
    return () => clearTimeout(setTimeoutId);
  }, [
    chartRef,
    verticalLinesCanvasPos,
    verticalLines,
    horizontalLineCanvasPos,
    horizontalLine,
    extendedLinesCanvasPos,
    extendedLines
  ]);
  
  useEffect(() => {
    drawLines();
  }, [updateCount]);

  const redrawLines = (chart: any, vLines: any, hlines: any, eLines: any, goodDirection: any, isGoodSelected: any) => {
    const ctx = chart.ctx;
    let top = chart.chartArea.top;
    let bottom = chart.chartArea.bottom;
    let left = chart.chartArea.left;
    let right = chart.chartArea.right;
    ctx.save();
    
    vLines.forEach((l: any) => {
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
    if ((hlines && vLines.length === 2) || 
    (eLines.length === 2 && vLines.length === 2)) { 
      let endPointY = 0;
      let goodY2 = 0;
      let intersect1: any = {x:0,y:0};
      let intersect2: any = {x:0,y:0};
      endPointY = goodDirection ? bottom : top;
      // if (goodDirection) {
      //   endPointY = bottom;
      // } else {
      //   endPointY = top;
      // }
      if(!hlines) {
        intersect1 = intersectPoint(eLines,vLines[0]);
        intersect2 = intersectPoint(eLines,vLines[1]);
      } else {
        let line=[{x:left,y:hlines},{x:right,y:hlines}]
        intersect1 = intersectPoint(line,vLines[0]);
        intersect2 = intersectPoint(line,vLines[1]);
        // console.log("intersect1, intersect2", intersect1, intersect2);
      }      
      ctx.fillStyle = isGoodSelected ? "#00C78180" : "#FF404080";
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.moveTo(intersect1.x, intersect1.y);
      ctx.lineTo(intersect2.x, intersect2.y);
      ctx.lineTo(intersect2.x, endPointY);
      ctx.lineTo(intersect1.x, endPointY);
      ctx.closePath();
      ctx.fill();
      ctx.moveTo(left, hlines);
      ctx.lineTo(right, hlines);
    }
  };
  const test = (chart: any) => {
    const ctx = chart.ctx;
    let xAxis = chart.scales.x;
    if(xAxis) {
      if(chartKey !== "Sat") {
        ctx.fillStyle = grdCreator(chartKey, ctx, xAxis.left, xAxis.width);
        ctx.fillRect(xAxis.left, xAxis.top + 5, xAxis.width, 15);
      } else {
        ctx.fillStyle = grdCreator("SR", ctx, xAxis.left, xAxis.width);
        ctx.fillRect(xAxis.left, xAxis.top + 5, xAxis.width, 5);
        ctx.fillStyle = grdCreator("SB", ctx, xAxis.left, xAxis.width);
        ctx.fillRect(xAxis.left, xAxis.top + 10, xAxis.width, 5);
        ctx.fillStyle = grdCreator("SG", ctx, xAxis.left, xAxis.width);
        ctx.fillRect(xAxis.left, xAxis.top + 15, xAxis.width, 5);
      }
    } 
  }
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
            goodDirection,
            isGoodSelected
          ),
        afterDraw:() => test(chart)
        
      },
    ];
  }, [
    verticalLines,
    verticalLinesCanvasPos,
    horizontalLine,
    horizontalLineCanvasPos,
    extendedLinesCanvasPos,
    goodDirection,
    isGoodSelected,
  ]);
  
  return (
    <div>
      <div style={{ margin: "1em", fontSize: "1.5em", fontWeight: 600 }}>
        {chartKey}
      </div>
      <Chart
        ref={chartRef}
        type="line"
        onClick={chartClicked}
        data={data}
        width="1250px"
        height="800px"
        options={{
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              align: "center",
            },
            // tooltip: false,
          },
          scales: {
            y: {
              min: yMin,
              max: yMax,
            },
            x: {
              ticks: {
                padding:20,
              }
            }
          },
        }}
        onMouseMove={(event) => {
          const chart = chartRef.current;
          if(!chart) return
          const ctx = chart.ctx;
          let top = chart.chartArea.top;
          let bottom = chart.chartArea.bottom;
          let right = chart.chartArea.right;
          let left = chart.chartArea.left;
          let x: any = event.nativeEvent.offsetX;
          let y: any = event.nativeEvent.offsetY;
          if (x >= left && x <= right && y >= top && y <= bottom) {
            chart.update("none");
            ctx.strokeStyle = "#CCCCCC";
            ctx.lineWidth = 2;
            ctx.save();
            if (lineTypeToDraw === 1 || lineTypeToDraw === 2) {
              ctx.beginPath();
              ctx.setLineDash([6]);
              ctx.moveTo(left, y);
              ctx.lineTo(right, y);
              ctx.stroke();
              ctx.closePath();
            }
            if (lineTypeToDraw === 0 || lineTypeToDraw === 2) {
              ctx.beginPath();
              ctx.setLineDash([6]);
              ctx.moveTo(x, top);
              ctx.lineTo(x, bottom);
              ctx.stroke();
              ctx.closePath();
            }
            if (lineTypeToDraw === 2 && extendedLinesCanvasPos.length === 1) {
              ctx.strokeStyle = "rgba(0,125,0,0.5)";
              ctx.beginPath();
              ctx.setLineDash([6]);
              let border1 = toBorder(
                extendedLinesCanvasPos[0].x,
                extendedLinesCanvasPos[0].y,
                x,
                y,
                left,
                top,
                right,
                bottom
              );
              let border2 = toBorder(
                x,
                y,
                extendedLinesCanvasPos[0].x,
                extendedLinesCanvasPos[0].y,
                left,
                top,
                right,
                bottom
              );
              ctx.moveTo(border1.x, border1.y);
              ctx.lineTo(
                extendedLinesCanvasPos[0].x,
                extendedLinesCanvasPos[0].y
              );
              ctx.lineTo(x, y);
              ctx.lineTo(border2.x, border2.y);
              ctx.stroke();
              ctx.closePath();
            }
          }
        }}
      />
    </div>
  );
};

export default LineChart;

const toBorder = (x1: any, y1: any, x2: any, y2: any, left: any, top: any, right: any, bottom: any) => {
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


const intersectPoint = (line=[{x:0,y:0},{x:5,y:5}], intersectX=1) => {
  let intersect: any = {};
  intersect.x = intersectX;
  intersect.y = ((line[1].y - line[0].y) / (line[1].x - line[0].x)) * ((intersectX - line[0].x)) + line[0].y;
  return intersect;
}

const grdCreator = (chartKey: any, ctx: any, x1: any, x2: any) => {
  let grd = ctx.createLinearGradient(x1, 0, x2, 0);
  switch(chartKey) {
    case "Hue":
      grd.addColorStop(0, "#ff0000");
      grd.addColorStop(0.1665, "#ffff00");
      grd.addColorStop(0.3333 , "#00ff00");
      grd.addColorStop(0.50, "#00ffff");
      grd.addColorStop(0.6666, "#0000ff");
      grd.addColorStop(0.8331, "#ff00ff");
      grd.addColorStop(1, "#ff0000");
    break;
    case "SR":
      grd.addColorStop(0, "#fff");
      grd.addColorStop(0.1665 , "#fad0d1");
      grd.addColorStop(0.3333  , "#faa6a6");
      grd.addColorStop(0.50  , "#fa7c7d");
      grd.addColorStop(0.6666  , "#f95353");
      grd.addColorStop(0.8331 , "#f92929");
      grd.addColorStop(1, "#ff0000");
      break;
    case "SG":
      grd.addColorStop(0, "#fff");
      grd.addColorStop(0.1665 , "#d0fbd0");
      grd.addColorStop(0.3333  , "#a6faa5");
      grd.addColorStop(0.50  , "#7df97d");
      grd.addColorStop(0.6666  , "#53fa54");
      grd.addColorStop(0.8331 , "#29fb2a");
      grd.addColorStop(1, "#00ff00");
      break;
    case "SB":
      grd.addColorStop(0, "#fff");
      grd.addColorStop(0.1665 , "#d1d0fa");
      grd.addColorStop(0.3333  , "#a6a7fa");
      grd.addColorStop(0.50  , "#7c7bfa");
      grd.addColorStop(0.6666  , "#5253f9");
      grd.addColorStop(0.8331 , "#2929f9");
      grd.addColorStop(1, "#0000ff");
      break;
    case "Val":
      grd.addColorStop(0, "#000");
      grd.addColorStop(0.1665 , "#333");
      grd.addColorStop(1, "#fff");
      break;
    case "R":
      grd.addColorStop(0, "#000");
      grd.addColorStop(0.1665 , "#330000");
      grd.addColorStop(1, "#ff0000");
      break;
    case "G":
      grd.addColorStop(0, "#000");
      grd.addColorStop(0.1665 , "#003300");
      grd.addColorStop(1, "#00ff00");
      break;
    case "B":
      grd.addColorStop(0, "#000");
      grd.addColorStop(0.1665 , "#000033");
      grd.addColorStop(1, "#0000ff");
      break;
    default:
      break;
  }
  return grd;
}
