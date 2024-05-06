import { useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import { useRecoilState, useSetRecoilState } from "recoil";
import { AppDataState, FilterActiveIdState, FilterState, HistsDataState, IsModalOpenState, ProgressState } from "../../../recoils/GlobalRecoil";
import * as FilterTypeForm from "../FilterTypeForm/FilterTypeForm"
import ProgressBtn from "../ProgressBtn/ProgressBtn"
import { AddFilterFormValidation } from "../FilterTypeForm/validation";
import { Toast } from "../../../utils/Toast";
import { UseOnDataFromIpcMain } from "../../../hooks/UseOnDataFromIpcMain";
import { useNavigate } from "react-router-dom";


export function NewOrOpen({disableSave, handleSaveFile, setIsModalOpen, setFileType}: any) {

    return (
        <div className={"w-[800px] text-center p-2"}>
            <div className={`w-full text-lg before:content-["اخطار:"] before:text-red-400 before:mx-1`}>
                قبل از باز کردن برنامه جدید، وضعیت برنامه فعلی را مشخص کنید 
            </div>
            <div className={"flex items-center justify-around mt-10 gap-4"}>
                
                <Button
                    title="ذخیره کردن"
                    // icon='box-arrow-in-down'
                    expand='block'
                    fill='info'
                    color='gray'
                    shape="round"
                    iconWidth="1.6rem"
                    iconHeight="1.6rem"
                    outlineColor="lightgray"
                    classNames={{
                        container: "!h-12 !w-[25%] !flex !items-center !justify-center !rounded-md duration-200 ring-1 ring-gray-400 shadow-md shadow-gray-300",
                        section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                    }}
                    onClick={() => !disableSave && handleSaveFile("save")}
                />
                <Button
                    title="ذخیره کردن با نام جدید"
                    expand='block'
                    fill='info'
                    color='gray'
                    shape="round"
                    iconWidth="1.6rem"
                    iconHeight="1.6rem"
                    outlineColor="lightgray"
                    classNames={{
                        container: "!h-12 !w-[25%] !flex !items-center !justify-center !rounded-md duration-200 ring-1 ring-gray-400 shadow-md shadow-gray-300",
                        section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                    }}
                    onClick={() => !disableSave && handleSaveFile("saveAs")}
                />
                <Button
                    title="ذخیره نشود"
                    expand='block'
                    fill='info'
                    color='gray'
                    shape="round"
                    iconWidth="1.6rem"
                    iconHeight="1.6rem"
                    outlineColor="lightgray"
                    classNames={{
                        container: "!h-12 !w-[25%] !flex !items-center !justify-center !rounded-md duration-200 ring-1 ring-gray-400 shadow-md shadow-gray-300",
                        section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                    }}
                    onClick={() => handleSaveFile()}
                />
                <Button
                    title="انصراف"
                    expand='block'
                    fill='info'
                    color='gray'
                    shape="round"
                    iconWidth="1.6rem"
                    iconHeight="1.6rem"
                    outlineColor="lightgray"
                    classNames={{
                        container: "!h-12 !w-[25%] !flex !items-center !justify-center !rounded-md duration-200 ring-1 ring-gray-400 shadow-md shadow-gray-300",
                        section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                    }}
                    onClick={() => {
                        setIsModalOpen(false);
                        setFileType("");
                    }}
                />
            </div>
        </div>
        
    )
}


export function AddFilter() {

    const filterTypeItem = [
        {id: 1, name: "دیپ لرنینگ", value: "DEEP", disable: true},
        {id: 2, name: "سایز", value: "SIZE", disable: false},
        {id: 3, name: "تک بعدی", value: "LINE", disable: false},
        {id: 4, name: "دو بعدی", value: "SCATTER", disable: false},
    ]

    const navigate = useNavigate()
    const interval = useRef(null)
    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)
    const [histsData, setHistsData] = useRecoilState(HistsDataState)
    const [chartType, setChartType] = useState("")
    const [progress, setProgress] = useRecoilState(ProgressState)
    const [filters, setFilters] = useRecoilState(FilterState)
    const [appData, setAppData] = useRecoilState(AppDataState)
    const [isModalOpen, setIsModalOpen] = useRecoilState(IsModalOpenState);
    const [value, setValue] = useState({
        filter_name: "",
        influenceTop: "0",
        influenceDown: "0",
        filter_type: "",
        size_type: "",
        chart_type: "",
    })
    const [focus, setFocus] = useState({
        filter_name: false,
        filter_type: false,
        size_type: false,
        chart_type: false,
    })
    const [error, setError] = useState({
        filter_name: "",
        filter_type: "",
        size_type: "",
        chart_type: "",
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
    
    useEffect(() => {
        setValue({
            ...value,
            chart_type: chartType
        })
    }, [chartType])

    const FilterTypeComponent = FilterTypeForm[value.filter_type as "SCATTER"]

    // const FilterTypeComponent = appData.filter_type === "SCATTER" ? 
    //     FilterTypeForm[appData.filter_type as "SCATTER"] : 
    //     FilterTypeForm[value.filter_type as "Radio"]

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
        }
    }

    UseOnDataFromIpcMain("addFilter_chanel", (event: any, data: any) => {
        if (data.status) {
            const {filters} = data
            const findLastFilter = filters.length ? filters.reduce((a: any, b: any) => a.id > b.id ? a : b) : 0
            setFilterActiveId(findLastFilter)
            setFilters(filters)
            setIsModalOpen(false)
        }
    })

    UseOnDataFromIpcMain("readConfusion_chanel", async (event: any, data: any) => {
        console.log(data)
        if (data.status) {
            const {filters, appData} = data.data
            const findLastFilter = filters.length ? filters.reduce((a: any, b: any) => a.id > b.id ? a : b) : 0
            setFilterActiveId(findLastFilter)
            setFilters(filters)
            setAppData(appData)
            Toast("success", data.message)
            setIsModalOpen(false)
        } else {
            Toast("error", data.message)
        }
    })

    UseOnDataFromIpcMain("redHists_chanel", async (event: any, data: any) => {
        console.log(data, "11111111111111111111111111111111111111111")
        if (data.status) {
            const {hists, filters, appData} = data.data
            const findLastFilter = filters.length ? filters.reduce((a: any, b: any) => a.id > b.id ? a : b) : 0
            setFilterActiveId(findLastFilter)
            setFilters(filters)
            setAppData(appData)
            setHistsData(hists)
            Toast("success", data.message)
            setIsModalOpen(false)
        } else {
            Toast("error", data.message)
        }
    })

    UseOnDataFromIpcMain("progress_chanel", (event: any, data: any) => {
        console.log(data)
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
                filter_name: true,
                filter_type: true,
                size_type: true,
                chart_type: true,
            })
            return Toast("error" , "تمام فیلد هار را پر کنید")
        } 
        if (Object.keys(histsData).length && value.filter_type !== "SCATTER") {
            // console.log("OK")
            window.api_electron.addFilter(value)
        } else {
            // console.log("NO")
            setProgress(0)
            window.api_electron.getChartData(value)
            interval.current = setInterval(() => {
              api_electron.progress(value.filter_type)
            } , 500)
        }
    }

    useEffect(() => {
        setError(AddFilterFormValidation(value))
    }, [value])


    // console.log(value)

    // const propsCondition = appData.filter_type === "SCATTER" ? 
    //     filterTypeComponentProps[appData.filter_type as "SCATTER"] : 
    //     filterTypeComponentProps[value.filter_type as "SCATTER"]

    return (
        <div className="w-[1000px]">
            <h5 className="p-1 border-b border-gray-200 text-xl">افزودن فیلتر</h5>
            <div className="p-2 grid grid-cols-2 gap-10">
                
                <Input
                    name="filter_name" 
                    label="نام فیلتر" 
                    value={value.filter_name} 
                    onBlur={setFocus} 
                    error={error.filter_name} 
                    focus={focus.filter_name}
                    onChange={changeHandler}
                    classNames={{
                        container: "col-span-full"
                    }}
                />

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

                <ProgressBtn
                    title="ایجاد فیلتر"
                    progress={progress}
                    onSubmit={submitHandler}
                />

            </div>
        </div>
        
    )
}


export function AppDetails() {
    const [appData, setAppData] = useRecoilState(AppDataState)

    const keysFA: any = {
        app_name: "نام برنامه",
        healthy: "آدرس سالم‌ها",
        not_healthy: "آدرس خراب‌ها",
        product_type: "نوع محصول",
        app_type: "نوع برنامه",
        removeBlueBack: "حذف بک گراند آبی",
    }

    const booleanTypes: any = {
        app_type: appData?.program_type ? "بار خوب حذف بار بد" : "بار بد استخراج بار خوب",
        removeBlueBack: appData?.removeBlueBack ? "فعال" : "غیرفعال"
    }
    
    return (
        <div className="w-[600px]">
            <h4 className="w-full text-center p-1 border-b border-gray-200">مشخصات برنامه</h4>
            <ul>
                {Object.entries(appData).map(([keys, value], index) =>
                    <li key={keys} className={`p-2 text-sm flex ${index !== 5 ? "border-b border-gray-100" : ""} `}>
                        <span className="text-gray-400 flex-none">{`${keysFA[keys]} :`}</span>
                        <span className="ps-2 flex-auto">{typeof value === "string" ? value : booleanTypes[keys]}</span>
                    </li>
                )}
            </ul>
        </div>
    )
}


export function FilterDetails() {
    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)

    const chartInfo: any = {
        LINE: {
            filter_name: filterActiveId.filter_name,
            filter_type: filterActiveId.filter_type,
            chart_type: filterActiveId.chart_type
        },
        SCATTER: {
            filter_name: filterActiveId.filter_name,
            filter_type: filterActiveId.filter_type,
            influenceTop: filterActiveId.influenceTop,
            influenceDown: filterActiveId.influenceDown
        },
        SIZE: {
            filter_name: filterActiveId.filter_name,
            filter_type: filterActiveId.filter_type,
            chart_type: filterActiveId.size_type
        },
    }

    const keysFA: any = {
        filter_name: "نام فیلتر",
        filter_type: "نوع فیلتر",
        chart_type: "نوع نمودار",
        influenceTop: "سهم خرابی دوربین بالا",
        influenceDown: "سهم خرابی دوربین پایین",
        
    }

    const chartInfoItems = Object.entries(chartInfo[filterActiveId.filter_type])

    return (
        <div className="w-[600px]">
            <h4 className="w-full text-center p-1 border-b border-gray-200">مشخصات فیلتر</h4>
            <ul>
                {chartInfoItems.map(([keys, value]: any, index) =>
                    <li key={keys} className={`p-2 text-sm flex ${index !== chartInfoItems.length-1 ? "border-b border-gray-100" : ""} `}>
                        <span className="text-gray-400 flex-none">{`${keysFA[keys]} :`}</span>
                        <span className="ps-2 flex-auto">{value}</span>
                    </li>
                )}
            </ul>
        </div>
    )
}