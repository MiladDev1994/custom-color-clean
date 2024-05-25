import { useRecoilState, useSetRecoilState } from "recoil";
import Header, { FiltersHandler } from "../../Components/Header/Header";
import { AppDataState, Filter1DState, Filter2DState, FilterActiveIdState, FilterState, GlobalLoadingState, HistsDataState, IsModalOpenState, ProgressState } from "../../recoils/GlobalRecoil";
import Select from "../../Components/Common/Select/Select";
import Range from "../../Components/Common/Range/Range";
import { useEffect, useRef, useState } from "react";
import Button from "../../Components/Common/Button/Button";
import chartIcon from "../../../../assets/images/dcf852601f6f722d7faaa0c06eb41e37.svg"
import * as Reports from "../../Components/Reports/Reports.aggregation"
import { UseOnDataFromIpcMain } from "../../hooks/UseOnDataFromIpcMain";
import { Toast } from "../../utils/Toast";




export default function Report() {
      
    const interval = useRef(null)
    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)
    const [isModalOpen, setIsModalOpen] = useRecoilState(IsModalOpenState);
    const [progress, setProgress] = useRecoilState(ProgressState)
    const [filters, setFilters] = useRecoilState(FilterState)
    const [appData, setAppData] = useRecoilState(AppDataState)
    const setHistsData = useSetRecoilState(HistsDataState)
    const [globalLoading, setGlobalLoading] = useRecoilState(GlobalLoadingState)

    
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
            let findLastFilter = filters.length ? filters.reduce((a: any, b: any) => a.id > b.id ? a : b) : {}
            if (data.data.type === "patch") {
                findLastFilter = filters.length ? filters.find((ele: any) => ele.id === filterActiveId.id) : {}
            } 
            setFilterActiveId(findLastFilter)
            setFilters(filters)
            setAppData(appData)
            Toast("success", data.message)
            setIsModalOpen(false)
            setGlobalLoading(false)
        } else {
            Toast("error", data.message)
        }
    })

    UseOnDataFromIpcMain("redHists_chanel", async (event: any, data: any) => {
        if (data.status) {
            const {hists, filters, appData} = data.data
            const findLastFilter = filters.length ? filters.reduce((a: any, b: any) => a.id > b.id ? a : b) : 0
            setFilterActiveId(findLastFilter)
            setFilters(filters)
            // setAppData(appData)
            setHistsData(hists)
            Toast("success", data.message)
            setIsModalOpen(false)
            setGlobalLoading(false)
        } else {
            Toast("error", data.message)
            setGlobalLoading(false)
        }
    })

    UseOnDataFromIpcMain("progress_chanel", (event: any, data: any) => {
        const {progress, filter_type} = data
        console.log(data)
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

    function submitCreateFilter(chartValue: any, progressType: any) {
        window.api_electron.getChartData(chartValue)
        interval.current = setInterval(() => {
          api_electron.progress(progressType)
        } , 500)
    }

    const ReportComponent = filterActiveId?.filter_type ? Reports[filterActiveId?.filter_type as "SCATTER"] : undefined
    const ReportComponentProps = {
        SCATTER: {
            onSubmit: submitCreateFilter
        },
        LINE: {},
    }

    return (
        <div className="w-full mt-28">
            <Header onSubmit={submitCreateFilter}>
                <FiltersHandler />
            </Header>
            {ReportComponent ? <ReportComponent {...ReportComponentProps[filterActiveId?.filter_type as "SCATTER"]}/> : 
                <div className="w-full h-[calc(100vh-115px)] p-3">
                    <div className="w-full h-full bg-white border border-gray-300 rounded-md shadow-xl shadow-gray-300 flex flex-col items-center justify-center">
                        <img src={chartIcon} className="w-72"/>
                        <span className="text-xl p-5 opacity-70">فیلتری برای نمایش وجود ندارد !!!</span>
                    </div>
                </div>
            }
        </div>
    )
}






