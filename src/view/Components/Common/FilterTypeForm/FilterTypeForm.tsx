import { useCallback, useEffect, useState } from "react"
import Range from "../Range/Range"
import LineChartPreview from "../Charts/LineChartPreview"
import SingleScatterChart from "../Charts/SingleScatterChart"


export function FIlterType(props: any){
    const {value, error, focus, changeHandler, filterTypeItem, name, title} = props

    return (
        <div className={`relative py-1 col-span-full`}>
            <label className='after:content-["*"] after:text-red-400 block p-1 text-sm'>{ title }</label>
            <div className={`flex items-center justify-center gap-3`}>
                {filterTypeItem?.map((filter: any) => 
                    <div key={filter.value} className={`w-full h-12 relative border border-gray-300 rounded-md flex items-center justify-center transition-all duration-200 shadow-md shadow-gray-200  ${value[name] === filter.value ? "bg-sky-500" : "hover:bg-zinc-100"}`}>
                        <input 
                            type='radio' 
                            name={name} 
                            value={filter.value}
                            onChange={changeHandler}
                            className='w-full h-full absolute left-0 top-0 opacity-0 cursor-pointer'
                        />
                        <span className='text-lg'>{filter.name}</span>
                    </div>
                )}
            </div>
            {(error[name] && focus[name]) && <span className='absolute text-red-400 text-xs left-1 -bottom-4'>{error[name]}</span>}
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
            {/* <FIlterType {...props}/> */}
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


export function DEEP(props: any) { return <FIlterType {...props}/> }


export function SIZE(props: any) {

    const filterTypeItem = [
        {id: 1, name: "رد شدن طول", value: "SizeLength"},
        {id: 2, name: "رد شدن قطر", value: "SizeWidth"},
        {id: 3, name: "نسبت طول و عرض", value: "SizeAspectRatio"}
    ]

    const propsChartType = {
        ...props, 
        filterTypeItem, 
        name: "size_type",
        title: "نوع نمودار"
    }

    return (
        <>
            <FIlterType {...props}/>
            <FIlterType {...propsChartType}/>
        </>
    ) 
}


export function LINE(props: any) {
    const {value, setValue, error, focus, histsData, changeHandler} = props
    const [chartInforms, setChartInforms] = useState<any>({})
    const [activeTabFilterChartKey, setActiveTabFilterChartKey] = useState<any>();
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
        Object.keys(histsData)?.map((key) => {
          if (key) {
            informs[key] = (convertDatasetToChartData(histsData[key]));
          }
        });

        setChartInforms(informs)
    }, [histsData])

    // console.log(chartInforms)

    return (
        <>
            <FIlterType {...props}/> 

            <div className=" col-span-full ">
                <label className='after:content-["*"] after:text-red-400 block p-1 text-sm'>نوع نمودار</label>
                <div className="grid grid-cols-4 gap-3">
                    {
                        Object.keys(chartInforms).length > 0 &&
                        Object.keys(chartInforms).filter(key => !key.toLowerCase().startsWith("size")).map((key) => (
                            <div 
                                key={key}
                                className={`border border-gray-200 shadow-lg shadow-gray-200 rounded-md relative p-1  transition-all duration-300 ${value.chart_type === key ? "bg-sky-200" : "hover:bg-gray-100"}`}
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
                                    labels={[...Array(5).keys()]}
                                    datas={chartInforms[key] ?? []}
                                    steChartSize={steChartSize}
                                    title={key}
                                />
                            </div>

                            // <span key={key}>{key}</span>
                    ))}
                </div>

            </div>
            
            
        </>
    ) 
}

