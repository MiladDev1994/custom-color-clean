
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import CreateApp from "./Pages/CreateApp/CreateApp";
import Report from "./Pages/Report/Report";
import { AllRecordState, AppDataState, ChartDataState, ChartLengthState, DirectoryValueState, FilterActiveIdState, FilterState, HistsDataState } from "./recoils/GlobalRecoil";
import { useRecoilState, useSetRecoilState } from "recoil";
import { UseOnDataFromIpcMain } from "./hooks/UseOnDataFromIpcMain";

const AppRoutes = () => {

    const navigate = useNavigate()
    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)
    const setHistsData = useSetRecoilState(HistsDataState)
    const [filters, setFilters] = useRecoilState(FilterState)
    const [appData, setAppData] = useRecoilState(AppDataState)
    
    UseOnDataFromIpcMain("existAppDataChecker_chanel", (event: any, data: any) => {
        const {appData, hists, filters} = data

        if (Object.keys(appData).length) {
            const findLastFilter = filters.length ? filters.reduce((a: any, b: any) => a.id > b.id ? a : b) : {}
            setFilterActiveId(findLastFilter)
            setFilters(filters)
            setAppData(appData)
            setHistsData(hists)
            navigate("/report")
        } else navigate("/")
    })

    useEffect(() => {
        api_electron.existAppDataChecker()
    }, [])


    return (
        <div className="max-w-[1900px] m-auto">
            <Routes>
                <Route path="/" element={<CreateApp />} />
                <Route path="/report" element={<Report />} />
            </Routes>
        </div>
    )
}

export default AppRoutes;