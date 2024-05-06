import { useEffect, useMemo, useState } from "react"
import Range from "../Range/Range"
import SingleScatterChart from "../Charts/SingleScatterChart"
import Icon from "../Icon/Icon"
import FAKE_HISTS from "./fakeHists"


export function Radio(props: any){
    const {value, error, focus, changeHandler, filterTypeItem, name, title} = props

    return (
        <div className={`relative py-1 col-span-full`}>
            <div className="flex items-center justify-start">
                <label className='after:content-["*"] after:text-red-400 block p-1 text-sm'>{ title }</label>
                {(error && focus) && <span className='text-red-400 text-xs'>{error}</span>}
            </div>
            <div className={`flex items-center justify-center gap-3`}>
                {filterTypeItem?.map((filter: any) => 
                    <div 
                        key={filter.value} 
                        className={`w-full h-12 relative border  rounded-md 
                        flex items-center justify-center transition-all
                        duration-200 
                        ${filter.disable ? 
                            "text-gray-300 bg-gray-200" : 
                            value[name] === filter.value ? 
                                "bg-sky-500 text-white shadow-sky-300 border-sky-500 shadow-lg" : 
                                "hover:bg-zinc-100 shadow-gray-200 border-gray-300 shadow-md"
                        }`}
                    >
                        <input 
                            type='radio' 
                            name={name} 
                            value={filter.value}
                            disabled={filter.disable}
                            onChange={changeHandler}
                            className={`w-full h-full absolute left-0 top-0 opacity-0 z-10 ${!filter.disable ? "cursor-pointer" : ""}`}
                        />
                        <span className='text-lg mx-5'>{filter.name}</span>
                        {filter.icon && 
                            <Icon
                                name={filter.icon}
                                color={value[name] === filter.value ? "white" : "#00A2E8"}
                                width="3rem"
                                height="3rem"
                            />
                        }
                        
                    </div>
                )}
            </div>
        </div>
    )
}

export function SCATTER(props: any) {
    const {value, setValue, error, focus} = props
    const rangeInput = [
        {label: "حداقل سهم خرابی در دوربین بالا", type: "influenceTop"},
        {label: "حداقل سهم خرابی در دوربین پایین", type: "influenceDown"}
    ]

    return (
        <>
            {/* <Radio {...props}/> */}
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
        </>
    )
}

export function DEEP(props: any) { return <Radio {...props}/> }


export function SIZE(props: any) {

    const filterTypeItem = [
        {id: 1, name: "رد شدن طول", value: "SizeLength", icon: "Reject By Width", disable: false},
        {id: 2, name: "رد شدن قطر", value: "SizeWidth", icon: "Reject By Length", disable: false},
        {id: 3, name: "نسبت طول و عرض", value: "SizeAspectRatio", icon: "Aspect Ratio", disable: false}
    ]

    const propsChartType = {
        ...props, 
        filterTypeItem, 
    }

    return (
        <>
            {/* <Radio {...props}/> */}
            <Radio {...propsChartType}/>
        </>
    ) 
}

export function LINE(props: any) {
    const {value, changeHandler, title, error, focus} = props
    const [chartInforms, setChartInforms] = useState<any>({})
    const [chartSize, steChartSize] = useState<any>({})

    const convertDatasetToChartData = (informs: any) => {
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
        let informs: any = {};
        Object.keys(FAKE_HISTS)?.map((key) => {
          if (key) {
            informs[key] = (convertDatasetToChartData(FAKE_HISTS[key]));
          }
        });
        setChartInforms(informs)
    }, [])
    

    const ChartType = useMemo(() => {
        return (
            <>
                {
                    Object.keys(chartInforms).length > 0 &&
                    Object.keys(chartInforms).filter(key => !key.toLowerCase().startsWith("size")).map((key) => (
                        <div 
                            key={key}
                            className={`h-44 flex items-center justify-center border border-gray-200 shadow-lg shadow-gray-200 rounded-md relative p-1  transition-all duration-300 ${value.chart_type === key ? "bg-sky-200" : "hover:bg-gray-100"}`}
                        >
                            <input 
                                type="radio" 
                                name="chart_type"
                                className="absolute w-full h-full opacity-0 cursor-pointer"
                                value={key}
                                onChange={changeHandler}
                            />
                            <SingleScatterChart
                                // chartKey={"filters[activeIndex].chartKey"}
                                labels={[...Array(260).keys()]}
                                datas={chartInforms[key] ?? []}
                                steChartSize={steChartSize}
                                height="220px"
                                // width="220px"
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
                                        text: key,
                                        font: {
                                          size: 14,
                                          family: "IranSans"
                                        }
                                      },
                                    },
                                    scales:{
                                      y: {
                                          ticks: {
                                            //   display: false,
                                                font: {
                                                    size: 9,
                                                    family: "IranSans",
                                              },
                                          },
                                      },
                                      x: {
                                          ticks: {
                                            //   display: false,
                                                font: {
                                                    size: 9,
                                                    family: "IranSans",
                                              },
                                          },
                                      }
                                    }
                                }}
                            />
                        </div>
                ))}
            </>
        )
    }, [chartInforms])

    return (
        <>
            {/* <Radio {...props}/>  */}

            <div className="col-span-full py-1 relative">
                <div className="flex items-center justify-start">
                    <label className='after:content-["*"] after:text-red-400 block p-1 text-sm'>{title}</label>
                    {(error && focus) && <span className='text-red-400 text-xs'>{error}</span>}
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {/* {ChartType} */}
                    {
                    Object.keys(chartInforms).length > 0 &&
                    Object.keys(chartInforms).filter(key => !key.toLowerCase().startsWith("size")).map((key) => (
                        <div 
                            key={key}
                            className={`h-44 flex items-center justify-center border border-gray-200 shadow-lg shadow-gray-200 rounded-md relative p-1  transition-all duration-300 ${value.chart_type === key ? "bg-sky-200" : "hover:bg-gray-100"}`}
                        >
                            <input 
                                type="radio" 
                                name="chart_type"
                                className="absolute w-full h-full opacity-0 cursor-pointer"
                                value={key}
                                onChange={changeHandler}
                            />
                            <FakeChar
                                keys={key}
                                chartInforms={chartInforms}
                                steChartSize={steChartSize}
                            />
                        </div>
                ))}
                </div>
                
            </div>
        </>
    ) 
}




const FakeChar = ({chartInforms, keys, steChartSize}: any) => {

    const ChartMemo = useMemo(() => {
        return (
            <SingleScatterChart
                // chartKey={"filters[activeIndex].chartKey"}
                labels={[...Array(260).keys()]}
                datas={chartInforms[keys] ?? []}
                steChartSize={steChartSize}
                height="220px"
                // width="220px"
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
                        text: keys,
                        font: {
                        size: 14,
                        family: "IranSans"
                        }
                    },
                    },
                    scales:{
                    y: {
                        ticks: {
                            //   display: false,
                                font: {
                                    size: 9,
                                    family: "IranSans",
                            },
                        },
                    },
                    x: {
                        ticks: {
                            //   display: false,
                                font: {
                                    size: 9,
                                    family: "IranSans",
                            },
                        },
                    }
                    }
                }}
            />
        )
    }, [])

    return ChartMemo
}

