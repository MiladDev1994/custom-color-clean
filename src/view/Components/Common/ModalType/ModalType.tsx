import { useEffect, useState } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import { useRecoilState, useSetRecoilState } from "recoil";
import { AppDataState, HistsDataState } from "../../../recoils/GlobalRecoil";
import * as FilterTypeForm from "../FilterTypeForm/FilterTypeForm"


export function NewOrOpen({disableSave, handleSaveFile, setIsModalOpen, setFileType}: any) {

    return (
        <div className={"w-[800px] text-center p-2"}>
            <div className={`w-full text-lg before:content-["اخطار:"] before:text-red-400 before:mx-1`}>
                قبل از باز کردن برنامه جدید، وضعیت برنامه فعلی را مشخص کنید 
            </div>
            <div className={"flex items-center justify-around mt-10 gap-2"}>
                
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
                        container: "!h-12 !w-[25%] !flex !items-center !justify-center !rounded-md duration-200",
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
                        container: "!h-12 !w-[25%] !flex !items-center !justify-center !rounded-md duration-200",
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
                        container: "!h-12 !w-[25%] !flex !items-center !justify-center !rounded-md duration-200",
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
                        container: "!h-12 !w-[25%] !flex !items-center !justify-center !rounded-md duration-200",
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
        {id: 1, name: "دیپ لرنینگ", value: "DEEP"},
        {id: 2, name: "سایز", value: "SIZE"},
        {id: 3, name: "تک بعدی", value: "LINE"},
        // {id: 4, name: "دو بعدی", value: "SCATTER"},
    ]

    const [appData, setAppData] = useRecoilState(AppDataState)
    const [histsData, setHistsData] = useRecoilState(HistsDataState)
    const [value, setValue] = useState({
        filter_name: "",
        influenceTop: "0",
        influenceDown: "0",
        filter_type: "FIlterType",
        size_type: "",
        chart_type: ""
    }) 
    
    const [focus, setFocus] = useState({
        filter_name: false,
        filter_type: false,
    })

    const [error, setError] = useState({
        filter_name: "",
        filter_type: "",
    })


    const changeHandler = (e: any) => {
        setValue({
            ...value,
            [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value
        })
    }

    const FilterTypeComponent = appData.filter_type === "SCATTER" ? 
        FilterTypeForm[appData.filter_type as "SCATTER"] : 
        FilterTypeForm[value.filter_type as "FIlterType"]

    const filterTypeComponentProps = {
        SCATTER: {
            value,
            setValue,
            name: "filter_type",
            title: "نوع فیلتر",
            changeHandler,
            error: error.filter_type,
            focus: focus.filter_type,
            filterTypeItem
        },
        DEEP: {
            value,
            setValue,
            name: "filter_type",
            title: "نوع فیلتر",
            changeHandler,
            error: error.filter_type,
            focus: focus.filter_type,
            filterTypeItem
        },
        SIZE: {
            value,
            setValue,
            name: "filter_type",
            title: "نوع فیلتر",
            changeHandler,
            error: error.filter_type,
            focus: focus.filter_type,
            filterTypeItem
        },
        LINE: {
            value,
            setValue,
            name: "filter_type",
            title: "نوع فیلتر",
            changeHandler,
            error: error.filter_type,
            focus: focus.filter_type,
            filterTypeItem,
            histsData
        },
        FIlterType: {
            value,
            setValue,
            name: "filter_type",
            title: "نوع فیلتر",
            changeHandler,
            error: error.filter_type,
            focus: focus.filter_type,
            filterTypeItem
        }
    }

    useEffect(() => {
        // for validation
    }, [value])

    console.log(value)

    const propsCondition = appData.filter_type === "SCATTER" ? 
        filterTypeComponentProps[appData.filter_type as "SCATTER"] : 
        filterTypeComponentProps[value.filter_type as "SCATTER"]

    return (
        <div className="w-[1000px]">
            <h5 className="p-1 border-b border-gray-200">افزودن فیلتر</h5>
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

                <FilterTypeComponent {...propsCondition}/>

                <Button
                    title="ایجاد فیلتر جدید"
                    expand='block'
                    fill='basic'
                    shape="round"
                    color='primary'
                    iconWidth="2rem"
                    iconHeight="2rem"
                    onClick={() => {
                        // window.api_electron.quit()
                    }}
                    classNames={{
                        container: "!h-12 !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md col-span-full",
                        section: "!text-lg !flex !items-center !justify-center !overflow-hidden"
                    }}
                />

            </div>
        </div>
        
    )
}