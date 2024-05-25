import { useRecoilState } from "recoil"
import Header, { FiltersHandler } from "../Header/Header"
import { FilterActiveIdState, FilterState, GlobalLoadingState } from "../../recoils/GlobalRecoil"
import Matris from "../Common/Matris/Matris"
import Select from "../Common/Select/Select"
import { useEffect, useState } from "react"
import Button from "../Common/Button/Button"
import Image from "../Common/Images/Images"
import { UseOnDataFromIpcMain } from "../../hooks/UseOnDataFromIpcMain"

const Conclusion = () => {

    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)
    const [filterValue, setFilterValue] = useState<any>({
        count: 20,
    })
    const [randomImageLoading, setRandomImageLoading] = useState(false)
    const [globalLoading, setGlobalLoading] = useRecoilState(GlobalLoadingState)
    const [filters, setFilters] = useRecoilState(FilterState)
    // console.log(filterActiveId)

    const numberOfFolder = {
      id: 1, 
      name: "", 
      value: "count",
      option: [
        {id: 1, name: "20 عدد", value: 20},
        {id: 2, name: "50 عدد", value: 50},
        {id: 3, name: "100 عدد", value: 100},
        {id: 4, name: "500 عدد", value: 500},
        {id: 5, name: "1000 عدد", value: 1000},
        {id: 6, name: "همه", value: -1}
      ]
    }

    

    UseOnDataFromIpcMain("randomImage_chanel", (event: any, data: any) => {
        if (data.status) {
            setFilters(data.filters)
            const filterActive = data.filters.find((ele: any) => ele.filter_type === "Conclusion")
            setFilterActiveId(filterActive)
            setRandomImageLoading(false)
        }
    })

    const calculateConclusion = () => {
        api_electron.resultGenerator_conclusion(filterValue)
        setGlobalLoading(true)
    }

    const changeImages = (type: any) => {
        setRandomImageLoading(true)
        api_electron.randomImage({type, id: filterActiveId.id})
    }

    // console.log(filterActiveId)
    useEffect(() => {
        const Actives: any = {}
        const newUserData = {...filterActiveId?.userData}
        delete newUserData.count
        delete newUserData.defaultObjectType
        Object.entries(newUserData)?.forEach(([keys, [value]]: any) => {
            Actives[`effect_${value?.id}`] = value?.isActive
        })
        setFilterValue({...Actives, count: filterActiveId.userData.count})
    }, [filterActiveId])


    return (
        <div className="w-full p-2 pt-3 flex flex-col gap-4">
            <div className="w-full flex gap-3">
                <div className="h-[500px] w-[40%] xl:w-[30%] flex-none bg-white pb-4 border border-gray-300 rounded-md shadow-xl shadow-gray-300">
                    <Matris
                        // charts={intensityGraphs}
                        // pointSelected={filterActiveId?.idealConfusion?.record ? filterActiveId?.idealConfusion?.record : pointSelectedData}
                        pointSelected={filterActiveId.result.total[0]}
                        // name="نقاط پیشفرض"
                    />
                </div>
                <div className="h-[500px] flex-auto col-span-2 bg-white rounded-md border border-gray-300 shadow-xl shadow-gray-300 grid grid-cols-2 grid-rows-8">
                    <div className="col-span-1 row-span-7 border-l flex flex-col">
                        <div className="w-full h-10 flex-none flex items-center justify-between py-1 px-2">
                            <span className="opacity-70"> بار خوب </span>
                            <Button
                                icon='arrow-clockwise'
                                expand='block'
                                fill='transparent'
                                shape="round"
                                color='gray'
                                iconWidth="1.7rem"
                                iconHeight="1.7rem"
                                loading={randomImageLoading}
                                onClick={() => changeImages("healthy")}
                                disabled={!(filterActiveId?.result?.total?.[0].healthys?.length > filterActiveId?.images?.healthy?.length)}
                                classNames={{
                                    // container: styles.windowBtn
                                    container: "!w-8 flex-none w-full h-8 !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md font-bold",
                                    section: "!text-sm !flex !items-center !justify-center !overflow-hidden"
                                }}
                            />
                        </div>
                        <div className={`flex-auto h-full overflow-auto p-2  px-5`}>
                            <div className="w-full grid grid-cols-3 xl:grid-cols-5 gap-1">
                                {filterActiveId?.images?.healthy.length ?
                                    filterActiveId?.images?.healthy.map((image: any, index: any) => 
                                        <Image key={index} image={image} type="healthy"/>
                                    ): 
                                    <h1 className="w-full flex items-center justify-center col-span-full">موردی یافت نشد!!!</h1>
                                }

                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 row-span-7 border-l flex flex-col">
                        <div className="w-full h-10 flex-none flex items-center justify-between py-1 px-2">
                            <span className="opacity-70"> بار بد </span>
                            <Button
                                icon='arrow-clockwise'
                                expand='block'
                                fill='transparent'
                                shape="round"
                                color='gray'
                                iconWidth="1.7rem"
                                iconHeight="1.7rem"
                                loading={randomImageLoading}
                                onClick={() => changeImages("nonHealthy")}
                                disabled={!(filterActiveId?.result?.total?.[0].nonhealthys?.length > filterActiveId?.images?.nonHealthy?.length)}
                                classNames={{
                                    // container: styles.windowBtn
                                    container: "!w-8 flex-none w-full h-8 !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md font-bold",
                                    section: "!text-sm !flex !items-center !justify-center !overflow-hidden"
                                }}
                            />
                        </div>
                        <div className={`flex-auto h-full overflow-auto p-2  px-5`}>
                            <div className="w-full grid grid-cols-3 xl:grid-cols-5 gap-1">
                                {filterActiveId?.images?.nonHealthy.length ?
                                    filterActiveId?.images?.nonHealthy.map((image: any, index: any) => 
                                        <Image key={index} image={image} type="nonHealthy"/>
                                    ): 
                                    <h1 className="w-full flex items-center justify-center col-span-full">موردی یافت نشد!!!</h1>
                                }

                            </div>
                        </div>

                    </div>
                    <div className="col-span-full row-span-1 border-t grid grid-cols-2 items-center justify-center gap-5 p-3">
                        <div className="h-full flex-auto flex items-center justify-center">
                            <label className="w-20 text-sm flex-none flex items-center justify-center"> تعداد فولدر : </label>
                            <Select
                                data={numberOfFolder}
                                // label="تعداد فولدر"
                                value={filterValue}
                                setValue={setFilterValue}
                                iconRotate
                                classNames={{
                                    btn: {
                                        container: "!h-9 !w-full"
                                    }
                                }}
                            />
                        </div>                        
                        <Button
                            title="به روز رسانی اطلاعات"
                            expand='block'
                            fill='basic'
                            shape="round"
                            color='primary'
                            iconWidth="1.2rem"
                            iconHeight="1.2rem"
                            direction="row_reverse"
                            loading={globalLoading}
                            // iconRotate={showFilter.images ? "180" : "0"}
                            onClick={calculateConclusion}
                            // disabled={!Object.keys(filterActiveId).includes("images")}
                            classNames={{
                                // container: styles.windowBtn
                                container: "h-9 !flex-auto !flex !items-center !justify-center px-2 transition-all duration-300 !rounded-md font-bold",
                                section: "!text-sm !flex !items-center !justify-center !overflow-hidden"
                            }}
                        />

                    </div>
                </div>

            </div>
            <div className="w-full bg-white border border-gray-300 shadow-xl shadow-gray-300 rounded-md">
                <div className="grid grid-cols-7 py-3 border-b text-gray-500 bg-gray-200">
                    <span className="border-l border-gray-300 flex items-center justify-center text-sm">نام فیلتر</span>
                    <span className="border-l border-gray-300 flex items-center justify-center text-sm">نوع نمودار</span>
                    <span className="border-l border-gray-300 flex items-center justify-center text-sm">تعداد فولدر</span>
                    <span className="border-l border-gray-300 flex items-center justify-center text-sm">وضعیت فیلتر</span>
                    <span className="border-l border-gray-300 flex items-center justify-center text-sm">تاثیر فیلتر</span>
                    <span className="border-l border-gray-300 flex items-center justify-center text-sm">بخش انتخاب شده</span>
                    <span className="border-l border-gray-300 flex items-center justify-center text-sm">مختصات</span>
                </div>

                {filters?.filter((ele: any) => ele.filter_type === "LINE" && ele.userData && Object.keys(ele.userData).length)?.map((filter: any) => 
                    // console.log(filter?.userData?.[filter?.chart_type.toLowerCase()]?.[0])
                    <div key={filter.id} className="grid grid-cols-7 py-3 border-b">
                        <span className="border-l flex items-center justify-center">{filter.filter_name}</span>
                        <span className="border-l flex items-center justify-center">{filter.chart_type}</span>
                        <span className="border-l flex items-center justify-center">{filter?.filterValues?.count ?? 20}</span>
                        <span className="border-l flex items-center justify-center">
                            <div 
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => setFilterValue({...filterValue, [`effect_${filter.id}`]: !filterValue?.[`effect_${filter.id}`]})}
                            >
                                {/* <label className="text-sm cursor-pointer">روشن بودن فیلترها :</label> */}
                                <div className={`w-14 h-7 rounded-full relative shadow-inner transition-all duration-300 ${filterValue?.[`effect_${filter.id}`] ? "bg-sky-500 shadow-sky-600" : "bg-gray-300 shadow-gray-400"} `}>
                                    <div className={`w-5 aspect-square rounded-full absolute top-1 transition-all duration-300 shadow-md ${filterValue?.[`effect_${filter.id}`] ? "right-8 bg-white shadow-sky-600" : "bg-gray-500 right-1 shadow-gray-400"}`} />
                                </div>
                            </div>
                        </span>
                        <span className="border-l flex items-center justify-center">
                            {filter?.userData?.[filter?.chart_type?.toLowerCase()]?.[0]?.influence}
                        </span>
                        <span className="border-l flex items-center justify-center">
                            {filter?.userData?.[filter?.chart_type?.toLowerCase()]?.[0]?.isTopSelected ? "بالا" : "پایین"}
                        </span>
                        <span className="border-l flex items-center justify-center text-sm px-2">
                            <div className="w-full flex flex-col border-l">
                                <div className="flex items-center justify-around">
                                    <span className="" style={{direction: "ltr"}}>{(filter?.userData?.[filter?.chart_type.toLowerCase()]?.[0]?.p2?.x).toFixed(0) ?? 0}</span>
                                    <span className="text-gray-400"> : X2</span>
                                </div>
                                <div className="flex items-center justify-around">
                                    <span className="" style={{direction: "ltr"}}>{(filter?.userData?.[filter?.chart_type.toLowerCase()]?.[0]?.p2?.y).toFixed(0) ?? 0}</span>
                                    <span className="text-gray-400"> : Y2</span>
                                </div>
                            </div>
                            <div className="w-full flex flex-col">
                                <div className="flex items-center justify-around">
                                    <span className="" style={{direction: "ltr"}}>{(filter?.userData?.[filter?.chart_type.toLowerCase()]?.[0]?.p1?.x).toFixed(0) ?? 0}</span>
                                    <span className="text-gray-400"> : X1</span>
                                </div>
                                <div className="flex items-center justify-around">
                                    <span className="" style={{direction: "ltr"}}>{(filter?.userData?.[filter?.chart_type.toLowerCase()]?.[0]?.p1?.y).toFixed(0) ?? 0}</span>
                                    <span className="text-gray-400"> : Y1</span>
                                </div>
                            </div>
                        </span>
                    </div> 
                )}
            </div>
        </div>
    )
}

export default Conclusion