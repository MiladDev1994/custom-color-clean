import { useState } from "react"
import { useRecoilState } from "recoil"
import { Filter1DState } from "../../recoils/GlobalRecoil"
import Range from "../Common/Range/Range"
import Button from "../Common/Button/Button"
import Select from "../Common/Select/Select"



const LINE = () => {

    const [showFilter, setShowFilter] = useState(false)
    const [filter1D, setFilter1D] = useRecoilState(Filter1DState)

    const numberOfFolder = {
      id: 2, 
      name: "", 
      value: "folder_number",
      option: [
        {id: 1, name: "20 عدد", value: 20},
        {id: 2, name: "50 عدد", value: 50},
        {id: 3, name: "100 عدد", value: 100},
        {id: 4, name: "500 عدد", value: 500},
        {id: 5, name: "1000 عدد", value: 1000},
        {id: 6, name: "همه", value: 0}
      ]
    }

    const [value, setValue] = useState({
        folder_number: 20,
        filter_effect: 50,
        all_filter_effect: true
    })


    return (
        <div className="w-full flex items-stretch p-3 gap-2">
            <div className="flex-none relative">
                <div className="w-[350px] h-[calc(100vh-140px)] sticky top-[125px] rounded-md">
                    {/* <h5 className="text-center border-b border-gray-200 py-1 mb-3">تنظیمات</h5> */}
                     
                    <div className={`${showFilter ? "h-[340px]" : "h-10"} w-full rounded-md overflow-hidden bg-white border border-gray-300 transition-all duration-300 shadow-md shadow-gray-200`}>
                        <Button
                            title="فیلترها"
                            icon="chevron-down"
                            expand='block'
                            fill='light'
                            shape="round"
                            color='gray'
                            iconWidth="1.2rem"
                            iconHeight="1.2rem"
                            direction="row_reverse"
                            iconRotate={showFilter ? "180" : "0"}
                            onClick={() => setShowFilter(!showFilter)}
                            classNames={{
                                // container: styles.windowBtn
                                container: "w-full h-10 !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md",
                                section: "!text-lg !flex !items-center !justify-center !overflow-hidden"
                            }}
                        />
                        <div className="flex flex-col gap-2 p-3">
                            <div className="flex items-center justify-center border-b border-gray-200 pb-3">
                                <label className="w-20 text-sm flex-none flex items-center justify-center"> تعداد فولدر : </label>
                                <Select
                                    data={numberOfFolder}
                                    // label="تعداد فولدر"
                                    value={value}
                                    setValue={setValue}
                                    iconRotate
                                    classNames={{
                                        btn: {
                                            container: "!h-9"
                                        }
                                    }}
                                />
                            </div>

                            <Range
                                label="تاثیر فیلتر"
                                min={0}
                                max={100}
                                step={1}
                                value={value.filter_effect}
                                onChange={(e: any) => setValue({...value, filter_effect: e.target.value})}
                            />

                            <div 
                                className="flex items-center justify-between cursor-pointer pt-4 border-t border-gray-200"
                                onClick={() => setValue({...value, all_filter_effect: !value.all_filter_effect})}
                            >
                                <label className="text-sm cursor-pointer">تاثیر در همه فیلترها :</label>
                                <div className={`w-14 h-7 rounded-full relative shadow-inner transition-all duration-300 ${value.all_filter_effect ? "bg-sky-500 shadow-sky-600" : "bg-gray-300 shadow-gray-400"} `}>
                                    <div className={`w-5 aspect-square rounded-full absolute top-1 transition-all duration-300 shadow-md ${value.all_filter_effect ? "right-8 bg-white shadow-sky-600" : "bg-gray-500 right-1 shadow-gray-400"}`} />
                                </div>
                            </div>

                            
                            <Button
                                title="اعمال فیلتر"
                                expand='block'
                                fill='basic'
                                shape="round"
                                color='primary'
                                iconWidth="2rem"
                                iconHeight="2rem"
                                onClick={() => {
                                    window.api_electron.minimize()
                                }}
                                classNames={{
                                    // container: styles.windowBtn
                                    container: " h-10 mt-8 !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md",
                                    section: "!text-lg !flex !items-center !justify-center !overflow-hidden"
                                }}
                            />
                        </div>
                        
                    </div>
                </div>
            </div>

            <div className="flex-auto p-2 bg-white border border-gray-300 rounded-md shadow-xl shadow-gray-300 flex items-center justify-center">
                {/* {filter1D.length ?
                    <h1>Chart</h1>:
                    <div className="flex flex-col items-center justify-center">
                        <img src={chartIcon} className="w-72"/>
                        <Button
                            title="نوع نمودار را انتخاب کنید"
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
                                // container: styles.windowBtn
                                container: "w-[300px] !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md m-3",
                                section: "!text-lg flex items-center justify-center !overflow-hidden"
                            }}
                        />
                    </div>
                } */}
            </div>
        </div>
    )
}

export default LINE