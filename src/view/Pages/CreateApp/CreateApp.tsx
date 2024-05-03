import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreateAppFormValidation } from './Validation'
import { Toast } from '../../utils/Toast'
import { AllRecordState, AppDataState, ChartDataState, ChartLengthState, DirectoryValueState, Filter1DState, Filter2DState, FilterActiveIdState, FilterState, HistsDataState, ProgressState } from '../../recoils/GlobalRecoil'
import { useRecoilState, useSetRecoilState } from 'recoil'
import Button from '../../Components/Common/Button/Button'
import Range from '../../Components/Common/Range/Range'
import Select from '../../Components/Common/Select/Select'
import Input from '../../Components/Common/Input/Input'
import ProgressBtn from '../../Components/Common/ProgressBtn/ProgressBtn'
import { UseOnDataFromIpcMain } from '../../hooks/UseOnDataFromIpcMain'
import Header from '../../Components/Header/Header'
import * as FilterTypeForm from "../../Components/Common/FilterTypeForm/FilterTypeForm"

function CreateApp() {

    const DirectoryInputData = [
        {label: "آدرس پوشه‌ی فایل آفلاین خوب", type: "healthy"},
        {label: "آدرس پوشه‌ی فایل آفلاین بد",  type: "not_healthy"}
    ]
    const NamesInput = [
        {label: "نام برنامه", name: "app_name"},
        {label: "نام فیلتر",  name: "filter_name"}
    ]
    // const ProductType = [
    //     {id: 1, name: "ماش", value: "MUNG"},
    //     {id: 2, name: "بادام زمینی", value: "PEANUTS"},
    //     {id: 3, name: "پسته", value: "PISTACHIO"},
    //     {id: 4, name: "تخمه آفتابگردان", value: "SUNFLOWERSEED"},
    // ]
    const rangeInput = [
        {label: "حداقل سهم خرابی در دوربین بالا", type: "influenceTop"},
        {label: "حداقل سهم خرابی در دوربین پایین", type: "influenceDown"}
    ]
    const filterTypeItem = [
        {id: 1, name: "دیپ لرنینگ", value: "DEEP", disable: true},
        {id: 2, name: "سایز", value: "SIZE", disable: false},
        {id: 3, name: "تک بعدی", value: "LINE", disable: false},
        {id: 4, name: "دو بعدی", value: "SCATTER", disable: false},
    ]
    const programType = [
        {
          id: 1, 
          name: "نوع برنامه", 
          value: "app_type",
          option: [
            {id: 1, name: "بار خوب حذف بار بد", value: true},
            {id: 2, name: "بار بد استخراج بار خوب", value: false}
          ]
        },
        {
          id: 2, 
          name: "استاندارد تصویر برداری", 
          value: "product_type",
          option: [
            {id: 1, name: "MNG-01", value: "MUNG"},
            {id: 2, name: "PNT-01", value: "PEANUTS"},
            {id: 3, name: "PST-01", value: "PISTACHIO"},
            {id: 4, name: "SEED-01", value: "SUNFLOWERSEED"}
          ]
        }
    ]
    const navigate = useNavigate()
    const interval = useRef(null)
    const [progress, setProgress] = useRecoilState(ProgressState)
    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)
    const [histsData, setHistsData] = useRecoilState(HistsDataState)
    const [filters, setFilters] = useRecoilState(FilterState)
    const [appData, setAppData] = useRecoilState(AppDataState)
    const [chartType, setChartType] = useState("")
    const [value, setValue] = useState<any>({
        app_name: "",
        filter_name: "",
        healthy: "",
        not_healthy: "",
        product_type: "",
        app_type: null,
        filter_type: "",
        size_type: "",
        chart_type: "",
        influenceTop: 0,
        influenceDown: 0,
        removeBlueBack: false,
    })
    const [error, setError] = useState<any>({
        app_name: "",
        filter_name: "",
        healthy: "",
        not_healthy: "",
        product_type: "",
        app_type: "",
        filter_type: "",
        size_type: "",
        chart_type: ""
    })
    const [focus, setFocus] = useState<any>({
        app_name: false,
        filter_name: false,
        healthy: false,
        not_healthy: false,
        product_type: false,
        app_type: false,
        filter_type: false,
        size_type: false,
        chart_type: false
    })

    const changeHandler = (e: any) => {
        const inputName = e.target.name
        if (inputName === "chart_type") {
            setChartType(e.target.value)
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value
            })
        }
    }

    UseOnDataFromIpcMain("getChartData_chanel", (event: any, data: any) => {
        console.log(data)
    })

    UseOnDataFromIpcMain("readConfusion_chanel", async (event: any, data: any) => {
        if (data.status) {
            const {filters, appData} = data.data
            const findLastFilter = filters.length ? filters.reduce((a: any, b: any) => a.id > b.id ? a : b).id : 0
            setFilterActiveId(findLastFilter)
            setFilters(filters)
            setAppData(appData)
            Toast("success", data.message)
            navigate("/report")
        } else {
            Toast("error", data.message)
        }
    })

    UseOnDataFromIpcMain("redHists_chanel", async (event: any, data: any) => {
        if (data.status) {
            const {hists, filters, appData} = data.data
            const findLastFilter = filters.length ? filters.reduce((a: any, b: any) => a.id > b.id ? a : b).id : 0
            setFilterActiveId(findLastFilter)
            setFilters(filters)
            setAppData(appData)
            setHistsData(hists)
            Toast("success", data.message)
            navigate("/report")
        } else {
            Toast("error", data.message)
        }
    })
    
    UseOnDataFromIpcMain("progress_chanel", (event: any, data: any) => {
        const {progress, filter_type} = data
        setProgress(progress)
        if (progress >= 100) {
            clearInterval(interval.current)
            // setAppData(value)
            if (filter_type === "SCATTER") {
                window.api_electron.readConfusion()
                api_electron.moveMash2DHVFile()
            } else {
                api_electron.redHists()
            }
        }
    })

    const submitHandler = () => {
        if (progress < 100) return
        if (Object.values(error).join("")) {
            setFocus({
                app_name: true,
                filter_name: true,
                healthy: true,
                not_healthy: true,
                product_type: true,
                app_type: true,
                filter_type: true,
                size_type: true,
                chart_type: true
            })
            return Toast("error" , "تمام فیلد هار را پر کنید")
        } 
        setProgress(0)
        window.api_electron.getChartData(value)
        interval.current = setInterval(() => {
          api_electron.progress(value.filter_type)
        } , 500)
    }

    const FilterTypeComponent = FilterTypeForm[value.filter_type as "SCATTER"]
    const filterTypeComponentProps = {
        SCATTER: {
            value, 
            setValue
        },
        SIZE: {
            name: "size_type", 
            title: "نوع نمودار",
            value, 
            changeHandler, 
            error: error.size_type,
            focus: focus.size_type,
        },
        LINE: {
            title: "نوع نمودار",
            value,
            changeHandler,
            error: error.chart_type,
            focus: focus.chart_type,
        },
    }

    useEffect(() => {
        setValue({
            ...value,
            chart_type: chartType
        })
    }, [chartType])

    useEffect(() => {
        setError(CreateAppFormValidation(value))
    }, [value])


    return (
        <>
            <Header 
                hasNew={false}
                hasSave={false}
                hasSaveAs={false}
            />
            <div className={`w-full flex items-start justify-center my-20`}>
                <div className={`w-[1000px] p-1 rounded-xl bg-white border border-gray-200 shadow-2xl shadow-gray-400`}>
                    <h5 className='text-lg p-2 border-b border-gray-200'> ایجاد برنامه جدید </h5>
                    <div className={`grid grid-cols-2 p-2 gap-7`}>

                        {NamesInput.map(ele => 
                            <Input
                                key={ele.name}
                                name={ele.name} 
                                label={ele.label} 
                                value={value[ele.name]} 
                                onBlur={setFocus} 
                                error={error[ele.name]} 
                                focus={focus[ele.name]}
                                onChange={changeHandler}
                                classNames={{
                                    // container: "col-span-full"
                                }}
                            />
                        )}

                        {DirectoryInputData.map(ele => 
                            <DirectoryInput
                                key={ele.type}
                                type={ele.type}
                                label={ele.label} 
                                value={value}
                                error={error[ele.type]} 
                                focus={focus[ele.type]}
                                setValue={setValue}
                            />
                        )}
                        
                        {programType.map(ele => 
                            <Select
                                key={ele.id}
                                data={ele}
                                label={ele.name}
                                value={value}
                                setValue={setValue}
                                iconRotate
                                error={error[ele.value]}
                                focus={focus[ele.value]}
                            />
                        )}

                        <FilterTypeForm.Radio
                            value={value}
                            error={error.filter_type}
                            focus={focus.filter_type}
                            name="filter_type"
                            title="نوع فیلتر"
                            changeHandler={changeHandler}
                            filterTypeItem={filterTypeItem}
                        />

                        {value.filter_type && <FilterTypeComponent {...filterTypeComponentProps[value.filter_type as "SCATTER"]}/>}
                        
                        <div className={`flex items-center justify-start`}>
                            <label className='w-full p-1 flex items-center'>
                                <input 
                                    type='checkbox' 
                                    name='removeBlueBack'
                                    value={value.removeBlueBack}
                                    onChange={changeHandler}
                                    className='w-5 h-5 mx-3' 
                                />
                                حذف بک گراند آبی
                            </label>
                        </div>

                        <ProgressBtn
                            title="ایجاد برنامه"
                            progress={progress}
                            onSubmit={submitHandler}
                        />

                    </div>
                </div>
            </div>
        </>
    )
}


const DirectoryInput = ({type, label, value, setValue, error, focus}: any) => {

    return (
        <div key={type} className={`w-full block relative`}>
            <label className='after:content-["*"] after:text-red-400 block p-1 text-sm'>{label}</label>
            <div className={`flex items-stretch justify-between border border-gray-300 rounded-md overflow-hidden relative`}>
                <Button
                    icon='box-arrow-in-down'
                    expand='equilateral'
                    fill='info'
                    color='gray'
                    iconWidth="1.6rem"
                    iconHeight="1.6rem"
                    onClick={() => {
                        window.api_electron.selectedPath().then((res: any) => res && setValue({...value, [type]: res}))
                    }}
                    classNames={{
                        container: "!flex !flex-none !w-[42px] duration-200 rounded-0"
                    }}
                />
                <input 
                    type='text'
                    placeholder='انتخاب فهرست...'
                    value={value[type]}
                    className="flex-auto p-2 border-0 outline-none font-bold text-sm placeholder:text-gray-400 placeholder:text-sm placeholder:font-thin bg-gray-100"
                    disabled
                />
            </div>
            {(error && focus) && <span className='absolute text-red-400 text-xs left-1'>{error}</span>}
        </div>
    )
}

export default CreateApp;

