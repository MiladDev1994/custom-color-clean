import React, { useEffect, useState } from 'react'
import { CreateAppFormValidation } from './Validation'
import { Toast } from '../../utils/Toast'
import { ProgressState } from '../../recoils/GlobalRecoil'
import { useRecoilState } from 'recoil'
import Button from '../../Components/Common/Button/Button'
import Range from '../../Components/Common/Range/Range'
import Select from '../../Components/Common/Select/Select'
import Input from '../../Components/Common/Input/Input'
import ProgressBtn from '../../Components/Common/ProgressBtn/ProgressBtn'

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
    const filterType = [
        {id: 1, name: "دیپ لرنینگ", value: "DEEP"},
        {id: 2, name: "سایز", value: "SIZE"},
        {id: 3, name: "تک بعدی", value: "LINE"},
        {id: 4, name: "دو بعدی", value: "SCATTER"},
    ]
    const filters = [
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
    const [progress, setProgress] = useRecoilState(ProgressState)
    const [value, setValue] = useState<any>({
        app_name: "",
        healthy: "",
        not_healthy: "",
        filter_name: "",
        filter_type: "",
        app_type: null,
        product_type: "",
        influenceTop: 0,
        influenceDown: 0,
        removeBlueBack: false
    })
    const [error, setError] = useState<any>({
        app_name: "",
        healthy: "",
        not_healthy: "",
        filter_name: "",
        filter_type: "",
        app_type: "",
        product_type: "",
    })
    const [focus, setFocus] = useState<any>({
        app_name: false,
        healthy: false,
        not_healthy: false,
        filter_name: false,
        filter_type: false,
        app_type: false,
        product_type: false,
    })

    const changeHandler = (e: any) => {
        console.log()
        setValue({
            ...value,
            [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value
        })
    }


    const submitHandler = () => {
        if (progress < 100) return
        if (Object.values(error).join("")) {
            setFocus({
                app_name: true,
                filter_name: true,
                healthy: true,
                not_healthy: true,
                filter_type: true,
                app_type: true,
                product_type: true,
            })
            return Toast("error" , "تمام فیلد هار را پر کنید")
        } 
        window.api_electron.getChartData(value)
    }

    useEffect(() => {
        setError(CreateAppFormValidation(value))
    }, [value])

    console.log(value)

    return (
        <div className={`w-screen h-screen flex items-center justify-center overflow-hidden`}>
            <div className={`absolute right-0 top-0 p-2 flex gap-2`}>
                <Button
                    icon='x'
                    expand='block'
                    fill='info'
                    shape="round"
                    color='danger'
                    iconWidth="2rem"
                    iconHeight="2rem"
                    onClick={() => {
                        window.api_electron.quit()
                    }}
                    classNames={{
                        // container: styles.windowBtn
                        container: "w-[30px] h-[30px] !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md",
                        section: "text-md"
                    }}
                />
                <Button
                    icon='dash'
                    expand='block'
                    fill='info'
                    shape="round"
                    color='primary'
                    iconWidth="2rem"
                    iconHeight="2rem"
                    onClick={() => {
                        window.api_electron.minimize()
                    }}
                    classNames={{
                        // container: styles.windowBtn
                        container: "w-[30px] h-[30px] !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md",
                        section: "text-md"
                    }}
                />

            </div>
            <div className={`w-[1000px] p-1 rounded-xl border border-gray-200 shadow-2xl shadow-gray-400`}>
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

                    <div className={`relative py-1 col-span-full`}>
                        <label className='after:content-["*"] after:text-red-400 block p-1 text-sm'>نوع فیلتر</label>
                        <div className={`flex items-center justify-center gap-3`}>
                            {filterType.map(filter => 
                                <div key={filter.value} className={`w-full h-12 relative border border-gray-300 rounded-md flex items-center justify-center transition-all duration-200 shadow-md shadow-gray-200  ${value.filter_type === filter.value ? "bg-sky-500" : "hover:bg-zinc-100"}`}>
                                    <input 
                                        type='radio' 
                                        name='filter_type' 
                                        value={filter.value}
                                        onChange={changeHandler}
                                        className='w-full h-full absolute left-0 top-0 opacity-0 cursor-pointer'
                                    />
                                    <span className='text-lg'>{filter.name}</span>
                                </div>
                            )}
                        </div>
                        {(error.filter_type && focus.filter_type) && <span className='absolute text-red-400 text-xs left-1 -bottom-4'>{error.filter_type}</span>}
                    </div>

                    {value.filter_type && (value.filter_type === "SCATTER" ?
                        rangeInput.map(item => 
                            <Range
                              key={item.type}
                              label={item.label}
                              min={0}
                              max={1}
                              step={0.1}
                              value={value[item.type]}
                              onChange={(e: any) => setValue({...value, [item.type]: e.target.value})}
                            />
                        ):
                        <>
                            {
                                filters.map(ele => 
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
                                )
                            }
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
                        </>
                    )}

                    <ProgressBtn
                        progress={progress}
                        onSubmit={submitHandler}
                    />

                </div>
            </div>
        </div>
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
                        container: "!flex !flex-none !w-[45px] duration-200 rounded-0"
                    }}
                />
                <input 
                    type='text'
                    placeholder='انتخاب فهرست...'
                    value={value[type]}
                    className="flex-auto p-2 border-0 outline-none font-bold text-md placeholder:text-gray-400 placeholder:text-sm placeholder:font-thin bg-gray-100"
                    disabled
                />
            </div>
            {(error && focus) && <span className='absolute text-red-400 text-xs left-1'>{error}</span>}
        </div>
    )
}

export default CreateApp;

