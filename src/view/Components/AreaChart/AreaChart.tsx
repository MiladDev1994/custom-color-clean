import React, { useEffect, useRef, useState } from "react";
import styles from "../IntensityChart/IntensityChart.module.scss"
import { useRecoilState } from "recoil";
import { AppDataState, FilterActiveIdState, FilterState, GlobalLoadingState, IsModalOpenState, ProgressState, ScatterPointLocationState } from "../../recoils/GlobalRecoil"
import Button from "../Common/Button/Button";
import SingleScatterChart from "../Common/Charts/SingleScatterChart";
import ZoomChart from "../Common/ZoomChart/ZoomChart";
import { UseOnDataFromIpcMain } from "../../hooks/UseOnDataFromIpcMain";
import { chartTheme } from "../IntensityChart/Theme";
import { Toast } from "../../utils/Toast";
import { AccuracyLineByStepUtil } from "../../utils/LineByStepUtils";
import { changeStepByKeyUtil } from "../../utils/changeStepByKeyUtil";
import StepButton from "../Common/StepButton/StepButton";
import Range from "../Common/Range/Range";
import ProgressBtn from "../Common/ProgressBtn/ProgressBtn"
import chartIcon from "../../../../assets/images/dcf852601f6f722d7faaa0c06eb41e37.svg"


const AreaChart = ({
  intensityPointSelectedData,
  areaPointSelectedData,
  intensityGraphs,
  setIntensityGraphs,
  areaGraphs,
  setAreaGraph,
  areaOnClick,
  intensityOnClick,
  chartSize,
  steChartSize,
  intensityChartSize,
  setAreaPointSelectedData,
  setIntensityPointSelectedData,
  setFilesPath,
  setMatrixData,
  setLineTypeToDraw,
  onSubmit,
}: any) => {
  
  const rangeInput = [
    {label: "حداقل سهم خرابی در دوربین بالا", type: "influenceTop"},
    {label: "حداقل سهم خرابی در دوربین پایین", type: "influenceDown"}
]
    // const [chartSize, steChartSize] = useState<any>({});
    const interval = useRef(null)
    const [filters, setFilters] = useRecoilState(FilterState)
    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)
    const [chartUpdateCount, setChartUpdateCount] = useState(0);
    const [H_NH, setH_NH] = useState([])
    const [clicked, setClicked] = useState(false)
    const [loading, setLoading] = useState(false);
    const [chartAnimation, setChartAnimation] = useState(true)
    const [max, setMax] = useState(1)
    const [activeIndex, setActiveIndex] = useState(0);
    const [progress, setProgress] = useRecoilState(ProgressState)
    const [appData, setAppData] = useRecoilState(AppDataState)
    const [isModalOpen, setIsModalOpen] = useRecoilState(IsModalOpenState);
    const [globalLoading, setGlobalLoading] = useRecoilState(GlobalLoadingState)
    const [idealLoading, setIdealLoading] = useState(false)
    const [scatterPointLocation, setScatterPointLocation] = useRecoilState(ScatterPointLocationState)
    const [chartZoom, setChartZoom] = useState<any>({
      min: 1,
      max: 1,
    })
    const [value, setValue] = useState<any>({
      influenceTop: filterActiveId.influenceTop,
      influenceDown: filterActiveId.influenceDown,
    })
    let verticalLinesValueIntensity = Number(intensityPointSelectedData?.position?.verticalLines?.join("")).toFixed(0);
    let verticalLinesValueArea = Number(areaPointSelectedData?.verticalLines?.join("")).toFixed(0);
  
    const nums_structure = [
      {type: "numsNH", nickname: "numsNH", title: "فراوانی خراب", style: "danger"},
      {type: "numsH", nickname: "numsH", title: "فراوانی سالم", style: "primary"},
    ]
  
  
    // const setAccuracyLinesHandler = (lineType: any, canvasPos: any, getLines: any) => {
    //   setFilesPath({})
    //   const lines = getLines.join("") >= pointSelectedData.numsLength ? [pointSelectedData.numsLength] : getLines
    //   let tempFilter = { ...filtersArea?.[activeIndex] };
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
    //   let tempFilters = [...filtersArea];
    //   tempFilters[activeIndex] = tempFilter;
    //   setFiltersArea(tempFilters);
    //   setChartUpdateCount(chartUpdateCount + 1);
    // }
  
    const stepData = {
      intensityGraphs,
      setIntensityGraphs,
      message: "ابتدا یک نقطه در نمودار شدت خرابی انتخاب کنید",
      pointData: areaPointSelectedData,
      verticalLinesValue: verticalLinesValueArea,
      allRecord: intensityPointSelectedData.numsH,
      chartLength: intensityPointSelectedData.numsLength,
      chartSize,
      percent: 1,
      setAccuracyLinesHandler: areaOnClick,
      chartData: H_NH
    }
    const stepIntensityData = {
      intensityGraphs,
      setIntensityGraphs,
      message: "ابتدا یک فهرست انخاب کنید",
      pointData: intensityPointSelectedData.position,
      verticalLinesValue: verticalLinesValueIntensity,
      allRecord: filterActiveId.confusion.allRecord,
      chartLength: filterActiveId.confusion.chartLength,
      chartSize: intensityChartSize,
      percent: 100,
      setAccuracyLinesHandler: intensityOnClick,
      chartData: filterActiveId.confusion.chartData,
    }
  
    UseOnDataFromIpcMain("calculateAcc_chanel", (event: any, data: any) => {
      if (data.status) {
        const {filters, idealPoint, graph, appData} = data.data
        setFilters(filters)
        setAppData(appData)
        
        const newScatterPointLocation = {...scatterPointLocation}
        delete newScatterPointLocation?.[filterActiveId.id]
        setScatterPointLocation(newScatterPointLocation)

        if (idealPoint.areaGraphs) setAreaGraph(idealPoint.areaGraphs)
        if (idealPoint.areaPointSelectedData) setAreaPointSelectedData(idealPoint.areaPointSelectedData)
        if (idealPoint.intensityPointSelectedData) setIntensityPointSelectedData(idealPoint.intensityPointSelectedData)
        if (idealPoint.filesPath) setFilesPath(idealPoint.filesPath)
        if (idealPoint.idealConfusion) {
          const newIntensityGraphs = [...intensityGraphs]
          newIntensityGraphs.unshift(graph)
          setIntensityGraphs(newIntensityGraphs)
          setMatrixData(idealPoint.idealConfusion.record)
          const newFilterActive = filters.find((ele: any) => ele.id === filterActiveId.id)
          setFilterActiveId(newFilterActive)
        }
        setGlobalLoading(false)
        setIdealLoading(false)
      } else Toast("error", data.message)
    })
    
  
    const getIdealPoint = () => {
      if (!Object.keys(areaPointSelectedData).length) return Toast("error", "ابتدا یک نقطه در نمودار مساحت خرابی انتخاب کنید");
      setGlobalLoading(true)
      setIdealLoading(true)
      window.api_electron.calculateAcc({
        id: filterActiveId.id,
        verticalLinesValueIntensity, 
        verticalLinesValueArea, 
        areaPointSelectedData,
        intensityPointSelectedData,
        areaGraphs,
        intensityGraphs
      })
    }
  
  
    useEffect(() => {
      if (intensityPointSelectedData?.numsH?.length) {
        const data: any = []
        const chartData: any = {}
        const elements = ["numsH", "numsNH"];
        elements.map(item => {
          const XY = intensityPointSelectedData[item].map((ele: any, index: any) => {
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
        setAreaGraph(data)
        
        const values: any = []
        data.length && data.map((item: any) => item.data.map((ele: any) => values.push(ele.y)))
        setMax(Math.ceil(Math.max(...values)))
      }
    } , [intensityPointSelectedData])
  
    useEffect(() => {
      if (intensityPointSelectedData?.position && Object.keys(intensityPointSelectedData?.position).length) {
        AccuracyLineByStepUtil({...stepData, type: "default"})
      }
    }, [clicked])

    useEffect(() => {
      setValue({
        influenceTop: filterActiveId.influenceTop,
        influenceDown: filterActiveId.influenceDown,
      })
    }, [filterActiveId])


    return (
      <div className={styles.chartBox} tabIndex={0} onKeyDown={(e) => changeStepByKeyUtil(e, stepData)}>
        <div className={`${styles.descriptionBox} w-[350px] xl:w-[500px] p-4`}>
          <div className={styles.actionBox}>
            <div className="flex flex-col gap-3 border-b border-gray-300 pb-4">
              {rangeInput?.map(item => 
                  <Range
                      key={item.type}
                      label={item.label}
                      min={0}
                      max={1}
                      step={0.1}
                      Percent
                      value={value[item.type]}
                      onChange={(e: any) => setValue({...value, [item.type]: e.target.value})}
                  />
              )}
              <ProgressBtn
                  title="به روز رسانی نمودار"
                  progress={progress}
                  onSubmit={() => {
                    setGlobalLoading(true)
                    setProgress(0)
                    onSubmit({
                        id: filterActiveId.id,
                        filter_type: "SCATTER",
                        filter_name: filterActiveId.filter_name,
                        ...value
                    }, "SCATTER")
                    setAreaPointSelectedData({})
                    setIntensityPointSelectedData({})
                    setAreaGraph([])
                    setFilesPath({})
                    setLineTypeToDraw(0)
                    setMatrixData({
                      e0: "", e1: "", e4: "", e2: "", 
                      e3: "", e5: "", e6: "", e7: "", 
                      e8: "",
                      n0: "", n1: "", n4: "", n2: "", 
                      n3: "", n5: "", n6: "", n7: "", 
                      n8: "", numsLength: 0
                    })
                  }}
                  classNames={{
                    title: "!text-lg"
                  }}
              />
            </div>

            <div className="flex flex-col gap-8">
              <StepButton
                description="دلتا"
                onClick={(types: any) => {
                  AccuracyLineByStepUtil({...stepIntensityData, type: types})
                }}
                title={isNaN(+verticalLinesValueIntensity) ? "---" : verticalLinesValueIntensity}
              />
              <StepButton
                description="مساحت"
                onClick={(types: any) => {
                  AccuracyLineByStepUtil({...stepData, type: types})
                }}
                title={isNaN(+verticalLinesValueArea) ? "---" : `%${verticalLinesValueArea}`}
              />
              <Button
                color='primary'
                title="محاسبه دقت مطلوب"
                fill='basic'
                outLineSize='1px'
                outlineColor='lightgray'
                expand='block'
                iconWidth="1.5rem"
                iconHeight="1.5rem"
                direction='row_reverse'
                onClick={getIdealPoint}
                loading={idealLoading}
                classNames={{
                  container: "!h-12 rounded-md transition-all duration-300",
                  section: "!text-lg !flex !items-center !justify-center !overflow-hidden"
                }}
              />
            </div>
            
          </div>
        </div>
  
        <div className="w-full flex-auto flex flex-col items-center justify-center bg-white border border-gray-300 rounded-lg shadow-xl px-2">

          {areaGraphs.length ?
            <>
              <div className="w-full h-12 flex-none flex items-center justify-between border-b border-gray-200 py-2">
                <h4 className="font-bold opacity-60">نمودار مساحت خرابی</h4>
                <div className="flex items-center justify-end text-sm gap-3">
                  <div className="flex gap-2 p-1 rounded-md border-2 border-sky-600 bg-sky-300 text-sky-900">
                    <span className="w-12 text-center font-bold opacity-80">{intensityPointSelectedData?.numsH?.find((ele: any) => ele.id === areaPointSelectedData.verticalLines?.[0])?.value?.toFixed(3) ?? "---"}</span>
                    <span className="w-24">: فراوانی سالم‌ها</span>
                  </div>
                  <div className="flex gap-2 p-1 rounded-md border-2 border-red-600 bg-red-300 text-red-900">
                    <span className="w-12 text-center font-bold opacity-80">{intensityPointSelectedData?.numsNH?.find((ele: any) => ele.id === areaPointSelectedData.verticalLines?.[0])?.value?.toFixed(3) ?? "---"}</span>
                    <span className="w-24">: فراوانی خراب‌ها</span>
                  </div>
                </div>
                </div>
              
              <div className="w-full flex-auto flex items-center justify-between">
                <div className={styles.chart}>
                  
                    <SingleScatterChart 
                      // chartKey={filtersArea[activeIndex]?.chartKey}
                      labels={intensityPointSelectedData ? [...Array(Math.ceil(+intensityPointSelectedData?.numsLength * 1.02)).keys()] : []}
                      datas={areaGraphs}
                      lineTypeToDraw={0}
                      updateCount={chartUpdateCount}
                      // setUpdateCount={setChartUpdateCount}
                      goodDirection={0}
                      setLines={areaOnClick}
                      verticalLines={areaPointSelectedData?.verticalLines}
                      verticalLinesCanvasPos={
                        areaPointSelectedData?.verticalLinesCanvasPos
                      }
                      horizontalLine={areaPointSelectedData?.horizontalLine}
                      horizontalLineCanvasPos={
                        areaPointSelectedData?.horizontalLineCanvasPos
                      }
                      extendedLines={areaPointSelectedData?.extendedLines}
                      extendedLinesCanvasPos={
                        areaPointSelectedData?.extendedLinesCanvasPos
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
                          // legend: {
                          //   display: true, // Toggle display of the legend
                          //   position: 'top', // Position the legend on the top
                          //   align: 'center', // Align the legend in the center
                          //   labels: {
                          //     boxWidth: 40, // Width of the color box
                          //     boxHeight: 10, // Height of the color box
                          //     color: 'rgb(255, 99, 132)', // Color of the text
                          //     text: 'Custom Legend Title',
                          //     font: {
                          //       size: 12 // Font size
                          //     },
                          //     padding: 20, // Padding between legend items
                          //   // Further customization can be done here
                          //   },
                          //   // title: {
                          //   //   display: true, // Display the title
                          //   //   text: 'Custom Legend Title', // Title text
                          //   // // Additional title configuration
                          //   // },
                          //   // Additional legend configuration
                          // },

                          // tooltip: {
                          //   callbacks: {
                          //     label: function(context, data) {
                          //       return context.dataset.label;
                          //     }
                          //   }
                          // },
                          title: {
                            display: true,
                            // text: "نمودار مساحت خرابی",
                            font: {
                              size: 16,
                              family: "IranSans"
                            }
                          }
                        }

                      }}
                    />
                </div>
                  <div className={styles.zoomBox}>
                    <ZoomChart
                      chartHeight={chartSize.height}
                      setZoom={setChartZoom}
                      setAnimation={setChartAnimation}
                      max={max}
                      type="number"
                    />
                  </div>
              </div>
            </> :
            <div className="w-full h-full flex flex-col items-center justify-center">
                <img src={chartIcon} className="w-72"/>
                <span className="text-xl p-5 opacity-70">هیچ نقطه‌ای در نمودار شدت خرابی انتخاب نشده است !!!</span>
            </div>
          }
        </div>
      </div>
    )
  }

  export default AreaChart;