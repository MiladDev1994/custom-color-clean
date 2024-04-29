
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import CreateApp from "./Pages/CreateApp/CreateApp";
import Inform from "./Pages/Inform/Inform";
import { AllRecordState, AppDataState, ChartDataState, ChartLengthState, DirectoryValueState } from "./recoils/GlobalRecoil";
import { useRecoilState, useSetRecoilState } from "recoil";
import { UseOnDataFromIpcMain } from "./hooks/UseOnDataFromIpcMain";

const AppRoutes = () => {

    const navigate = useNavigate()
    const [appData, setAppData] = useRecoilState(AppDataState)
    const setAllRecord = useSetRecoilState(AllRecordState)
    const setChartData = useSetRecoilState(ChartDataState)
    const setChartLength = useSetRecoilState(ChartLengthState)
    // const setDirectoryValue = useSetRecoilState(DirectoryValueState)
    
    UseOnDataFromIpcMain("existAppDataChecker_chanel", (event: any, data: any) => {
        const {appData, confusion, hists} = data

        if (Object.keys(appData).length) {
            setAppData(appData)
            if (appData?.filter_type === "SCATTER") {
                if (Object.keys(confusion).length) {
                    setAllRecord(confusion.allRecord)
                    setChartLength(confusion.chartLength)
                    setChartData(confusion.chartData)
                    // setDirectoryValue(confusion.directory)
                    navigate("/inform")
                }
            } else {
                if (Object.keys(hists).length) {
                    navigate("/inform")
                }
            }
        } else navigate("/")
    })

    useEffect(() => {
        api_electron.existAppDataChecker()
    }, [])


    return (
        <Routes>
            <Route path="/" element={<CreateApp />} />
            <Route path="/inform" element={<Inform />} />
        </Routes>
    )
}

export default AppRoutes;