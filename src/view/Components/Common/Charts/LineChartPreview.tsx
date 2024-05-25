import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, Line } from "react-chartjs-2";
import { useRef } from "react";
// import RadioBtn from "../Common/RadioBtn";

import styles from "./LineChartPreview.module.scss";

const LineChartPreview = ({
  chartKey = "",
  labels = [],
  datas = [],
  // setFilterChartKey,
  // filterChartKey
}: any) => {

  const [data, setData] = useState({
    labels: [1, 2, 3],
    datasets: [],
  });

  useEffect(() => {
    setData({
      labels: labels ?? [1, 2, 3],
      datasets: datas ?? [],
    });
  }, [labels, datas]);

  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current;
    chart.options.plugins.tooltip = false;
  }, [chartRef]);

  // console.log(data)
  
  return (
    <div className={styles.container}>
      {/* <RadioBtn
        value={chartKey}
        isSelected={filterChartKey === chartKey}
        onToggleSelected={() => setFilterChartKey(chartKey)}
        label={chartKey}
        classNames={{ container: styles.RadioBtnContainer }}
      /> */}
      <Chart
        ref={chartRef}
        type="line"
        data={data}
      />
      
      {/* <Line
        ref={chartRef}
        // type="scatter"
        // onClick={chartClicked}
        data={data}
        height="100px"
      /> */}
    </div>
  );
};

export default LineChartPreview;
