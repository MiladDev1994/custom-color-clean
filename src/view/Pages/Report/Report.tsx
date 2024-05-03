import { useRecoilState } from "recoil";
import Header, { FiltersHandler } from "../../Components/Header/Header";
import { Filter1DState, Filter2DState, FilterActiveIdState, FilterState } from "../../recoils/GlobalRecoil";
import Select from "../../Components/Common/Select/Select";
import Range from "../../Components/Common/Range/Range";
import { useEffect, useState } from "react";
import Button from "../../Components/Common/Button/Button";
import chartIcon from "../../../../assets/images/dcf852601f6f722d7faaa0c06eb41e37.svg"
import * as Reports from "../../Components/Reports/AllReports"




export default function Report() {
      
    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)
    const [filters, setFilters] = useRecoilState(FilterState)

    const ReportComponent = Reports[filters?.find((ele: any) => ele.id === filterActiveId)?.filter_type as "SCATTER"]

    console.log(filterActiveId)
    return (
        <div className="w-full mt-28">
            <Header>
                <FiltersHandler />
            </Header>
            {filterActiveId ? <ReportComponent /> : 
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






