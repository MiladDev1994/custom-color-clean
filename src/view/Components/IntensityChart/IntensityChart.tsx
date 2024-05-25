import React, { useEffect, useState } from "react"
import styles from "./IntensityChart.module.scss"
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil"
// import { AllRecordState, AreaFilterState, ChartDataState, ChartLengthState, FilesPathState, IntensityChartValueSelected, IntensityFilterState, PointSelectedData } from "../Recoil/Atoms"
import SingleScatterChart from "../Common/Charts/SingleScatterChart"
import { AreaFilterState, FilesPathState, FilterActiveIdState, IntensityChartValueSelected, IntensityFilterState, IsModalOpenState, ModalTypeState, PointSelectedData } from "../../recoils/GlobalRecoil"
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
import Button from "../Common/Button/Button"
import Icon from "../Common/Icon/Icon"
// import { AccuracyLineByStepUtil } from "../../Utils/Front/LineByStepUtils"
// import { changeStepByKeyUtil } from "../../Utils/Front/changeStepByKeyUtil"
// import { showHideChartUtil } from "../../Utils/Front/showHideChartUtil"



const IntensityChart = ({
  intensityGraphs,
  setIntensityGraphs,
  intensityPointSelectedData,
  intensityOnClick,
  chartSize,
  steChartSize,
  matrixData,
  lineTypeToDraw,
  setLineTypeToDraw
}: any) => {
  
    // const allRecord = useRecoilValue(AllRecordState)
    // const chartData = useRecoilValue(ChartDataState)
    // const chartLength = useRecoilValue(ChartLengthState)
    
    // const [chartUpdateCount, setChartUpdateCount] = useState(0);
    // const [chartSize, steChartSize] = useState<any>({});
    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)
    const [clicked, setClicked] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0);
    const [goodDirection, setGoodDirection] = useState(0);
    const [chartAnimation, setChartAnimation] = useState(true)
    const [modalType, setModalType] = useRecoilState(ModalTypeState);
    const [isModalOpen, setIsModalOpen] = useRecoilState(IsModalOpenState);
    const [chartZoom, setChartZoom] = useState<any>({
      min: 1,
      max: 1,
    })
    const verticalLinesValue = Number(intensityPointSelectedData?.position?.verticalLines?.join("")).toFixed(0);

    const nums_structure = [
      {type: "numsNH", nickname: "numsNH", title: "فراوانی خراب", style: "danger"},
      {type: "numsH", nickname: "numsH", title: "فراوانی سالم", style: "primary"},
    ]

  
    // const setAccuracyLinesHandler = (lineType: any, canvasPos: any, getLines: any) => {
    //   setFilesPath({})
    //   setFiltersArea([])
    //   // console.log(lineType, canvasPos, getLines)
    //   const lines = getLines.join("") >= filterActiveId.confusion.chartData ? [filterActiveId.confusion.chartData] : getLines
    //   let tempFilter = { ...filtersIntensity?.[activeIndex] };
    //   tempFilter.data = { ...tempFilter.data };
    //   if (lineType === 0) {
    //     tempFilter.data.verticalLines = lines;
    //     tempFilter.data.verticalLinesCanvasPos = canvasPos;
    //   } else if (lineType === 1) {
    //     tempFilter.data.extendedLines = [];
    //     tempFilter.data.extendedLinesCanvasPos = [];
    //     tempFilter.data.horizontalLine = lines;
    //     tempFilter.data.horizontalLineCanvasPos = canvasPos;
    //   } else if (lineType === 2) {
    //     tempFilter.data.horizontalLine = undefined;
    //     tempFilter.data.horizontalLineCanvasPos = undefined;
    //     if (
    //       tempFilter?.data?.extendedLines === undefined ||
    //       tempFilter.data.extendedLines?.length >= 1
    //     ) {
    //       tempFilter.data.extendedLines = [];
    //       tempFilter.data.extendedLinesCanvasPos = [];
    //     } else {
    //       tempFilter.data.extendedLines = [
    //         ...tempFilter.data.extendedLines,
    //       ];
    //       tempFilter.data.extendedLinesCanvasPos = [
    //         ...tempFilter.data.extendedLinesCanvasPos,
    //       ];
    //     }
    //     tempFilter.data.extendedLines.push(lines);
    //     tempFilter.data.extendedLinesCanvasPos.push(canvasPos);
    //   } else if (lineType === 3) {
    //     tempFilter.data.horizontalLine = undefined;
    //     tempFilter.data.horizontalLineCanvasPos = undefined;
    //     tempFilter.data.extendedLines = lines;
    //     tempFilter.data.extendedLinesCanvasPos = canvasPos;
    //   }
    //   let tempFilters = [...filtersIntensity];
    //   tempFilters[activeIndex] = tempFilter;
    //   if (tempFilters.length) {
    //     const findXmlData = filterActiveId.confusion.allRecord.find((item: any) => Math.round(+item.id * 100) === Math.round(Number(lines)))
  
    //     let numsHIndex = -1;
    //     let numsNHIndex = -1;
    //     const numsH = findXmlData?.opencv_storage?.numsH?.data.replaceAll("\n", "").split(" ").map((item: any) => {
    //       if (item) {
    //         numsHIndex++
    //         return {
    //           id: numsHIndex, 
    //           value: Number(item)
    //         }
    //       }
    //     }).filter((item: any) => item !== undefined) || []
    //     const numsNH = findXmlData?.opencv_storage?.numsNH?.data.replaceAll("\n", "").split(" ").map((item: any) => {
    //       if (item) {
    //         numsNHIndex++
    //         return {
    //           id: numsNHIndex, 
    //           value: Number(item)
    //         }
    //       }
    //     }).filter((item: any) => item !== undefined) || []
  
    //     setPointSelectedData({
    //       ...pointSelectedData,
    //       ...findXmlData?.opencv_storage,
    //       numsH,
    //       numsNH,
    //       numsLength: numsH.length
    //     })
  
    //   }
    //   setFiltersIntensity(tempFilters);
    //   setChartUpdateCount(chartUpdateCount + 1);
    // }
  
    const stepData = {
      intensityGraphs,
      setIntensityGraphs,
      message: "ابتدا یک فهرست انخاب کنید",
      pointData: intensityPointSelectedData.position,
      verticalLinesValue,
      allRecord: filterActiveId.confusion.allRecord,
      chartLength: filterActiveId.confusion.chartLength,
      chartSize,
      percent: 100,
      setAccuracyLinesHandler: intensityOnClick,
      chartData: filterActiveId.confusion.chartData,
    }
  
    
    useEffect(() => {
      // console.log(filtersIntensity, lineTypeToDraw)
      if (intensityPointSelectedData?.position && Object.keys(intensityPointSelectedData?.position).length && lineTypeToDraw === 0) {
        AccuracyLineByStepUtil({...stepData, type: "default"})
      }
    }, [clicked])

    // console.log(chartValueSelected)
    // console.log(filtersIntensity)
    
    useEffect(() => {
      if (intensityGraphs.length) {
        const newChartValueSelected = intensityGraphs.filter((item: any) => !item.label.includes("ideal"));
        // console.log(newChartValueSelected)
        // setChartValueSelected(newChartValueSelected)
        // setFiltersArea([])
        // setFilesPath()
      }
    } , [intensityPointSelectedData?.position])

    // console.log(lineTypeToDraw)

    return (
      <div className={styles.chartBox} tabIndex={0} onKeyDown={(e) => changeStepByKeyUtil(e, stepData)}>
        
        <div className={`${styles.descriptionBox} w-[350px] xl:w-[500px] pb-5`}>
          {/* <Button
              title="مشخصات فیلتر"
              // icon='box-arrow-in-down'
              expand='block'
              fill='info'
              color='gray'
              shape="round"
              iconWidth="1.6rem"
              iconHeight="1.6rem"
              outlineColor="lightgray"
              disabled={!filterActiveId.id}
              classNames={{
                  container: "!w-full !h-8 !flex !items-center !justify-center !rounded-md !border-0 duration-200",
                  section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
              }}
              onClick={() => {
                  setModalType("FilterDetails");
                  setIsModalOpen(true);
                  // setFileType(typeOfFile.open);
              }}
              // classNames={{container: styles.submitBtn}}
          /> */}
          
          <Matris
            charts={intensityGraphs}
            // pointSelected={filterActiveId?.idealConfusion?.record ? filterActiveId?.idealConfusion?.record : pointSelectedData}
            pointSelected={matrixData}
            // name="نقاط پیشفرض"
            onClick={(nickname: any, type: any) => showHideChartUtil({
              intensityGraphs,
              setIntensityGraphs,
              chartData: filterActiveId.confusion.chartData,
              nickname, 
              type,
              message: "ابتدا یک فهرست انخاب کنید",
            })
            }
          />
          {/* <div className={styles.matrisBox}>
              {nums_structure.map((item: any) => 
                <div 
                  key={item.type} 
                  className={`
                    ${styles.matrixItem}
                    ${styles[item.style]}
                  `} 
                  onClick={() => showHideChartUtil({
                      chartValueSelected,
                      setChartValueSelected,
                      chartData: filterActiveId.confusion.chartData,
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
            </div> */}

          <div className={styles.actionBox}>
            {/* <StepButton
              description="دلتا"
              onClick={(types: any) => {
                AccuracyLineByStepUtil({...stepData, type: types})
              }}
              title={isNaN(+verticalLinesValue) ? "---" : verticalLinesValue}
            /> */}
          </div>
        </div>

        <div className="w-full flex-auto flex flex-col items-center justify-center bg-white border border-gray-300 rounded-lg shadow-xl px-2">
          <div className="w-full h-12 flex-none flex items-center justify-between border-b border-gray-200 py-2">
            <h4 className="font-bold flex-none opacity-60">نمودار شدت خرابی</h4>
            

            <div className="w-96 h-full flex items-center justify-center">
              <div className="w-full text-sm flex items-start justify-center">
                <div className="w-4 aspect-square bg-green-600 rounded-full mx-1" />
                <span>دقت پیشنهادی</span>
              </div>
              <div className="w-full text-sm flex items-start justify-center">
                <div className="w-4 aspect-square bg-blue-400 rounded-full mx-1" />
                <span>دقت مطلوب</span>
              </div>
            </div>

            
            <Button
              icon="image"
              title="H_V عکس‌های"
              expand='block'
              fill={"info"}
              shape="round"
              color='primary'
              iconWidth="1.5rem"
              iconHeight="1.5rem"
              direction="row_reverse"
              disabled={!filterActiveId?.HV_images}
              onClick={() => {
                setIsModalOpen(true)
                setModalType("HV_Images")
              }}
              classNames={{
                  // container: styles.windowBtn
                  container: "!h-8 !m-0 !flex !items-center !justify-center flex-none transition-all duration-300 !rounded-md",
                  section: "!text-lg !flex !items-center !justify-center !overflow-hidden !text-sm"
              }}
            />

            <div className="flex gap-2">
              <Button
                  icon="crosshair"
                  // title="فیلترها"
                  expand='block'
                  fill={lineTypeToDraw === 2 ? "basic" : "info"}
                  shape="round"
                  color='primary'
                  iconWidth="1.5rem"
                  iconHeight="1.5rem"
                  direction="row_reverse"
                  disabled={!filterActiveId?.allIdealPoints}
                  onClick={() => setLineTypeToDraw(2)}
                  classNames={{
                      // container: styles.windowBtn
                      container: "!w-10 !h-8 !m-0 !flex !items-center !justify-center flex-none transition-all duration-300 !rounded-md",
                      section: "!text-lg !flex !items-center !justify-center !overflow-hidden"
                  }}
              />
              <Button
                  icon="verticalLine"
                  // title="فیلترها"
                  expand='block'
                  fill={lineTypeToDraw === 0 ? "basic" : "info"}
                  shape="round"
                  color='primary'
                  iconWidth="1.5rem"
                  iconHeight="1.5rem"
                  direction="row_reverse"
                  onClick={() => setLineTypeToDraw(0)}
                  classNames={{
                      // container: styles.windowBtn
                      container: "!w-10 !h-8 !m-0 !flex !items-center !justify-center flex-none transition-all duration-300 !rounded-md",
                      section: "!text-lg !flex !items-center !justify-center !overflow-hidden"
                  }}
              />
            </div>
            
          </div>
          <div className="w-full flex-auto flex items-center justify-between">
            <div className={styles.chart}>
              {intensityGraphs.length ?
                <SingleScatterChart
                  // chartKey={filtersIntensity[activeIndex]?.chartKey}
                  labels={filterActiveId?.confusion?.chartLength ? [...Array(+Math.ceil(filterActiveId?.confusion?.chartLength * 1.02)).keys()] : []}
                  datas={intensityGraphs}
                  lineTypeToDraw={lineTypeToDraw}
                  // updateCount={chartUpdateCount}
                  // setUpdateCount={setChartUpdateCount}
                  goodDirection={goodDirection}
                  setLines={intensityOnClick}
                  verticalLines={intensityPointSelectedData?.position?.verticalLines}
                  verticalLinesCanvasPos={
                    intensityPointSelectedData?.position?.verticalLinesCanvasPos
                  }
                  horizontalLine={intensityPointSelectedData?.position?.horizontalLine}
                  horizontalLineCanvasPos={
                    intensityPointSelectedData?.position?.horizontalLineCanvasPos
                  }
                  extendedLines={intensityPointSelectedData?.position?.extendedLines}
                  extendedLinesCanvasPos={
                    intensityPointSelectedData?.position?.extendedLinesCanvasPos
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
                        // text: "نمودار شدت خرابی",
                        font: {
                          size: 16,
                          family: "IranSans"
                        }
                      }
                    }

                  }}
                /> :
                <h1> هیچ فهرستی انتخاب نشده است !!!</h1>
              }
            </div>
            
            {!!intensityGraphs.length &&
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


        </div>
        
      </div>
    )
  }


  export default IntensityChart;