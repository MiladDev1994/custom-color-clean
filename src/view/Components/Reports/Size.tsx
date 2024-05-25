import { useRecoilState, useRecoilValue } from "recoil"
import SingleScatterChart from "../Common/Charts/SingleScatterChart"
import { FilterActiveIdState, HistsDataState } from "../../recoils/GlobalRecoil"
import { useEffect, useState } from "react"
import ZoomChart from "../Common/ZoomChart/ZoomChart"

const SIZE = () => {

    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)
    const histsData = useRecoilValue(HistsDataState)
    const [chartInforms, setChartInforms] = useState<any>([])
    const [chartSize, steChartSize] = useState<any>({height: 500})
    const [chartZoom, setChartZoom] = useState<any>({
      min: 1,
      max: 1,
    })
    const [chartAnimation, setChartAnimation] = useState(true)

    const convertDatasetToChartData = (informs: any) => {
        // console.log(informs)
        // //chart data for line plot
        // const chartData: any = []
        // const ChartKey = Object.keys(informs)
        // ChartKey.forEach(ele => {
        //     let chart: any = {
        //         label: "توزیع پایین بار خوب",
        //         backgroundColor: "rgba(0, 199, 129,0.2)",
        //         borderColor: "rgb(0, 199, 129)",
        //         borderDash: [1,2],
        //         borderDashOffset: 2,
        //         borderWidth: 2,
        //         pointStyle: false,
        //         hoverRadius: 0,
        //         pointHoverRadius: 0,
        //         hitRadius: 0,
        //         pointHitRadius: 0,
        //         pointRadius: 0,
        //     }
        //     chart.data = informs?.[ele]?.map((item: any, index: any) => ({ x: index, y: (item - (informs?.HealthyStd?.[index]??0)) })) ?? []
        //     chartData.push(chart)
        // })
        // return chartData
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
            data: informs?.HealthyM?.map((item: any, index: any) => ({ x: index, y: (item - (informs?.HealthyStd?.[index]??0)) })) ?? [],
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
            data: informs?.HealthyM?.map((item: any, index: any) => ({ x: index, y: (item) })) ?? [],
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
            data: informs?.HealthyM?.map((item: any, index: any) => ({ x: index, y: (item + (informs?.HealthyStd?.[index]??0))})) ?? [],
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
            data: informs?.NonHealthyM?.map((item: any, index: any) => ({ x: index, y: (item - (informs?.NonHealthyStd?.[index]??0)) })) ?? [],
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
            data: informs?.NonHealthyM?.map((item: any, index: any) => ({ x: index, y: (item) })) ?? [],
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
            data: informs?.NonHealthyM?.map((item: any, index: any) => ({ x: index, y: (item + (informs?.NonHealthyStd?.[index]??0)) })) ?? [],
        },
        ];
    };

    useEffect(() => {
        // console.log(convertDatasetToChartData(histsData[filterActiveId.size_type]))
        setChartInforms(convertDatasetToChartData(histsData[filterActiveId.size_type]))
    }, [filterActiveId])

    // console.log(filterActiveId.size_type)

    return (
        <div className="w-full flex items-center justify-center h-[calc(100vh-115px)] p-3">
            <div className="w-full h-full bg-white border border-gray-300 rounded-md shadow-xl shadow-gray-300 flex items-start justify-center flex-auto p-3">
                {/* <div className="flex-auto px-5"> */}
                    <SingleScatterChart
                        // chartKey={"filters[activeIndex].chartKey"}
                        // labels={[...Array(Math.ceil(chartInforms.data.length * 1.02)).keys()]}
                        labels={[...Array(260).keys()]}
                        datas={chartInforms ?? []}
                        steChartSize={steChartSize}
                        // height="100%"
                        options={{
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
                                    text: filterActiveId.size_type,
                                    font: {
                                    size: 14,
                                    family: "IranSans"
                                    }
                                }
                            },
                            scales:{
                                y: {
                                    // min: 1 * chartZoom.min.toFixed(2),
                                    // max: 100 * chartZoom.max.toFixed(2),
                                    // min: 0,
                                    // max: 100,
                                    // beginAtZero: true,
                                    ticks: {
                                    // type: "logarithmic",
                                    // callback: (value: any, index: any, values: any) => {
                                    //     return (Math.floor(value * 100) + "%")
                                    // },
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
                            },
                        }}
                    />
                {/* </div> */}
                {/* <div className="w-[40px] flex-none flex items-center justify-center h-full relative p-2">
                  <ZoomChart
                    chartHeight={chartSize.height}
                    setZoom={setChartZoom}
                    setAnimation={setChartAnimation}
                    type="Percent"
                    max={1400}
                  />
                </div> */}
            </div>
        </div>
    )
}

export default SIZE