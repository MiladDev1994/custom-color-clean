import React, { useEffect, useState } from "react"
import styles from "./IntensityChart.module.scss"
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil"
// import { AllRecordState, AreaFilterState, ChartDataState, ChartLengthState, FilesPathState, IntensityChartValueSelected, IntensityFilterState, PointSelectedData } from "../Recoil/Atoms"
import SingleScatterChart from "../Common/Charts/SingleScatterChart"
import { AreaFilterState, FilesPathState, FilterActiveIdState, IntensityChartValueSelected, IntensityFilterState, PointSelectedData } from "../../recoils/GlobalRecoil"
// import ZoomChart from "../Common/ZoomChart/ZoomChart"
// import StepButton from "../Common/StepButton/StepButton"
// import Matris from "../Common/Matris/Matris"
import { chartTheme } from "./Theme"
import { AccuracyLineByStepUtil } from "../../utils/LineByStepUtils"
import { changeStepByKeyUtil } from "../../utils/changeStepByKeyUtil"
import { showHideChartUtil } from "../../utils/showHideChartUtil"
import Matris from "../Common/Matris/Matris"
import ZoomChart from "../Common/ZoomChart/ZoomChart"
import StepButton from "../Common/StepButton/StepButton"
// import { AccuracyLineByStepUtil } from "../../Utils/Front/LineByStepUtils"
// import { changeStepByKeyUtil } from "../../Utils/Front/changeStepByKeyUtil"
// import { showHideChartUtil } from "../../Utils/Front/showHideChartUtil"



const IntensityChart = () => {
  
    // const allRecord = useRecoilValue(AllRecordState)
    // const chartData = useRecoilValue(ChartDataState)
    // const chartLength = useRecoilValue(ChartLengthState)
    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)
    
    const [filtersIntensity, setFiltersIntensity] = useRecoilState(IntensityFilterState)
    const [filtersArea, setFiltersArea] = useRecoilState(AreaFilterState)
    const [chartValueSelected, setChartValueSelected] = useRecoilState(IntensityChartValueSelected)
    const [pointSelectedData, setPointSelectedData] = useRecoilState(PointSelectedData)
    const filesPath = useResetRecoilState(FilesPathState)
    
    const [chartUpdateCount, setChartUpdateCount] = useState(0);
    const [chartSize, steChartSize] = useState<any>({});
    const [clicked, setClicked] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0);
    const [lineTypeToDraw, setLineTypeToDraw] = useState(0);
    const [goodDirection, setGoodDirection] = useState(0);
    const [chartAnimation, setChartAnimation] = useState(true)
    const [chartZoom, setChartZoom] = useState<any>({
      min: 1,
      max: 1,
    })
    const verticalLinesValue = Number(filtersIntensity[activeIndex]?.data?.verticalLines?.join("")).toFixed(0);
  
    const e_structure = [
      {type: "e4", nickname: "LabelPositive", title: "دقت بار خوب", style: "sum"},
      {type: "e1", nickname: "FN", title: "بار خوب رد شده", style: "danger_dashed"},
      {type: "e0", nickname: "TP", title: "بار خوب قبول شده", style: "success"},
      {type: "e5", nickname: "LabelNegative", title: "دقت بار بد", style: "sum"},
      {type: "e3", nickname: "TN", title: "بار بد رد شده", style: "success_dashed"},
      {type: "e2", nickname: "FP", title: "بار بد قبول شده", style: "danger"},
      {type: "e8", nickname: "Accuracy", title: "مجموع دقت", style: "sumAccuracy"},
      {type: "e7", nickname: "PredictionNegative", title: "دقت رد شده", style: "sum"},
      {type: "e6", nickname: "PredictionPositive", title: "دقت قبول شده", style: "sum"},
    ]
  
    const setAccuracyLinesHandler = (lineType: any, canvasPos: any, getLines: any) => {
      // console.log(lineType, canvasPos, getLines)
      const lines = getLines.join("") >= filterActiveId.confusion.chartData ? [filterActiveId.confusion.chartData] : getLines
      let tempFilter = { ...filtersIntensity?.[activeIndex] };
      tempFilter.data = { ...tempFilter.data };
      if (lineType === 0) {
        tempFilter.data.verticalLines = lines;
        tempFilter.data.verticalLinesCanvasPos = canvasPos;
      } else if (lineType === 1) {
        tempFilter.data.extendedLines = [];
        tempFilter.data.extendedLinesCanvasPos = [];
        tempFilter.data.horizontalLine = lines;
        tempFilter.data.horizontalLineCanvasPos = canvasPos;
      } else if (lineType === 2) {
        tempFilter.data.horizontalLine = undefined;
        tempFilter.data.horizontalLineCanvasPos = undefined;
        if (
          tempFilter?.data?.extendedLines === undefined ||
          tempFilter.data.extendedLines?.length >= 1
        ) {
          tempFilter.data.extendedLines = [];
          tempFilter.data.extendedLinesCanvasPos = [];
        } else {
          tempFilter.data.extendedLines = [
            ...tempFilter.data.extendedLines,
          ];
          tempFilter.data.extendedLinesCanvasPos = [
            ...tempFilter.data.extendedLinesCanvasPos,
          ];
        }
        tempFilter.data.extendedLines.push(lines);
        tempFilter.data.extendedLinesCanvasPos.push(canvasPos);
      } else if (lineType === 3) {
        tempFilter.data.horizontalLine = undefined;
        tempFilter.data.horizontalLineCanvasPos = undefined;
        tempFilter.data.extendedLines = lines;
        tempFilter.data.extendedLinesCanvasPos = canvasPos;
      }
      let tempFilters = [...filtersIntensity];
      tempFilters[activeIndex] = tempFilter;
      if (tempFilters.length) {
        const findXmlData = filterActiveId.confusion.allRecord.find((item: any) => Math.round(+item.id * 100) === Math.round(Number(lines)))
  
        let numsHIndex = -1;
        let numsNHIndex = -1;
        const numsH = findXmlData?.opencv_storage?.numsH?.data.replaceAll("\n", "").split(" ").map((item: any) => {
          if (item) {
            numsHIndex++
            return {
              id: numsHIndex, 
              value: Number(item)
            }
          }
        }).filter((item: any) => item !== undefined) || []
        const numsNH = findXmlData?.opencv_storage?.numsNH?.data.replaceAll("\n", "").split(" ").map((item: any) => {
          if (item) {
            numsNHIndex++
            return {
              id: numsNHIndex, 
              value: Number(item)
            }
          }
        }).filter((item: any) => item !== undefined) || []
  
        setPointSelectedData({
          ...pointSelectedData,
          ...findXmlData?.opencv_storage,
          numsH,
          numsNH,
          numsLength: numsH.length
        })
  
      }
      setFiltersIntensity(tempFilters);
      setChartUpdateCount(chartUpdateCount + 1);
    }
  
    const stepData = {
      chartValueSelected,
      setChartValueSelected,
      message: "ابتدا یک فهرست انخاب کنید",
      filters: filtersIntensity,
      verticalLinesValue,
      allRecord: filterActiveId.confusion.allRecord,
      chartLength: filterActiveId.confusion.chartLength,
      chartSize,
      percent: 100,
      setAccuracyLinesHandler,
      chartData: filterActiveId.confusion.chartData,
    }
  
    useEffect(() => {
      const createHorizontalData: any = {
        ...chartTheme.public, 
        ...chartTheme["e8"],
        data: filterActiveId.confusion.chartData["e8"],
      }
      Object.keys(filterActiveId.confusion.chartData).length && setChartValueSelected([createHorizontalData])
    } , [filterActiveId.confusion.chartData])
    
    
    useEffect(() => {
      if (filtersIntensity.length) {
        AccuracyLineByStepUtil({...stepData, type: "default"})
      }
    }, [clicked])

    // console.log(chartValueSelected)
    // console.log(filtersIntensity)
    
    useEffect(() => {
      if (chartValueSelected.length) {
        const newChartValueSelected = chartValueSelected.filter((item: any) => !item.label.includes("ideal"));
        // console.log(newChartValueSelected)
        setChartValueSelected(newChartValueSelected)
        setFiltersArea([])
        filesPath()
      }
    } , [filtersIntensity])
    

    return (
      <div className={styles.chartBox} tabIndex={0} onKeyDown={(e) => changeStepByKeyUtil(e, stepData)}>
        
        <div className={styles.descriptionBox}>
          <Matris
            data={e_structure}
            charts={chartValueSelected}
            pointSelected={pointSelectedData}
            // name="نقاط پیشفرض"
            onClick={(nickname: any, type: any) => showHideChartUtil({
              ...stepData, 
              nickname, 
              type,
              message: "ابتدا یک فهرست انخاب کنید",
            })
            }
          />
          <div className={styles.actionBox}>
            <StepButton
              description="دلتا"
              onClick={(types: any) => {
                AccuracyLineByStepUtil({...stepData, type: types})
              }}
              title={isNaN(+verticalLinesValue) ? "---" : verticalLinesValue}
            />
          </div>
        </div>

        <div className={styles.chart}>
          {chartValueSelected.length ?
            <SingleScatterChart
              chartKey={filtersIntensity[activeIndex]?.chartKey}
              labels={filterActiveId?.confusion?.chartLength ? [...Array(+Math.ceil(filterActiveId?.confusion?.chartLength * 1.02)).keys()] : []}
              datas={chartValueSelected}
              lineTypeToDraw={lineTypeToDraw}
              updateCount={chartUpdateCount}
              // setUpdateCount={setChartUpdateCount}
              goodDirection={goodDirection}
              setLines={setAccuracyLinesHandler}
              verticalLines={filtersIntensity?.[activeIndex]?.data?.verticalLines}
              verticalLinesCanvasPos={
                filtersIntensity?.[activeIndex]?.data?.verticalLinesCanvasPos
              }
              horizontalLine={filtersIntensity?.[activeIndex]?.data?.horizontalLine}
              horizontalLineCanvasPos={
                filtersIntensity?.[activeIndex]?.data?.horizontalLineCanvasPos
              }
              extendedLines={filtersIntensity?.[activeIndex]?.data?.extendedLines}
              extendedLinesCanvasPos={
                filtersIntensity?.[activeIndex]?.data?.extendedLinesCanvasPos
              }
              steChartSize={steChartSize}
              setClicked={setClicked}
              clicked={clicked}
              animation={chartAnimation}
              allRecord={filterActiveId.confusion.allRecord}
              height="480px"
              options={{
                maintainAspectRatio : false,
                animation: chartAnimation,
                // animation: {
                //   // animation
                //   x: {
                //     from: 0
                //   },
                //   y: {
                //     from: 0
                //   },
                //   easing: 'easeInOutSine',
                // },
                scales:{
                  y: {
                    min: 1 * chartZoom.min.toFixed(2),
                    max: 1 * chartZoom.max.toFixed(2),
                    // beginAtZero: true,
                    ticks: {
                      // type: "logarithmic",
                      callback: (value: any, index: any, values: any) => {
                        return (Math.floor(value * 100) + "%")
                      },
                      // padding: 10,
                      font: {
                        family: "IranSans",
                      },
                      stepSize: 0.1,
                    },
                    title: {
                      display: true,
                      text: "دقت",
                      color: "#a7a7a7",
                      font: {
                        family: "IranSans",
                        size: 15
                      }
                    }
                  },
                  x: {
                    ticks: {
                      font: {
                        family: "IranSans",
                      },
                    },
                    title: {
                      display: true,
                      text: "دلتا",
                      color: "#a7a7a7",
                      font: {
                        family: "IranSans",
                        size: 15
                      }
                    }
                  },
                  // yAxes: [{
                  //   display: true,
                  //   backgroundColor: "red",
                  //   stacked: true,
                  //   ticks: {
                  //       min: 20, // minimum value
                  //       max: 50 // maximum value
                  //   }
                  // }],
                },
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                    position: "bottom"
                  },
                  // tooltip: {
                  //   callbacks: {
                  //     label: function(context, data) {
                  //       return context.dataset.label;
                  //     }
                  //   }
                  // },
                  title: {
                    display: true,
                    text: "نمودار شدت خرابی",
                    font: {
                      size: 16,
                      family: "IranSans"
                    }
                  }
                }

              }}
              title="نمودار شدت خرابی"
            /> :
            <h1> هیچ فهرستی انتخاب نشده است !!!</h1>
          }
        </div>
        
        {!!chartValueSelected.length &&
          <div className={styles.zoomBox}>
            <ZoomChart
              chartHeight={chartSize.height}
              setZoom={setChartZoom}
              setAnimation={setChartAnimation}
              type="Percent"
              max={1}
            />
          </div>
        }
        
      </div>
    )
  }


  export default IntensityChart;