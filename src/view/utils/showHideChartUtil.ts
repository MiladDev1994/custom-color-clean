import { chartTheme } from "../Components/IntensityChart/Theme";
import { Toast } from "./Toast";

export const showHideChartUtil = (data: any) => {
    const {
        intensityGraphs,
        setIntensityGraphs,
        chartData,
        nickname,
        type,
        message
    } = data
    if (!intensityGraphs.length) return Toast("error", message);

    const findChart = intensityGraphs.find((item: any) => item.label.replaceAll(" ", "") === nickname)
    if (findChart) {
      const filterChartValueSelected = intensityGraphs.filter((item: any) => item.label.replaceAll(" ", "") !== nickname)
      intensityGraphs.length > 1 && setIntensityGraphs(filterChartValueSelected)
    } else {
      const newChartValueSelected = [...intensityGraphs];
      const createHorizontalData = {
        ...chartTheme.public, 
        ...chartTheme[type],
        data: chartData[type],
      }
      newChartValueSelected.push(createHorizontalData)
      setIntensityGraphs(newChartValueSelected)
    }
}