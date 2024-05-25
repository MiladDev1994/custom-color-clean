import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import Button from "../Common/Button/Button";
import Modal from "../Common/Modal/Modal";
import { useState } from "react";
import { AnyFilterChanged, AppDataState, FilterActiveIdState, FilterState, GlobalLoadingState, HistsDataState, IsModalOpenState, ModalTypeState, directoryPathSaveStateAtom } from "../../recoils/GlobalRecoil";
import { isLoadingSaveFileStateAtom } from "../../recoils/GlobalRecoil";
import { filtersListStateAtom } from "../../recoils/GlobalRecoil";
import { generalFilterConfigsListCopyAtom } from "../../recoils/GlobalRecoil";
import { programNameStateAtom } from "../../recoils/GlobalRecoil";
import { generalFilterConfigsListAtom } from "../../recoils/GlobalRecoil";
import { defaultFiltersListAtom } from "../../recoils/GlobalRecoil";
import { generalFilterConfigsTranslateAtom } from "../../recoils/GlobalRecoil";
import { defaultObjectTypeStateAtom } from "../../recoils/GlobalRecoil";
import { productTypeStateAtom } from "../../recoils/GlobalRecoil";
import { productTypesListStateAtom } from "../../recoils/GlobalRecoil";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/logo.png"
import { prepareConfigsAndFilters } from "../../../handler/utils/preparersAndConverters";
import * as ModalType from "../Common/ModalType/ModalType"
import { UseOnDataFromIpcMain } from "../../hooks/UseOnDataFromIpcMain";
import { Toast } from "../../utils/Toast";



export default function Header({
    children,
    hasSaveAs = true,
    hasSave = true,
    hasNew = true,
    hasOpen = true,
    hasAppDetails = true,
    onSubmit

}: any) {
    
    const typeOfSave = { save: "save", saveAs: "saveAS" };
    const typeOfFile = { new: "new", open: "open" };
        
    const navigate = useNavigate()
    const [appData, setAppData] = useRecoilState(AppDataState)

    // چک نشده
    const [directoryPath, setDirectoryPath] = useRecoilState(directoryPathSaveStateAtom);
    const [isLoadingSaveFile, setIsLoadingSaveFile] = useRecoilState(isLoadingSaveFileStateAtom);
    const [filters, setFilters] = useRecoilState(FilterState)
    const generalFilterConfigsListCopy = useRecoilValue(generalFilterConfigsListCopyAtom);
    const directoryPathSaveReset = useResetRecoilState(directoryPathSaveStateAtom);
    const [isModalOpen, setIsModalOpen] = useRecoilState(IsModalOpenState);
    const [modalType, setModalType] = useRecoilState(ModalTypeState);
    const [isLoading, setIsLoading] = useState(false);
    const [disableSave, setDisableSave] = useState(false);
    const [fileType, setFileType] = useState("");
    const resetFilters = useResetRecoilState(filtersListStateAtom)
    const [programName, setProgramName] = useRecoilState(programNameStateAtom);
    const setGeneralFilterConfigsList = useSetRecoilState(generalFilterConfigsListAtom);
    const setGeneralFilterConfigsListCopy = useSetRecoilState(generalFilterConfigsListCopyAtom);
    const setDefaultFiltersListAtom = useSetRecoilState(defaultFiltersListAtom);
    const setGeneralFilterConfigsTranslate = useSetRecoilState(generalFilterConfigsTranslateAtom);
    const setDefaultObjectType = useSetRecoilState(defaultObjectTypeStateAtom);
    const setProductType = useSetRecoilState(productTypeStateAtom);
    const productTypes = useRecoilValue(productTypesListStateAtom);
    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)
    const [globalLoading, setGlobalLoading] = useRecoilState(GlobalLoadingState)
    const [histsData, setHistsData] = useRecoilState(HistsDataState)
    const saveActive = filters.find((ele: any) => ele.allIdealPoints || ele.userData)


    UseOnDataFromIpcMain("saveFilter_chanel", (event: any, data: any) => {
        if (!data.status) return Toast("error", "برنامه ذخیره نشد. مجدد تلاش کنید")
        setAppData(data.appData)
        Toast("success", "برنامه با موفقیت ذخیره شد")
    })

    const afterSave = (type?: "NewFilter" | "OpenFilter") => {
        if (type === "NewFilter") navigate("/")
        if (type === "OpenFilter") api_electron.selectedPath().then((path: any) => path && api_electron.openFilters(path))
            
    }

    const saveHandler = (type?: "NewFilter" | "OpenFilter") => {
        if (!appData?.savePath) {
            api_electron.selectedPath().then((path: any) => {
                if (path) {
                    api_electron.saveFilter({savePath: path, type: "save"})
                    afterSave(type)
                    setIsModalOpen(false)
                }
            })
        } else {
            api_electron.saveFilter({savePath: appData?.savePath, type: "save"})
            afterSave(type)
            setIsModalOpen(false)
        } 
    }

    const saveAsHandler = (type?: "NewFilter" | "OpenFilter") => {
        api_electron.selectedPath().then((path: any) => {
            if (path) {
                api_electron.saveFilter({savePath: path, type: "saveAs"})
                afterSave(type)
                setIsModalOpen(false)
            }
        })
    }

    UseOnDataFromIpcMain("openFilters_chanel", (event: any, data: any) => {
        if (!data.status) return Toast("error", data.error)
        // const {filters, appData, hists} = data.filters
        const existConclusionFilters = data.filters.filters.find((ele: any) => ele.filter_type === "Conclusion")
        if (existConclusionFilters) {
            setFilterActiveId(existConclusionFilters)
            setFilters(data.filters.filters)
            setAppData(data.filters.appData)
            setHistsData(data.filters.hists)
            navigate("/report")
        } else {
            // if (Object.keys(appData).length) {
                const findLastFilter = data.filters.filters.length ? data.filters.filters.reduce((a: any, b: any) => a.id > b.id ? a : b) : {}
                setFilterActiveId(findLastFilter)
                setFilters(data.filters.filters)
                setAppData(data.filters.appData)
                setHistsData(data.filters.hists)
                navigate("/report")
            // } else navigate("/")
        }

        navigate("/report")
    })

    

    const Component = ModalType[modalType]
    const componentProps = {
        OpenFilter: {
            saveHandler,
            saveAsHandler,
        },
        NewFilter: {
            saveHandler,
            saveAsHandler,
        },
        AddFilter: {
            onSubmit,
        },
        AppDetails: {
        },
        FilterDetails: {
        },
        ShowImage: {
        },
        HV_Images: {
        }
    }


    return (
        <div className="w-full flex-none p-2 fixed z-50 m-auto flex flex-col gap-2 top-0 right-0">
            <div 
                className="w-full h-12 shadow-xl 
                shadow-[#00000028] max-w-[1900px] flex 
                items-stretch justify-between m-auto px-2 border border-gray-300 
                backdrop-blur-lg bg-white bg-opacity-70 rounded-md p-1"
            >
                <div className="h-full flex items-center justify-center gap-2 ">
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
                    <Button
                        icon='arrow-clockwise'
                        expand='block'
                        fill='info'
                        shape="round"
                        color='primary'
                        iconWidth="2rem"
                        iconHeight="2rem"
                        onClick={() => {
                            window.api_electron.reload()
                        }}
                        classNames={{
                            // container: styles.windowBtn
                            container: "w-[30px] h-[30px] !flex !items-center !justify-center flex-none px-2 transition-all duration-300 !rounded-md",
                            section: "text-md"
                        }}
                    />
                </div>

                <h3 className="flex items-center justify-center px-2 text-xl text-gray-600 font-bold">{appData.app_name}</h3>

                <div className="flex items-center justify-between gap-2">
                    {hasSaveAs && 
                        <Button
                            title="ذخیره جدید"
                            // icon='box-arrow-in-down'
                            expand='block'
                            fill='transparent'
                            color='gray'
                            shape="round"
                            iconWidth="1.6rem"
                            iconHeight="1.6rem"
                            outlineColor="lightgray"
                            disabled={!saveActive}
                            onClick={saveAsHandler}
                            classNames={{
                                container: "!h-7 !flex !items-center !justify-center !rounded-sm !bg-transparent !border-0 duration-200",
                                section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                            }}
                            // onClick={() => !isLoading && !disableSave && handleSaveFile(typeOfSave.saveAs)}
                            // classNames={{container: styles.submitBtn}}
                        />
                    }
                    {hasSave &&
                        <Button
                            title="ذخیره"
                            // icon='box-arrow-in-down'
                            expand='block'
                            fill='transparent'
                            color='gray'
                            shape="round"
                            iconWidth="1.6rem"
                            iconHeight="1.6rem"
                            outlineColor="lightgray"
                            disabled={!saveActive}
                            onClick={saveHandler}
                            classNames={{
                                container: "!h-7 !flex !items-center !justify-center !rounded-sm !bg-transparent !border-0 duration-200",
                                section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                            }}
                            // classNames={{container: styles.submitBtn}}
                        />
                    }
                    {hasOpen &&
                        <Button
                            title="انتخاب فیلتر"
                            // icon='box-arrow-in-down'
                            expand='block'
                            fill='transparent'
                            color='gray'
                            shape="round"
                            iconWidth="1.6rem"
                            iconHeight="1.6rem"
                            outlineColor="lightgray"
                            classNames={{
                                container: "!h-7 !flex !items-center !justify-center !rounded-md duration-200",
                                section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                            }}
                            onClick={() => {
                                if (!appData.isChanged) {
                                    api_electron.selectedPath().then((path: any) => {
                                        if (path) {
                                            api_electron.openFilters(path)
                                            setFilters([])
                                            setAppData({})
                                        }
                                        
                                    })
                                    // setFilterActiveId({})
                                    // setHistsData({})
                                } else {
                                    setModalType("OpenFilter");
                                    setIsModalOpen(true);
                                }
                            }}
                            // classNames={{container: styles.submitBtn}}
                        />
                    }
                    {hasNew &&
                        <Button
                            title="برنامه جدید"
                            // icon='box-arrow-in-down'
                            expand='block'
                            fill='transparent'
                            color='gray'
                            shape="round"
                            iconWidth="1.6rem"
                            iconHeight="1.6rem"
                            outlineColor="lightgray"
                            classNames={{
                                container: "!h-7 !flex !items-center !justify-center !rounded-md duration-200",
                                section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                            }}
                            onClick={() => {
                                if (!appData.isChanged) {
                                    // setFilterActiveId({})
                                    setFilters([])
                                    setAppData({})
                                    setHistsData({})
                                    navigate("/")
                                } else {
                                    setModalType("NewFilter");
                                    setIsModalOpen(true);
                                } 
                            }}
                            // classNames={{container: styles.submitBtn}}
                        />
                    }
                    {hasAppDetails && 
                        <Button
                            title="مشخصات برنامه"
                            // icon='box-arrow-in-down'
                            expand='block'
                            fill='transparent'
                            color='gray'
                            shape="round"
                            iconWidth="1.6rem"
                            iconHeight="1.6rem"
                            outlineColor="lightgray"
                            classNames={{
                                container: "!h-7 !flex !items-center !justify-center !rounded-sm !bg-transparent !border-0 duration-200",
                                section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                            }}
                            onClick={() => {
                                setModalType("AppDetails");
                                setIsModalOpen(true);
                                // setFileType(typeOfFile.open);
                            }}
                            // classNames={{container: styles.submitBtn}}
                        />
                    }
                    <img src={logo} className="h-full aspect-auto"/>
                </div>
            </div>

            <section>{children}</section>

            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen} 
                    setIsOpen={!globalLoading ? setIsModalOpen : console.log }
                >
                    <Component  {...componentProps[modalType]}/>
                </Modal>
            )}
        </div>

    )
} 


export function FiltersHandler() {

    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useRecoilState(IsModalOpenState);
    const [modalType, setModalType] = useRecoilState(ModalTypeState);
    const [filters, setFilters] = useRecoilState(FilterState)
    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)
    const [globalLoading, setGlobalLoading] = useRecoilState(GlobalLoadingState)
    const [anyFilterChanged, setAnyFilterChanged] = useRecoilState(AnyFilterChanged)
    const activeConclusionBtn = filters?.filter((ele: any) => ele.filter_type === "LINE" && ele.userData && Object.keys(ele.userData).length)

    UseOnDataFromIpcMain("deleteFilter_chanel", (event: any, data: any) => {
        if (data.deleted === filterActiveId.id) {
            const findLastFilter = data.filters.length ? data.filters.reduce((a: any, b: any) => a.id > b.id ? a : b) : 0
            setFilterActiveId(findLastFilter)
        }
        setFilters(data.filters)
    })

    UseOnDataFromIpcMain("resultGenerator_conclusion_chanel", (event: any, data: any) => {
        // console.log(data)
        if (data.status) {
            setFilters(data.filters)
            setAnyFilterChanged(false)
            const filterActive = data.filters.find((ele: any) => ele.filter_type === "Conclusion")
            if (filterActive) setFilterActiveId(filterActive)
            
        } else Toast("error", "اطلاعات خوانده نشد")
        setGlobalLoading(false)
    })

    const calculateConclusion = () => {
        const existConclusion = filters.find((ele: any) => ele.filter_type === "Conclusion")
        if (existConclusion && !anyFilterChanged) {
            setFilterActiveId(existConclusion)
        } else {
            api_electron.resultGenerator_conclusion()
            setGlobalLoading(true)
        }
    }
    
    return (
        <div 
            className="w-full h-12 shadow-xl
            shadow-[#00000028] max-w-[1900px] flex 
            items-center justify-between m-auto px-2 border border-gray-300 
            backdrop-blur-lg bg-white bg-opacity-70 rounded-md p-1 gap-2"
        >
            <Button
                title="جمع بندی فیلترهای تک بعدی"
                // icon='box-arrow-in-down'
                expand='block'
                fill={filterActiveId.filter_type === "Conclusion" ? "basic" : 'info'}
                color='gray'
                shape="round"
                iconWidth="1.6rem"
                iconHeight="1.6rem"
                outlineColor="lightgray"
                disabled={!activeConclusionBtn.length}
                direction="row_reverse"
                onClick={calculateConclusion}
                loading={globalLoading}
                classNames={{
                    container: "w-60 !h-8 !flex !items-center !justify-center !rounded-md duration-200 !flex-none",
                    section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                }}
            />
            <div className="h-full flex-auto flex items-center justify-start gap-2 border-l border-r border-gray-300 px-2 overflow-auto">
                {filters.filter((ele: any) => ele.filter_type !== "Conclusion").map((ele: any) => 
                    <div 
                        key={ele.id} 
                        className={`${ele.id === filterActiveId.id ? "bg-sky-400 ring-sky-500" : "bg-gray-200 ring-gray-300"}
                        ring-1 rounded-md flex items-stretch justify-center h-7 shadow-md cursor-pointer transition-all duration-300`}
                        
                    >
                        <Button
                            icon='x'
                            expand='block'
                            fill='transparent'
                            color='gray'
                            shape="pill"
                            iconWidth="1.6rem"
                            iconHeight="1.6rem"
                            outlineColor="lightgray"
                            // iconColor={`${ele.id === filterActiveId ? "white" : ""}`}
                            classNames={{
                                container: "w-8 !flex !items-center !justify-center duration-200 !flex-none",
                                section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                            }}
                            onClick={() => api_electron.deleteFilter(ele.id)}
                            // classNames={{container: styles.submitBtn}}
                        />
                        <span className="text-sm px-3 flex items-center justify-center " onClick={() => setFilterActiveId(ele)}>{ele.filter_name}</span>
                    </div>
                )}
            </div>
            <Button
                title="افزودن فیلتر"
                icon='plus-circle'
                expand='block'
                fill='transparent'
                color='primary'
                shape="round"
                iconWidth="1.4rem"
                iconHeight="1.4rem"
                outlineColor="lightgray"
                direction="row_reverse"
                classNames={{
                    container: "w-30 !h-8 !flex !items-center !justify-center !rounded-md duration-200 !flex-none",
                    section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                }}
                onClick={() => {
                    setModalType("AddFilter");
                    setIsModalOpen(true);
                }}
            />
        </div>

    )
}




    // const dddddd = [
    //     {id: 1, filter_name: "1111111111"},
    //     {id: 2, filter_name: "2111111111"},
    //     {id: 3, filter_name: "3111111111"},
    //     {id: 4, filter_name: "4111111111"},
    //     {id: 5, filter_name: "5111111111"},
    //     {id: 6, filter_name: "6111111111"},
    //     {id: 7, filter_name: "7111111111"},
    //     {id: 8, filter_name: "1111111111"},
    //     {id: 9, filter_name: "2111111111"},
    //     {id: 10, filter_name: "3111111111"},
    //     {id: 11, filter_name: "4111111111"},
    //     {id: 12, filter_name: "5111111111"},
    //     {id: 13, filter_name: "6111111111"},
    //     {id: 14, filter_name: "7111111111"},
    //     {id: 15, filter_name: "1111111111"},
    //     {id: 16, filter_name: "2111111111"},
    //     {id: 17, filter_name: "3111111111"},
    //     {id: 18, filter_name: "4111111111"},
    //     {id: 19, filter_name: "5111111111"},
    //     {id: 20, filter_name: "6111111111"},
    //     {id: 21, filter_name: "7111111111"},
    // ]