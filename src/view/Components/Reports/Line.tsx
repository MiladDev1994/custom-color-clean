import { useEffect, useMemo, useState } from "react"
import { useRecoilState } from "recoil"
import { Filter1DState, FilterActiveIdState, FilterState, HistsDataState, IsModalOpenState, ModalTypeState, activeIndexStateAtom } from "../../recoils/GlobalRecoil"
import Range from "../Common/Range/Range"
import Button from "../Common/Button/Button"
import Select from "../Common/Select/Select"
import LineChart from "../Common/Charts/LineChart"



const LINE = () => {

    const [showFilter, setShowFilter] = useState(false)
    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)
    const [filters, setFilters] = useRecoilState(FilterState)
    const [histsData, setHistsData] = useRecoilState(HistsDataState)
    const [chartUpdateCount, setChartUpdateCount] = useState(0);
    const [lineTypeToDraw, setLineTypeToDraw] = useState(0);
    const [goodDirection, setGoodDirection] = useState(0);
    const [isGoodSelected, setIsGoodSelected] = useState(0);
    const [activeIndex, setActiveIndex] = useRecoilState(activeIndexStateAtom);
    const [datasets, setDatasets] = useState<any>({});
    const [modalType, setModalType] = useRecoilState(ModalTypeState);
    const [isModalOpen, setIsModalOpen] = useRecoilState(IsModalOpenState);

    const numberOfFolder = {
      id: 2, 
      name: "", 
      value: "folder_number",
      option: [
        {id: 1, name: "20 عدد", value: 20},
        {id: 2, name: "50 عدد", value: 50},
        {id: 3, name: "100 عدد", value: 100},
        {id: 4, name: "500 عدد", value: 500},
        {id: 5, name: "1000 عدد", value: 1000},
        {id: 6, name: "همه", value: 0}
      ]
    }

    const [value, setValue] = useState({
        folder_number: 20,
        filter_effect: 50,
        all_filter_effect: true
    })

    
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
  

  const ChartMemo = useMemo(() => {
    return (
        <LineChart
                chartKey={filterActiveId.chart_type}
                labels={[
                    ...Array(
                        histsData?.[filterActiveId?.chart_type]?.["HealthyM"]
                        ?.length
                    ).keys(),
                ]}
                datas={datasets[filterActiveId?.chart_type] ?? []}
                lineTypeToDraw={lineTypeToDraw}
                updateCount={chartUpdateCount}
                setUpdateCount={setChartUpdateCount}
                goodDirection={goodDirection}
                isGoodSelected={isGoodSelected}
                setLines={(lineType: any, canvasPos: any, lines: any) => {
                    console.log(lineType, canvasPos, lines)
                    let tempFilter = { ...filterActiveId };
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
                    let tempFilters: any = {...filterActiveId};
                    tempFilters = tempFilter;
                    console.log(tempFilters)
                    setFilterActiveId(tempFilters);
                    setChartUpdateCount(chartUpdateCount + 1);
                }}
                verticalLines={filterActiveId?.data?.verticalLines}
                verticalLinesCanvasPos={
                    filterActiveId?.data?.verticalLinesCanvasPos
                }
                horizontalLine={filterActiveId?.data?.horizontalLine}
                horizontalLineCanvasPos={
                    filterActiveId?.data?.horizontalLineCanvasPos
                }
                extendedLines={filterActiveId?.data?.extendedLines}
                extendedLinesCanvasPos={
                    filterActiveId?.data?.extendedLinesCanvasPos
                }
                />
    )
  }, [datasets, filterActiveId, lineTypeToDraw])


    return (
        <div className="w-full flex items-stretch py-3 px-2 gap-2">
            <div className="flex-none relative">
                <div className="w-[350px] h-[calc(100vh-140px)] sticky top-[125px] rounded-md flex flex-col gap-2">
                    {/* <h5 className="text-center border-b border-gray-200 py-1 mb-3">تنظیمات</h5> */}
                    {/* <Button
                        title="مشخصات فیلتر"
                        // icon='box-arrow-in-down'
                        expand='block'
                        fill='light'
                        color='gray'
                        shape="round"
                        iconWidth="1.6rem"
                        iconHeight="1.6rem"
                        outlineColor="lightgray"
                        disabled={!filterActiveId.id}
                        classNames={{
                            container: "!h-10 !flex !items-center !justify-center !rounded-md duration-200 shadow-sm !border !border-gray-300",
                            section: "!text-lg !overflow-hidden !flex !items-center !justify-center"
                        }}
                        onClick={() => {
                            setModalType("FilterDetails");
                            setIsModalOpen(true);
                            // setFileType(typeOfFile.open);
                        }}
                        // classNames={{container: styles.submitBtn}}
                    /> */}
                     
                    <div className={`${showFilter ? "h-[340px]" : "h-10"} w-full rounded-md overflow-hidden bg-white border border-gray-300 transition-all duration-300 shadow-md shadow-gray-200`}>
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
                            iconRotate={showFilter ? "180" : "0"}
                            onClick={() => setShowFilter(!showFilter)}
                            classNames={{
                                // container: styles.windowBtn
                                container: "w-full h-10 !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md",
                                section: "!text-lg !flex !items-center !justify-center !overflow-hidden"
                            }}
                        />
                        <div className="flex flex-col gap-2 p-3">
                            <div className="flex items-center justify-center border-b border-gray-200 pb-3">
                                <label className="w-20 text-sm flex-none flex items-center justify-center"> تعداد فولدر : </label>
                                <Select
                                    data={numberOfFolder}
                                    // label="تعداد فولدر"
                                    value={value}
                                    setValue={setValue}
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
                                value={value.filter_effect}
                                onChange={(e: any) => setValue({...value, filter_effect: e.target.value})}
                            />

                            <div 
                                className="flex items-center justify-between cursor-pointer pt-4 border-t border-gray-200"
                                onClick={() => setValue({...value, all_filter_effect: !value.all_filter_effect})}
                            >
                                <label className="text-sm cursor-pointer">تاثیر در همه فیلترها :</label>
                                <div className={`w-14 h-7 rounded-full relative shadow-inner transition-all duration-300 ${value.all_filter_effect ? "bg-sky-500 shadow-sky-600" : "bg-gray-300 shadow-gray-400"} `}>
                                    <div className={`w-5 aspect-square rounded-full absolute top-1 transition-all duration-300 shadow-md ${value.all_filter_effect ? "right-8 bg-white shadow-sky-600" : "bg-gray-500 right-1 shadow-gray-400"}`} />
                                </div>
                            </div>

                            
                            <Button
                                title="اعمال فیلتر"
                                expand='block'
                                fill='basic'
                                shape="round"
                                color='primary'
                                iconWidth="2rem"
                                iconHeight="2rem"
                                onClick={() => {
                                    window.api_electron.minimize()
                                }}
                                classNames={{
                                    // container: styles.windowBtn
                                    container: " h-10 mt-8 !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md",
                                    section: "!text-lg !flex !items-center !justify-center !overflow-hidden"
                                }}
                            />
                        </div>
                        
                    </div>
                </div>
            </div>

            <div className="flex-auto bg-white border border-gray-300 rounded-md shadow-xl shadow-gray-300 flex flex-col items-start justify-center px-2">
                <div className="w-full h-12 flex-none flex items-center justify-between border-b border-gray-200 py-2 ">
                    <Button
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
                            container: "!h-full !flex !items-center !justify-center !rounded-md !border-0 duration-200",
                            section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                        }}
                        onClick={() => {
                            setModalType("FilterDetails");
                            setIsModalOpen(true);
                            // setFileType(typeOfFile.open);
                        }}
                        // classNames={{container: styles.submitBtn}}
                    />
                    <div className="h-full flex gap-2">
                        <Button
                            icon="downArrow" // upArrow
                            // title="فیلترها"
                            expand='block'
                            fill='light'
                            shape="round"
                            color='gray'
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
                            icon="extendedLine"
                            // title="فیلترها"
                            expand='block'
                            fill='light'
                            shape="round"
                            color='gray'
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
                            fill='light'
                            shape="round"
                            color='gray'
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
                            fill='light'
                            shape="round"
                            color='gray'
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