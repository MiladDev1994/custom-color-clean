
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import CreateApp from "./Pages/CreateApp/CreateApp";
import Report from "./Pages/Report/Report";
import { AllRecordState, AppDataState, ChartDataState, ChartLengthState, DirectoryValueState, FilterActiveIdState, FilterState, GlobalLoadingState, HistsDataState, IsModalOpenState, ProgressState } from "./recoils/GlobalRecoil";
import { useRecoilState, useSetRecoilState } from "recoil";
import { UseOnDataFromIpcMain } from "./hooks/UseOnDataFromIpcMain";
import { Toast } from "./utils/Toast";
// import Conclusion from "./Components/Reports/Conclusion";

const AppRoutes = () => {

    const navigate = useNavigate()
    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)
    const setHistsData = useSetRecoilState(HistsDataState)
    const [filters, setFilters] = useRecoilState(FilterState)
    const [appData, setAppData] = useRecoilState(AppDataState)
    const [globalLoading, setGlobalLoading] = useRecoilState(GlobalLoadingState)
    
    UseOnDataFromIpcMain("existAppDataChecker_chanel", (event: any, data: any) => {
        const {appData, hists, filters} = data
        const existConclusionFilters = filters.find((ele: any) => ele.filter_type === "Conclusion")
        if (existConclusionFilters) {
            setFilterActiveId(existConclusionFilters)
            setFilters(filters)
            setAppData(appData)
            setHistsData(hists)
            navigate("/report")
        } else {
            if (Object.keys(appData).length) {
                const findLastFilter = filters.length ? filters.reduce((a: any, b: any) => a.id > b.id ? a : b) : {}
                setFilterActiveId(findLastFilter)
                setFilters(filters)
                setAppData(appData)
                setHistsData(hists)
                navigate("/report")
            } else navigate("/")
        }

    })


    useEffect(() => {
        api_electron.existAppDataChecker()
    }, [])


    return (
        <div className="max-w-[1900px] m-auto">
            <Routes>
                <Route path="/" element={<CreateApp />} />
                <Route path="/report" element={<Report />} />
                {/* <Route path="/conclusion" element={<Conclusion />} /> */}
            </Routes>
            {globalLoading && <div className="w-screen h-screen fixed top-0 right-0 z-50" onClick={() => Toast("error", "درحال اجرای عملیات. لطفا منتظر بمانید")}/>}
        </div>
    )
}

export default AppRoutes;