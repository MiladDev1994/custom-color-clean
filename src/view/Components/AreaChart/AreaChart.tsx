import React, { useEffect, useState } from "react";
import styles from "../IntensityChart/IntensityChart.module.scss"
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
// import { AreaChartValueSelected, AreaFilterState, FilesPathState, IdealPointMatris, IntensityChartValueSelected, IntensityFilterState, PointSelectedData } from "../Recoil/Atoms";
import { AreaChartValueSelected, AreaFilterState, FilesPathState, FilterActiveIdState, IdealPointMatris, IntensityChartValueSelected, IntensityFilterState, PointSelectedData } from "../../recoils/GlobalRecoil"
// import { AccuracyLineByStepUtil } from "../../Utils/Front/LineByStepUtils";
// import { changeStepByKeyUtil } from "../../Utils/Front/changeStepByKeyUtil";
// import { UseOnDataFromIpcMain } from "../../hooks/UseOnDataFromIpcMain";
import Matris from "../Common/Matris/Matris";
import Icon from "../Common/Icon/Icon";
import Button from "../Common/Button/Button";
// import StepButton from "../Common/StepButton/StepButton";
import SingleScatterChart from "../Common/Charts/SingleScatterChart";
import ZoomChart from "../Common/ZoomChart/ZoomChart";
import { UseOnDataFromIpcMain } from "../../hooks/UseOnDataFromIpcMain";
import { chartTheme } from "../IntensityChart/Theme";
import { Toast } from "../../utils/Toast";
import { AccuracyLineByStepUtil } from "../../utils/LineByStepUtils";
import { changeStepByKeyUtil } from "../../utils/changeStepByKeyUtil";
import { showHideChartUtil } from "../../utils/showHideChartUtil";
import StepButton from "../Common/StepButton/StepButton";
// import { chartTheme } from "../../Pages/Home/Theme";
// import { showHideChartUtil } from "../../Utils/Front/showHideChartUtil";


const AreaChart = () => {
  
    const pointSelectedData = useRecoilValue(PointSelectedData)
    const filtersIntensity = useRecoilValue(IntensityFilterState);
    const [filtersArea, setFiltersArea] = useRecoilState(AreaFilterState)
    const [intensityChartValueSelected, setIntensityChartValueSelected] = useRecoilState(IntensityChartValueSelected)
    const setFilesPath = useSetRecoilState(FilesPathState)
  
    const [chartSize, steChartSize] = useState<any>({});
    const [chartUpdateCount, setChartUpdateCount] = useState(0);
    const [H_NH, setH_NH] = useState([])
    const [chartValueSelected, setChartValueSelected] = useRecoilState(AreaChartValueSelected)
    const [clicked, setClicked] = useState(false)
    const [loading, setLoading] = useState(false);
    const [idealPointMatris, setIdealPointMatris] = useRecoilState(IdealPointMatris)
    const filesPath = useResetRecoilState(FilesPathState)
    const [chartAnimation, setChartAnimation] = useState(true)
    const [max, setMax] = useState(1)
    const [activeIndex, setActiveIndex] = useState(0);
    const [chartZoom, setChartZoom] = useState<any>({
      min: 1,
      max: 1,
    })
    const verticalLinesValueIntensity = Number(filtersIntensity[activeIndex]?.data?.verticalLines?.join("")).toFixed(0);
    const verticalLinesValue = Number(filtersArea[activeIndex]?.data?.verticalLines?.join("")).toFixed(0);
  
  
    const nums_structure = [
      {type: "numsNH", nickname: "numsNH", title: "فراوانی خراب", style: "danger"},
      {type: "numsH", nickname: "numsH", title: "فراوانی سالم", style: "primary"},
    ]
  
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
      const lines = getLines.join("") >= pointSelectedData.numsLength ? [pointSelectedData.numsLength] : getLines
      let tempFilter = { ...filtersArea?.[activeIndex] };
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
      let tempFilters = [...filtersArea];
      tempFilters[activeIndex] = tempFilter;
      setFiltersArea(tempFilters);
      setChartUpdateCount(chartUpdateCount + 1);
    }
  
    const stepData = {
      chartValueSelected,
      setChartValueSelected,
      message: "ابتدا یک نقطه در نمودار شدت خرابی انتخاب کنید",
      filters: filtersArea,
      verticalLinesValue,
      allRecord: pointSelectedData.numsH,
      chartLength: pointSelectedData.numsLength,
      chartSize,
      percent: 1,
      setAccuracyLinesHandler,
      chartData: H_NH
    }
  
    UseOnDataFromIpcMain("readIdealPoint_chanel", (event: any, data: any) => {
      if (data.status) {
        // window.api_electron.readIdealConfusion()
        setFilesPath(data.data.filesPath)
        setIdealPointMatris(data.data.idealConfusion.record)
        const newChartValueSelected = [...intensityChartValueSelected];
        Object.entries(data.data.idealConfusion.pointData).map(([keys, value]) => {
          const createHorizontalData = {
              ...chartTheme.public, 
              ...chartTheme[`${keys}_ideal`],
              data: value,
          }
          newChartValueSelected.push(createHorizontalData)
        })
        setIntensityChartValueSelected(newChartValueSelected)
        setLoading(false)
      }
    })
  
    // UseOnDataFromIpcMain("readIdealConfusion_chanel", (event, data) => {
    //   if (data.status) {
    //     // console.log(data)
    //     setIdealPointMatris(data.data.record)
  
    //     const newChartValueSelected = [...intensityChartValueSelected];
    //     Object.entries(data.data.pointData).map(([keys, value]) => {
    //       const createHorizontalData = {
    //           ...chartTheme.public, 
    //           ...chartTheme[`${keys}_ideal`],
    //           data: value,
    //       }
    //       newChartValueSelected.push(createHorizontalData)
    //     })
  
    //     setIntensityChartValueSelected(newChartValueSelected)
    //   }
    // })
    
  
    const getIdealPoint = () => {
      if (!filtersArea.length) return Toast("error", "ابتدا یک نقطه در نمودار مساحت خرابی انتخاب کنید");
      setLoading(true)
      window.api_electron.readIdealPoint({verticalLinesValueIntensity, verticalLinesValue})
    }
  
  
    useEffect(() => {
      if (pointSelectedData?.numsH?.length) {
        const data: any = []
        const chartData: any = {}
        const elements = ["numsH", "numsNH"];
        elements.map(item => {
          const XY = pointSelectedData[item].map((ele: any, index: any) => {
            return {
              x: index,
              y: ele.value
            }
          })
          const createHorizontalData = {
            ...chartTheme.public, 
            ...chartTheme[item],
            data: XY,
          }
          chartData[item] = XY
          data.push(createHorizontalData)
        })
        setH_NH(chartData)
        setChartValueSelected(data)
        
        const values: any = []
        data.length && data.map((item: any) => item.data.map((ele: any) => values.push(ele.y)))
        setMax(Math.ceil(Math.max(...values)))
      }
    } , [pointSelectedData])
  
    useEffect(() => {
      if (filtersIntensity.length) {
        AccuracyLineByStepUtil({...stepData, type: "default"})
      }
    }, [clicked])
  
    useEffect(() => {
      filesPath()
    } , [filtersArea])
  
  
    return (
      <div className={styles.chartBox} tabIndex={0} onKeyDown={(e) => changeStepByKeyUtil(e, stepData)}>
        <div className={styles.descriptionBox}>
          <Matris
            data={e_structure}
            // name="نقاط مطلوب"
            charts={chartValueSelected}
            pointSelected={idealPointMatris}
          />
          <div className={styles.actionBox}>
            <div className={styles.matrisBox}>
              {nums_structure.map(item => 
                <div 
                  key={item.type} 
                  className={`
                    ${styles.matrixItem}
                    ${styles[item.style]}
                  `} 
                  onClick={() => showHideChartUtil({
                      ...stepData, 
                      nickname: item.nickname, 
                      type: item.type,
                      message: "ابتدا یک نقطه در نمودار شدت خرابی انتخاب کنید",
                    })
                  }
                >
                  <Icon
                    width="2rem"
                    height="2rem"
                    name={chartValueSelected.find((ele: any) => ele.label.replaceAll(" ", "") === item.nickname) ? "check2" : "x"}
                    classNames={`${styles.chartIcon} ${styles[item.style]}`}
                  />
                  <div 
                    className={`${styles.matrixCard}`}
                  >
                    <h5> {item.title} </h5>
                    <h2>{
                      (!isNaN(+verticalLinesValue)) ?
                        `${pointSelectedData[item.type]?.find((ele: any) => ele.id === +verticalLinesValue)?.value.toFixed(3)}`:
                        "---"
                    }</h2>
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.action}>
              <Button
                color='gray'
                title="دریافت نقاط مطلوب"
                fill='info'
                outLineSize='1px'
                outlineColor='lightgray'
                expand='block'
                iconWidth="1.5rem"
                iconHeight="1.5rem"
                direction='row_reverse'
                onClick={getIdealPoint}
                loading={loading}
                classNames={{
                  container: styles.idealBtn
                }}
              />
              <StepButton
                onClick={(types: any) => {
                  AccuracyLineByStepUtil({...stepData, type: types})
                }}
                title={isNaN(+verticalLinesValue) ? "---" : `%${verticalLinesValue}`}
              />
            </div>
            
          </div>
        </div>
  
        <div className={styles.chart}>
          {chartValueSelected.length ?
            <SingleScatterChart 
              chartKey={filtersArea[activeIndex]?.chartKey}
              labels={pointSelectedData ? [...Array(Math.ceil(+pointSelectedData?.numsLength * 1.02)).keys()] : []}
              datas={chartValueSelected}
              lineTypeToDraw={0}
              updateCount={chartUpdateCount}
              // setUpdateCount={setChartUpdateCount}
              goodDirection={0}
              setLines={setAccuracyLinesHandler}
              verticalLines={filtersArea?.[activeIndex]?.data?.verticalLines}
              verticalLinesCanvasPos={
                filtersArea?.[activeIndex]?.data?.verticalLinesCanvasPos
              }
              horizontalLine={filtersArea?.[activeIndex]?.data?.horizontalLine}
              horizontalLineCanvasPos={
                filtersArea?.[activeIndex]?.data?.horizontalLineCanvasPos
              }
              extendedLines={filtersArea?.[activeIndex]?.data?.extendedLines}
              extendedLinesCanvasPos={
                filtersArea?.[activeIndex]?.data?.extendedLinesCanvasPos
              }
              steChartSize={steChartSize}
              setClicked={setClicked}
              animation={chartAnimation}
              clicked={clicked}
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
                    min: max * chartZoom.min.toFixed(2),
                    max: max * chartZoom.max.toFixed(2),
                    ticks: {
                      stepSize: 0.1,
                      callback: (value: any) => {
                        return (value.toFixed(2))
                      },
                      font: {
                        family: "IranSans",
                      },
                    },
                    title: {
                      display: true,
                      text: "فراوانی",
                      color: "#a7a7a7",
                      font: {
                        family: "IranSans",
                        size: 15
                      }
                    }
                  },
                  x: {
                    ticks: {
                      callback: (value: any) => {
                        return (value + "%")
                      },
                      font: {
                        family: "IranSans",
                      },
                    },
                    title: {
                      display: true,
                      text: "درصد مساحت",
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
                    text: "نمودار مساحت خرابی",
                    font: {
                      size: 16,
                      family: "IranSans"
                    }
                  }
                }

              }}
              title="نمودار مساحت خرابی"
            /> :
            <h1> هیچ نقطه‌ای در نمودار شدت خرابی انتخاب نشده است !!!</h1>
          }
        </div>
        {!!chartValueSelected.length &&
          <div className={styles.zoomBox}>
            <ZoomChart
              chartHeight={chartSize.height}
              setZoom={setChartZoom}
              setAnimation={setChartAnimation}
              max={max}
              type="number"
            />
          </div>
        }
  
        {loading && 
          <div className={styles.loading}>
            <Icon
              width="10rem"
              height="10rem"
              name={"loadingAnimation"}
              color="gray"
              classNames={`${styles.loadingIcon}`}
            />
          </div>
        }
      </div>
    )
  }

  export default AreaChart;