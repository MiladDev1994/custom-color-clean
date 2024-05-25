import { useEffect, useMemo, useRef, useState } from "react"
import { useRecoilState } from "recoil"
import { AnyFilterChanged, AppDataState, Filter1DState, FilterActiveIdState, FilterState, GlobalLoadingState, HistsDataState, ImageActiveState, IsModalOpenState, ModalTypeState, activeIndexStateAtom } from "../../recoils/GlobalRecoil"
import Range from "../Common/Range/Range"
import Button from "../Common/Button/Button"
import Select from "../Common/Select/Select"
import LineChart from "../Common/Charts/LineChart"
import { UseOnDataFromIpcMain } from "../../hooks/UseOnDataFromIpcMain"
import ProgressBtn from "../Common/ProgressBtn/ProgressBtn"
import { Toast } from "../../utils/Toast"
import Matris from "../Common/Matris/Matris"
import Image from "../Common/Images/Images"



const LINE = () => {

    const interval = useRef<any>(null)
    const [showFilter, setShowFilter] = useState({
        filters: true,
        matrix: false,
        images: false,
    })
    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)
    const [appData, setAppData] = useRecoilState(AppDataState)
    const [filters, setFilters] = useRecoilState(FilterState)
    const [histsData, setHistsData] = useRecoilState(HistsDataState)
    const [chartUpdateCount, setChartUpdateCount] = useState(0);
    const [lineTypeToDraw, setLineTypeToDraw] = useState(0);
    const [isGoodSelected, setIsGoodSelected] = useState(0);
    const [datasets, setDatasets] = useState<any>({});
    const [progress, setProgress] = useState<any>(100);
    const [result, setResult] = useState<any>({});
    const [randomImageLoading, setRandomImageLoading] = useState(false)
    const [anyFilterChanged, setAnyFilterChanged] = useRecoilState(AnyFilterChanged)
    const [globalLoading, setGlobalLoading] = useRecoilState(GlobalLoadingState)
    const [filterValue, setFilterValue] = useState({
        count: 20,
        influence: 50,
        isActive: true
    })
    const [chartData, setChartData] = useState<any>({})
    const [overFlow, setOverFlow] = useState<any>({
        filters: false,
        matrix: true,
        images: true,
    })

    // const chartata = 
    const numberOfFolder = {
      id: 2, 
      name: "", 
      value: "count",
      option: [
        {id: 1, name: "20 عدد", value: 20},
        {id: 2, name: "50 عدد", value: 50},
        {id: 3, name: "100 عدد", value: 100},
        {id: 4, name: "500 عدد", value: 500},
        {id: 5, name: "1000 عدد", value: 1000},
        {id: 6, name: "همه", value: -1}
      ]
    }

    const convertDatasetToChartData = (datas: any) => {
    //chart data for line plot
    return [
        {
        label: "توزیع پایین بار خوب",
        backgroundColor: "rgba(0, 199, 129,0.2)",
        borderColor: "rgb(0, 199, 129)",
        borderDash: [1,2],
        borderDashOffset: 2,
        borderWidth: 2,
        pointStyle: false,
        hoverRadius: 0,
        pointHoverRadius: 0,
        hitRadius: 0,
        pointHitRadius: 0,
        pointRadius: 0,
        data: datas?.HealthyM.map((item: any, index: any) => ({ x: index, y: (item - (datas?.HealthyStd?.[index]??0)) })) ?? [],
        },
        {
        label: "نمودار بار خوب",
        backgroundColor: "rgba(0, 199, 129,0.2)",
        borderColor: "rgb(0, 199, 129)",
        borderWidth: 2,
        pointStyle: false,
        hoverRadius: 0,
        pointHoverRadius: 0,
        hitRadius: 0,
        pointHitRadius: 0,
        pointRadius: 0,
        data: datas?.HealthyM.map((item: any, index: any) => ({ x: index, y: (item) })) ?? [],
        },
        {
        label: "توزیع بالا بار خوب",
        backgroundColor: "rgba(0, 199, 129,0.2)",
        borderColor: "rgb(0, 199, 129)",
        borderDash: [1,2],
        borderDashOffset: 2,
        borderWidth: 2,
        pointStyle: false,
        hoverRadius: 0,
        pointHoverRadius: 0,
        hitRadius: 0,
        pointHitRadius: 0,
        pointRadius: 0,
        data: datas?.HealthyM.map((item: any, index: any) => ({ x: index, y: (item + (datas?.HealthyStd?.[index]??0))})) ?? [],
        },
        {
        label: "توزیع پایین بار بد",
        backgroundColor: "rgba(255, 64, 64, 0.2)",
        borderColor: "rgb(255, 64, 64)",
        borderDash: [1,2],
        borderDashOffset: 2,
        borderWidth: 2,
        pointStyle: false,
        hoverRadius: 0,
        pointHoverRadius: 0,
        hitRadius: 0,
        pointHitRadius: 0,
        pointRadius: 0,
        data: datas?.NonHealthyM.map((item: any, index: any) => ({ x: index, y: (item - (datas?.NonHealthyStd?.[index]??0)) })) ?? [],
        },
        {
        label: "نمودار بار بد",
        backgroundColor: "rgba(255, 64, 64, 0.2)",
        borderColor: "rgb(255, 64, 64)",
        borderWidth: 2,
        pointStyle: false,
        hoverRadius: 0,
        pointHoverRadius: 0,
        hitRadius: 0,
        pointHitRadius: 0,
        pointRadius: 0,
        data: datas?.NonHealthyM.map((item: any, index: any) => ({ x: index, y: (item) })) ?? [],
        },
        {
        label: "توزیع بالا بار بد",
        backgroundColor: "rgba(255, 64, 64, 0.2)",
        borderColor: "rgb(255, 64, 64)",
        borderDash: [1,2],
        borderDashOffset: 2,
        borderWidth: 2,
        pointStyle: false,
        hoverRadius: 0,
        pointHoverRadius: 0,
        hitRadius: 0,
        pointHitRadius: 0,
        pointRadius: 0,
        data: datas?.NonHealthyM.map((item: any, index: any) => ({ x: index, y: (item + (datas?.NonHealthyStd?.[index]??0)) })) ?? [],
        },
    ];
    };

    UseOnDataFromIpcMain("resultGenerator_chanel", (event: any, data: any) => {
        // console.log(data)
    })

    UseOnDataFromIpcMain("readResultData_chanel", (event: any, data: any) => {
        console.log(data.appData)
        if (!data.status) {
            setGlobalLoading(false)
            return Toast("error", data.error)  
        } 
        setFilters(data.filters)
        setAppData(data.appData)
        setAnyFilterChanged(true)
        const newFilterActive = data.filters.find((ele: any) => ele.id === filterActiveId.id)
        setFilterActiveId(newFilterActive)
        setGlobalLoading(false)
        setShowFilter({
            filters: false,
            matrix: true,
            images: false,
        })
        setTimeout(() => {
            setOverFlow({
                filters: true,
                matrix: false,
                images: true,
            })
        }, 500)
    })

    UseOnDataFromIpcMain("resultGeneratorProgress_chanel", (event: any, data: any) => {
        setProgress(data.progress)
        if (data.progress >= 100) {
            clearInterval(interval.current)
            api_electron.readResultData(filterActiveId.id)
        }
    })

    const rubResultGenerator = () => {
        window.api_electron.resultGenerator({...chartData, ...filterValue})
        interval.current = setInterval(() => {
          api_electron.resultGeneratorProgress()
        } , 500)
    }

    useEffect(() => {
        // console.log(allDatasets)
        let datas: any = {};
        // if (!Object.keys(allDatasets).includes("error")) {
            Object.keys(histsData)?.map((key) => {
            if (key) {
                datas[key] = convertDatasetToChartData(histsData[key]);
            }
            });
        // } else {
        //   navigate("/");
        //   console.log(allDatasets)
        // }
        setDatasets(datas);
    }, [histsData]);

    UseOnDataFromIpcMain("randomImage_chanel", (event: any, data: any) => {
        if (data.status) {
            setFilters(data.filters)
            const filterActive = data.filters.find((ele: any) => ele.id === filterActiveId.id)
            setFilterActiveId(filterActive)
            setRandomImageLoading(false)
        }
    })

    const changeImages = (type: any) => {
        setRandomImageLoading(true)
        api_electron.randomImage({type, id: filterActiveId.id})
    }
    
    console.log(appData)

    const ChartMemo = useMemo(() => {
        return (
            <LineChart
                chartKey={chartData.chart_type}
                labels={[
                    ...Array(
                        histsData?.[chartData?.chart_type]?.["HealthyM"]
                        ?.length
                    ).keys(),
                ]}
                datas={datasets[chartData?.chart_type] ?? []}
                lineTypeToDraw={lineTypeToDraw}
                updateCount={chartUpdateCount}
                setUpdateCount={setChartUpdateCount}
                goodDirection={chartData?.goodDirection ? chartData?.goodDirection : 0}
                isGoodSelected={appData?.app_type ? 1 : 0}
                setLines={(lineType: any, canvasPos: any, lines: any) => {
                    let tempFilter = { ...chartData };
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
                        tempFilter.data.extendedLines?.length >= 2
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
                    let tempFilters: any = {...chartData};
                    tempFilters = tempFilter;
                    setChartData(tempFilters);
                    setChartUpdateCount(chartUpdateCount + 1);
                }}
                verticalLines={chartData?.data?.verticalLines}
                verticalLinesCanvasPos={
                    chartData?.data?.verticalLinesCanvasPos
                }
                horizontalLine={chartData?.data?.horizontalLine}
                horizontalLineCanvasPos={
                    chartData?.data?.horizontalLineCanvasPos
                }
                extendedLines={chartData?.data?.extendedLines}
                extendedLinesCanvasPos={
                    chartData?.data?.extendedLinesCanvasPos
                }
            />
        )
    }, [datasets, chartData, lineTypeToDraw])

    const dropDownHandler = (type: 'filters' | "matrix" | "images") => {
        if (!showFilter.matrix) {
            setTimeout(() => {
                setOverFlow({
                    filters: true,
                    matrix: true,
                    images: true,
                    [type]: false
                })
            }, 500)
        } else setOverFlow({
            filters: true,
            matrix: true,
            images: true,
            // [type]: !showFilter[type]
        })
        setShowFilter({
            filters: false,
            matrix: false,
            images: false,
            [type]: !showFilter[type]
        })
    }



    useEffect(() => {
        const {filterValues, ...other} = filterActiveId
        if(filterValues) setFilterValue(filterValues)
        else setFilterValue({
            count: 20,
            influence: 50,
            isActive: true
        })
        setChartData(other)
        if (!filterActiveId.images) {
            setShowFilter({
                filters: true,
                matrix: false,
                images: false,
            })
            setOverFlow({
                filters: false,
                matrix: true,
                images: true,
            })
        }
    }, [filterActiveId])


    return (
        <div className="w-full flex items-stretch py-3 px-2 gap-2">
            <div className="flex-none relative">
                <div className=" w-[350px] xl:w-[500px] h-[calc(100vh-140px)] sticky top-[125px] rounded-md flex flex-col gap-2">
                     
                    <div className={`${showFilter.filters ? "h-[285px]" : "h-10"} w-full rounded-md overflow-hidden bg-white border border-gray-300 transition-all duration-500 shadow-md shadow-gray-200`}>
                        <Button
                            title="فیلترها"
                            icon="chevron-down"
                            expand='block'
                            fill='light'
                            shape="round"
                            color='gray'
                            iconWidth="1.2rem"
                            iconHeight="1.2rem"
                            direction="row_reverse"
                            iconRotate={showFilter.filters ? "180" : "0"}
                            onClick={() => dropDownHandler("filters")}
                            classNames={{
                                // container: styles.windowBtn
                                container: "w-full h-10 !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md font-bold",
                                section: "!text-sm !flex !items-center !justify-center !overflow-hidden"
                            }}
                        />
                        <div className="flex flex-col gap-3 p-3">
                            <div className="flex items-center justify-center border-b border-gray-200 pb-3">
                                <label className="w-20 text-sm flex-none flex items-center justify-center"> تعداد فولدر : </label>
                                <Select
                                    data={numberOfFolder}
                                    // label="تعداد فولدر"
                                    value={filterValue}
                                    setValue={setFilterValue}
                                    iconRotate
                                    classNames={{
                                        btn: {
                                            container: "!h-9"
                                        }
                                    }}
                                />
                            </div>

                            <Range
                                label="تاثیر فیلتر"
                                min={0}
                                max={100}
                                step={1}
                                value={filterValue.influence}
                                onChange={(e: any) => setFilterValue({...filterValue, influence: +e.target.value})}
                            />

                            {/* <div 
                                className="flex items-center justify-between cursor-pointer pt-4 border-t border-gray-200"
                                onClick={() => setFilterValue({...filterValue, isActive: !filterValue.isActive})}
                            >
                                <label className="text-sm cursor-pointer">روشن بودن فیلترها :</label>
                                <div className={`w-14 h-7 rounded-full relative shadow-inner transition-all duration-300 ${filterValue.isActive ? "bg-sky-500 shadow-sky-600" : "bg-gray-300 shadow-gray-400"} `}>
                                    <div className={`w-5 aspect-square rounded-full absolute top-1 transition-all duration-300 shadow-md ${filterValue.isActive ? "right-8 bg-white shadow-sky-600" : "bg-gray-500 right-1 shadow-gray-400"}`} />
                                </div>
                            </div> */}

                            <ProgressBtn
                                title="محاسبه فیلتر"
                                progress={progress}
                                onSubmit={() => {
                                    setGlobalLoading(true)
                                    setProgress(0)
                                    rubResultGenerator()
                                }}
                                classNames={{
                                    title: "!text-lg"
                                }}
                            />
{/*                             
                            <Button
                                title="اعمال فیلتر"
                                expand='block'
                                fill='basic'
                                shape="round"
                                color='primary'
                                iconWidth="2rem"
                                iconHeight="2rem"
                                onClick={rubResultGenerator}
                                classNames={{
                                    // container: styles.windowBtn
                                    container: " h-10 mt-8 !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md",
                                    section: "!text-lg !flex !items-center !justify-center !overflow-hidden"
                                }}
                            /> */}
                        </div>
                        
                    </div>

                    <div className={`${showFilter.matrix ? "h-[480px]" : "h-10"} w-full rounded-md ${overFlow.matrix ? "overflow-hidden" : ""}  bg-white border border-gray-300 transition-all duration-500 shadow-md shadow-gray-200`}>
                        <Button
                            title="پیش نمایش"
                            icon="chevron-down"
                            expand='block'
                            fill='light'
                            shape="round"
                            color='gray'
                            iconWidth="1.2rem"
                            iconHeight="1.2rem"
                            direction="row_reverse"
                            iconRotate={showFilter.matrix ? "180" : "0"}
                            onClick={() => dropDownHandler("matrix")}
                            disabled={!(filterActiveId?.images && Object.keys(filterActiveId?.images).length)}
                            classNames={{
                                // container: styles.windowBtn
                                container: "w-full h-10 !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md font-bold",
                                section: "!text-sm !flex !items-center !justify-center !overflow-hidden"
                            }}
                        />
                        <div className="h-[calc(100%-50px)] flex pb-2">
                            <Matris
                                // charts={chartValueSelected}
                                // pointSelected={filterActiveId?.idealConfusion?.record ? filterActiveId?.idealConfusion?.record : pointSelectedData}
                                pointSelected={filterActiveId?.result?.total?.[0] ?? {}}
                                // name="نقاط پیشفرض"
                                // onClick={(nickname: any, type: any) => showHideChartUtil({
                                // chartValueSelected,
                                // setChartValueSelected,
                                // chartData: filterActiveId.confusion.chartData,
                                // nickname, 
                                // type,
                                // message: "ابتدا یک فهرست انخاب کنید",
                                // })
                                // }
                            />
                        </div>
                        
                    </div>

                    <div className={`${showFilter.images ? "h-[calc(100vh-235px)]" : "h-10"} w-full rounded-md overflow-hidden bg-white border border-gray-300 transition-all duration-500 shadow-md shadow-gray-200`}>
                        <Button
                            title="عملکرد فیلتر جاری"
                            icon="chevron-down"
                            expand='block'
                            fill='light'
                            shape="round"
                            color='gray'
                            iconWidth="1.2rem"
                            iconHeight="1.2rem"
                            direction="row_reverse"
                            iconRotate={showFilter.images ? "180" : "0"}
                            onClick={() => dropDownHandler("images")}
                            disabled={!(filterActiveId?.images && Object.keys(filterActiveId?.images).length)}
                            classNames={{
                                // container: styles.windowBtn
                                container: "flex-none w-full h-10 !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md font-bold",
                                section: "!text-sm !flex !items-center !justify-center !overflow-hidden"
                            }}
                        />
                        <div className="h-[calc(100%-40px)] p-2">
                            <div className="h-full">

                                <div className={`h-1/2 border-t border-gray-200`}>
                                    <div className="w-full h-10 flex items-center justify-between flex-none py-1">
                                        <span className="opacity-70"> بار خوب </span>
                                        <Button
                                            icon='arrow-clockwise'
                                            expand='block'
                                            fill='transparent'
                                            shape="round"
                                            color='gray'
                                            iconWidth="1.7rem"
                                            iconHeight="1.7rem"
                                            loading={randomImageLoading}
                                            onClick={() => changeImages("healthy")}
                                            disabled={!(filterActiveId?.result?.[filterActiveId.chart_type]?.[0].healthys?.length > filterActiveId?.images?.healthy?.length)}
                                            classNames={{
                                                // container: styles.windowBtn
                                                container: "!w-8 flex-none w-full h-8 !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md font-bold",
                                                section: "!text-sm !flex !items-center !justify-center !overflow-hidden"
                                            }}
                                        />
                                    </div>
                                    <div className={`h-[calc(100%-40px)] overflow-auto p-2`}>
                                        <div className="w-full grid grid-cols-3 gap-1">
                                            {filterActiveId?.images?.healthy.length ?
                                                filterActiveId?.images?.healthy.map((image: any, index: any) => 
                                                    <Image key={index} image={image} type="healthy"/>
                                                ): 
                                                <h1 className="w-full flex items-center justify-center col-span-full">موردی یافت نشد!!!</h1>
                                            }

                                        </div>
                                    </div>
                                </div>



                                <div className={`h-1/2 border-t border-gray-200`}>
                                    <div className="w-full h-10 flex items-center justify-between flex-none py-1">
                                        <span className="opacity-70"> بار بد </span>
                                        <Button
                                            icon='arrow-clockwise'
                                            expand='block'
                                            fill='transparent'
                                            shape="round"
                                            color='gray'
                                            iconWidth="1.7rem"
                                            iconHeight="1.7rem"
                                            loading={randomImageLoading}
                                            onClick={() => changeImages("nonHealthy")}
                                            disabled={!(filterActiveId?.result?.[filterActiveId.chart_type]?.[0].nonhealthys?.length > filterActiveId?.images?.nonHealthy?.length)}
                                            classNames={{
                                                // container: styles.windowBtn
                                                container: "!w-8 flex-none w-full h-8 !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md font-bold",
                                                section: "!text-sm !flex !items-center !justify-center !overflow-hidden"
                                            }}
                                        />
                                    </div>
                                    <div className="h-[calc(100%-40px)] overflow-auto p-2">
                                        <div className="w-full grid grid-cols-3 gap-1">
                                            {filterActiveId?.images?.nonHealthy.length ?
                                                filterActiveId?.images?.nonHealthy.map((image: any, index: any) =>  
                                                    <Image key={index} image={image} type="nonHealthy"/>
                                                ): 
                                                <h1 className="w-full flex items-center justify-center col-span-full">موردی یافت نشد!!!</h1>
                                            }
                                        </div>
                                    </div>
                                </div>


                            </div>

                        </div>
                        
                    
                    </div>

                </div>
            </div>

            <div className="flex-auto bg-white border border-gray-300 rounded-md shadow-xl shadow-gray-300 flex flex-col items-start justify-center px-2">
                <div className="w-full h-12 flex-none flex items-center justify-between border-b border-gray-200 py-2 ">
                    <h5 className="font-bold opacity-60">{` نمودار ${filterActiveId?.chart_type}`}</h5>
                    <div className="h-full flex gap-2">
                        <Button
                            icon="downArrow" // upArrow
                            // title="فیلترها"
                            expand='block'
                            fill={lineTypeToDraw === 3 ? "basic" : "info"}
                            shape="round"
                            color='primary'
                            iconWidth="1.5rem"
                            iconHeight="1.5rem"
                            direction="row_reverse"
                            iconRotate={chartData?.goodDirection ? 180 : 0}
                            disabled={!(chartData?.data?.verticalLines?.length === 2 && (chartData?.data?.horizontalLine || chartData?.data?.extendedLines?.length === 2))}
                            onClick={() => {
                                let dirStyle = !chartData?.goodDirection ? 1 : 0;
                                const tempFilterActive = {...chartData}
                                let tempFilter = [...filters];
                                const filterActiveIndex = tempFilter.findIndex((ele: any) => ele.id === chartData.id)
                                tempFilter.splice(filterActiveIndex, 1)
                                tempFilterActive.goodDirection = dirStyle
                                tempFilter.splice(filterActiveIndex, 0, tempFilterActive)
                                setChartData(tempFilterActive)
                                setFilters(tempFilter)
                            }}
                            classNames={{
                                // container: styles.windowBtn
                                container: "!w-10 !h-full !m-0 !flex !items-center !justify-center flex-none transition-all duration-300 !rounded-md",
                                section: "!text-lg !flex !items-center !justify-center !overflow-hidden"
                            }}
                        />
                        <Button
                            icon="extendedLine"
                            // title="فیلترها"
                            expand='block'
                            fill={lineTypeToDraw === 2 ? "basic" : "info"}
                            shape="round"
                            color='primary'
                            iconWidth="1.5rem"
                            iconHeight="1.5rem"
                            direction="row_reverse"
                            onClick={() => setLineTypeToDraw(2)}
                            classNames={{
                                // container: styles.windowBtn
                                container: "!w-10 !h-full !m-0 !flex !items-center !justify-center flex-none transition-all duration-300 !rounded-md",
                                section: "!text-lg !flex !items-center !justify-center !overflow-hidden"
                            }}
                        />
                        <Button
                            icon="horizontalLine"
                            // title="فیلترها"
                            expand='block'
                            fill={lineTypeToDraw === 1 ? "basic" : "info"}
                            shape="round"
                            color='primary'
                            iconWidth="1.5rem"
                            iconHeight="1.5rem"
                            direction="row_reverse"
                            onClick={() => setLineTypeToDraw(1)}
                            classNames={{
                                // container: styles.windowBtn
                                container: "!w-10 !h-full !m-0 !flex !items-center !justify-center flex-none transition-all duration-300 !rounded-md",
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
                                container: "!w-10 !h-full !m-0 !flex !items-center !justify-center flex-none transition-all duration-300 !rounded-md",
                                section: "!text-lg !flex !items-center !justify-center !overflow-hidden"
                            }}
                        />
                    </div>
                </div>
                <div className="w-full flex-auto p-2">
                    {ChartMemo}
                </div>
            </div>
        </div>
    )
}



export default LINE