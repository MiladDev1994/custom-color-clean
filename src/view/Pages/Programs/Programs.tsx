import { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
// import { programs } from "./programsData";
import { UseOnDataFromIpcMain } from "../../hooks/UseOnDataFromIpcMain";
import { Toast } from "../../utils/Toast";
import moment from "moment-jalaali";
import Button from "../../Components/Common/Button/Button";
import { useRecoilState } from "recoil";
import { IsModalOpenState, ModalParamsState, ModalTypeState, ScatterPointLocationState } from "../../recoils/GlobalRecoil";
moment.loadPersian({ dialect: 'persian-modern' })

export default function Programs() {
    const [value, setValue] = useState({
        programId: "",
        filterName: ""
    })
    const [programs, setPrograms] = useState([])
    const [apps, setApps] = useState([])
    const [scatterPointLocation, setScatterPointLocation] = useRecoilState(ScatterPointLocationState)
    const [isModalOpen, setIsModalOpen] = useRecoilState(IsModalOpenState);
    const [modalType, setModalType] = useRecoilState(ModalTypeState);

    const changeHandler = (e: any) => {
        console.log(e.target.name)
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }

    UseOnDataFromIpcMain("readPrograms_chanel", (event: any, data: any) => {
        if (!data.status) return Toast("error", data.error)
        setPrograms(data.programs)
    })

    UseOnDataFromIpcMain("getAppsList_chanel", (event: any, data: any) => {
        if (!data.status) return Toast("error", data.error)
        setApps(data.list)
    })

    UseOnDataFromIpcMain("addFilterPathToProgram_chanel", (event: any, data: any) => {
        if (!data.status) return Toast("error", data.error)
        setPrograms(data.programsList)
        setValue({
            programId: "",
            filterName: ""
        })
    })

    useEffect(() => {
        api_electron.readPrograms()
        api_electron.getAppsList()
    }, [])

    console.log(apps)


    return (
        <div>
            <Header
                hasNew={false}
                hasSave={false}
                hasSaveAs={false}
                hasAppDetails={false}
                hasProgram={false}
                hasOpen={false}
            />
            <div className="flex flex-col gap-5 my-20">
                <div className="w-full px-3 rounded-md border border-gray-300 shadow-xl shadow-gray-300 bg-white overflow-hidden">
                    <h4 className="w-full py-2 border-b ">Programs</h4>
                    <div className="flex flex-wrap items-center justify-center gap-5 py-3">
                        {programs.map((ele: any) =>
                            <Program 
                                key={ele.sorchin_template_id}
                                program={ele} 
                                value={value}
                                setValue={setValue}
                                onChange={changeHandler}
                            />
                        )}
                    </div>
                </div>
                <div className="w-full px-3 rounded-md border border-gray-300 shadow-xl shadow-gray-300 bg-white overflow-hidden">
                    <h4 className="w-full py-2 border-b ">Filters</h4>
                    <div className="flex flex-wrap items-center justify-center gap-5 py-3">
                        {apps.length ? apps.map((ele: any) =>
                            <Filter 
                                key={ele}
                                filter={ele}
                                value={value}
                                onChange={changeHandler}
                            />) :
                            <div className="w-full h-48 flex items-center justify-center opacity-50 font-bold text-xl">
                               فیلتر یافت نشد!!!
                            </div>
                        }
                    </div>
                </div>
                <div className="w-full h-14">
                    <Button
                        title="Save"
                        // icon='box-arrow-in-down'
                        expand='full'
                        fill='basic'
                        color='primary'
                        shape="round"
                        iconWidth="1.6rem"
                        iconHeight="1.6rem"
                        outlineColor="lightgray"
                        // loading
                        disabled={!(Object.values(value).filter((ele: any) => ele).length === 2)}
                        onClick={() => api_electron.addFilterPathToProgram({...value, scatterPointLocation})}
                        classNames={{
                            container: "!flex !items-center !justify-center !rounded-md !border-0 duration-200 shadow-xl shadow-gray-300 px-3",
                            section: "!text-lg !overflow-hidden !flex !items-center !justify-center"
                        }}
                    />

                </div>
            </div>
        </div>
    )
}

function Program({program, value, setValue, onChange}: any) {
    const {
        sorchin_template_id, 
        created_stamp, 
        filterPath, 
        hasProgramFile, 
        is_custom, 
        pistachio_weight, 
        program_Type, 
        reverse, 
        template_name, 
        template_path, 
        template_type, 
        user_login_id
    } = program

    const programData = [
        {type: "Program Type", value: program_Type},
        {type: "Template Name", value: template_name},
        {type: "Template Type", value: template_type},
        {type: "Connected to Filter", value: filterPath?._text.replaceAll('"', '').split("\\").pop().split("_").shift()} ?? false,
        {type: "Exist Program File", value: String(hasProgramFile)}
    ]

    return (
        <div 
            className={`
                w-72 rounded-md border shadow-lg transition-all duration-150 cursor-pointer relative p-1
                ${!hasProgramFile ? "border-red-500 bg-red-100 shadow-red-200" : 
                    +value.programId === sorchin_template_id ? "bg-sky-400 border-sky-600 shadow-sky-300" : "bg-zinc-100 hover:bg-zinc-200 border-zinc-300 shadow-zinc-200"}
                
            `}>
                <input 
                    type="radio" 
                    name="programId"
                    value={sorchin_template_id}
                    onChange={onChange}
                    checked={false}
                    disabled={!hasProgramFile}
                    className="w-full h-full absolute opacity-0 cursor-pointer z-50"
                />
                {programData.map((ele: any, index: any) => 
                    <div 
                        key={ele.type}
                        className={`
                            w-full text-sm flex items-center justify-between font-bold p-2 transition-all
                            ${index < programData.length-1 ? "border-b" : ""}
                            ${!hasProgramFile ? "border-red-300" :
                                +value.programId === sorchin_template_id ? "border-sky-500" : "border-gray-200"}
                        `}>
                        <span>{ele.value}</span>
                        <span className="opacity-70">: {ele.type}</span>
                    </div>
                )}
        </div>
    )
}


function Filter({filter, value, onChange}: any) {

    const [name, time] = filter.split("_")
    const [isModalOpen, setIsModalOpen] = useRecoilState(IsModalOpenState);
    const [modalType, setModalType] = useRecoilState(ModalTypeState);
    const [modalParams, setModalParams] = useRecoilState(ModalParamsState)

    return (
        <div 
            className={`
                w-72 rounded-md border shadow-lg transition-all duration-150 cursor-pointer relative p-1
                ${value.filterName === filter ? "bg-sky-400 border-sky-600 shadow-sky-300" : "bg-zinc-100 hover:bg-zinc-200 border-zinc-300 shadow-zinc-200"}
                
            `}>
                <Button
                    icon='x'
                    expand='block'
                    fill='transparent'
                    color='gray'
                    shape="round"
                    iconWidth="1.8rem"
                    iconHeight="1.8rem"
                    outlineColor="lightgray"
                    // disabled={!saveActive}
                    // onClick={saveAsHandler}
                    classNames={{
                        container: "h-9 !flex !items-center !justify-center !border-0 duration-200 !px-1 absolute right-0 top-0 z-40",
                    }}
                    onClick={() => {
                        setIsModalOpen(true)
                        setModalType("DeleteFilter")
                        setModalParams(filter)
                    }}
                    // classNames={{container: styles.submitBtn}}
                />
                <input 
                    type="radio" 
                    name="filterName"
                    value={filter}
                    onChange={onChange}
                    checked={false}
                    className="w-full h-full absolute opacity-0 cursor-pointer z-30"
                />
                <h1 className="text-center p-4 text-xl font-bold opacity-80">{name}</h1>
                <div className="text-center p-4 font-bold opacity-80">{moment(+time).format('dddd')}</div>
                <div className="text-center p-4 font-bold opacity-80">{moment(+time).format('jYYYY/jMM/jDD')}</div>
        </div>
    )
}

