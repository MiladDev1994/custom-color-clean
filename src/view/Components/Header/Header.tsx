import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import Button from "../Common/Button/Button";
import Modal from "../Common/Modal/Modal";
import { useState } from "react";
import { FilterActiveIdState, FilterState, IsModalOpenState, ModalTypeState, directoryPathSaveStateAtom } from "../../recoils/GlobalRecoil";
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



export default function Header({
    children,
    hasSaveAs = true,
    hasSave = true,
    hasNew = true,
    hasOpen = true,

}: any) {
    
    const typeOfSave = { save: "save", saveAs: "saveAS" };
    const typeOfFile = { new: "new", open: "open" };
        
    const navigate = useNavigate()

    // چک نشده
    const [directoryPath, setDirectoryPath] = useRecoilState(directoryPathSaveStateAtom);
    const [isLoadingSaveFile, setIsLoadingSaveFile] = useRecoilState(isLoadingSaveFileStateAtom);
    const [filters, setFilters] = useRecoilState(filtersListStateAtom);
    const generalFilterConfigsListCopy = useRecoilValue(generalFilterConfigsListCopyAtom);
    const directoryPathSaveReset = useResetRecoilState(directoryPathSaveStateAtom);
    const [isModalOpen, setIsModalOpen] = useRecoilState(IsModalOpenState);
    const [modalType, setModalType] = useRecoilState(ModalTypeState);
    const [isLoading, setIsLoading] = useState(false);
    const [disableSave, setDisableSave] = useState(false);
    const [fileType, setFileType] = useState("");
    const resetFilters = useResetRecoilState(filtersListStateAtom)
    const [programName,setProgramName] = useRecoilState(programNameStateAtom);
    const setGeneralFilterConfigsList = useSetRecoilState(generalFilterConfigsListAtom);
    const setGeneralFilterConfigsListCopy = useSetRecoilState(generalFilterConfigsListCopyAtom);
    const setDefaultFiltersListAtom = useSetRecoilState(defaultFiltersListAtom);
    const setGeneralFilterConfigsTranslate = useSetRecoilState(generalFilterConfigsTranslateAtom);
    const setDefaultObjectType = useSetRecoilState(defaultObjectTypeStateAtom);
    const setProductType = useSetRecoilState(productTypeStateAtom);
    const productTypes = useRecoilValue(productTypesListStateAtom);
    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)


    // const renderModalContent = () => {
    //     switch (modalType) {
    //       case "New":
    //         return (
    //             <div className={"w-[800px] text-center p-2"}>
    //                 <div className={`w-full text-lg before:content-["اخطار:"] before:text-red-400 before:mx-1`}>
    //                     قبل از باز کردن برنامه جدید، وضعیت برنامه فعلی را مشخص کنید 
    //                 </div>
    //                 <div className={"flex items-center justify-around mt-10 gap-2"}>
                        
    //                     <Button
    //                         title="ذخیره کردن"
    //                         // icon='box-arrow-in-down'
    //                         expand='block'
    //                         fill='info'
    //                         color='gray'
    //                         shape="round"
    //                         iconWidth="1.6rem"
    //                         iconHeight="1.6rem"
    //                         outlineColor="lightgray"
    //                         classNames={{
    //                             container: "!h-12 !w-[25%] !flex !items-center !justify-center !rounded-md duration-200",
    //                             section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
    //                         }}
    //                         onClick={() => !disableSave && handleSaveFile(typeOfSave.save)}
    //                     />
    //                     <Button
    //                         title="ذخیره کردن با نام جدید"
    //                         expand='block'
    //                         fill='info'
    //                         color='gray'
    //                         shape="round"
    //                         iconWidth="1.6rem"
    //                         iconHeight="1.6rem"
    //                         outlineColor="lightgray"
    //                         classNames={{
    //                             container: "!h-12 !w-[25%] !flex !items-center !justify-center !rounded-md duration-200",
    //                             section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
    //                         }}
    //                         onClick={() => !disableSave && handleSaveFile(typeOfSave.saveAs)}
    //                     />
    //                     <Button
    //                         title="ذخیره نشود"
    //                         expand='block'
    //                         fill='info'
    //                         color='gray'
    //                         shape="round"
    //                         iconWidth="1.6rem"
    //                         iconHeight="1.6rem"
    //                         outlineColor="lightgray"
    //                         classNames={{
    //                             container: "!h-12 !w-[25%] !flex !items-center !justify-center !rounded-md duration-200",
    //                             section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
    //                         }}
    //                         onClick={() => handleSaveFile()}
    //                     />
    //                     <Button
    //                         title="انصراف"
    //                         expand='block'
    //                         fill='info'
    //                         color='gray'
    //                         shape="round"
    //                         iconWidth="1.6rem"
    //                         iconHeight="1.6rem"
    //                         outlineColor="lightgray"
    //                         classNames={{
    //                             container: "!h-12 !w-[25%] !flex !items-center !justify-center !rounded-md duration-200",
    //                             section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
    //                         }}
    //                         onClick={() => {
    //                             setIsModalOpen(false);
    //                             setFileType("");
    //                         }}
    //                     />
    //                 </div>
    //             </div>
    //         );
    //       default:
    //         setIsModalOpen(false);
    //         break;
    //     }
    // };
    
      // برای ذخیره کردن فایل
    const resetAtoms = () => {
        // programNameReset();
        // defaultObjectTypeReset();
        // productTypeReset();
        // // goodCommodityDirReset();
        // // badCommodityDirReset();
        // directoryPathSaveReset();
        // filtersListReset();
    };
    const saveAsFile = () => api_electron.saveAsFile();
    const saveFile = async (directoryPath: any, filters: any, configs: any) => {
        setIsLoadingSaveFile(true);
        await api_electron.saveFile(directoryPath, filters, configs).then((res: any) => setIsLoadingSaveFile(!res));
    };

    const openSelectDir = () => api_electron.selectFolder();
    const handleSaveFile = async (saveType?: any) => {
        let openDialogCancel = false;
        switch (saveType) {
        case "save":
            !directoryPath
            ? await saveAsFile().then((selectedPath: any) => {
                if (selectedPath) {
                    selectedPath = `${
                    selectedPath}\\customProgramDir_${Date.now()}`;
                    // console.log(selectedPath);
                    saveFile(selectedPath, filters, generalFilterConfigsListCopy);
                    setDirectoryPath(selectedPath);
                    // console.log("SAVED...", selectedPath);
                } else {
                    openDialogCancel = true;
                }
                })
            : saveFile(directoryPath, filters, generalFilterConfigsListCopy);
            break;
        case "saveAS":
            await saveAsFile().then((selectedPath) => {
            if (selectedPath) {
                selectedPath = `${
                selectedPath}\\customProgramDir_${Date.now()}`;
                // console.log(selectedPath);
                saveFile(selectedPath, filters, generalFilterConfigsListCopy);
                setDirectoryPath(selectedPath);
                // console.log("Changed Path SAVED...", selectedPath);
            } else {
                openDialogCancel = true;
            }
            });
            break;
        default:
            directoryPathSaveReset();
            break;
        }
        
        if (!openDialogCancel) {
        switch (fileType) {
            case "new":
            resetAtoms();
            navigate("/");
            setIsModalOpen(false);
            setFileType("");
            break;
            case "open":
            openSelectDir().then(({path, customDefaultSorterConfig, customDefaultfilters, customTranslator}) => {
                prepareConfigsAndFilters(customDefaultSorterConfig,customDefaultfilters).then((
                [sorterConfig, tempfilters]: any) => {
                    resetFilters();
                    setProgramName(sorterConfig?.configs?.programName ?? "Custom Program");
                    setGeneralFilterConfigsList(sorterConfig);
                    setGeneralFilterConfigsListCopy(sorterConfig);
                    setGeneralFilterConfigsTranslate(customTranslator);
                    setDefaultFiltersListAtom(tempfilters);
                    // console.log(sorterConfig?.configs?.sorterType,
                    //   productTypes.find(
                    //     i => i.value === sorterConfig?.configs?.sorterType?.toLowerCase())?.id ?? -1);
                    let dot = -1;
                    try {
                    dot = Number.parseInt(sorterConfig?.configs.defaultObjectType);
                    } catch (error) {}
                    // console.log("dot",dot);
                    setDefaultObjectType(dot);
                    let productName = sorterConfig?.configs?.sorterType?.toLowerCase()
                    if (sorterConfig?.configs?.sorterType === "SUNFLOWERSEED") productName = "sfs"
                    if (sorterConfig?.configs?.sorterType === "PEANUTS") productName = "peanut"
                    setProductType(
                    productTypes.find(
                        i => i.value === productName)?.id
                        ?? -1);
                    let temp: any = [];
                    Object.keys(tempfilters).forEach((key) => {
                    if(Object.keys(tempfilters[key]).length === 0 ) return;
                    let newFilter: any = {
                        name: tempfilters[key].configs?.name,
                        type: tempfilters[key].configs.chartKey ? tempfilters[key].configs.filterType
                        : tempfilters[key].configs.filterType.toLowerCase(
                        ).startsWith("deep") ? "deep" : "size",
                        goodDirection: 0,
                        data: {},
                        viewIndex: temp.length,
                        isActive: true,
                        effectiveness: 50,
                    };
                        if (
                        (newFilter?.type?.toLowerCase() === "deep" ||
                            newFilter?.type?.toLowerCase() === "size") &&
                        (!newFilter?.configs || Object.keys(newFilter?.configs ?? {})?.length == 0)
                        ) {
                        newFilter.configs = tempfilters[newFilter.type].configs;
                        newFilter.attributes = tempfilters[newFilter.type].attributes;
                        newFilter.isActive = tempfilters[newFilter.type].isActive;
                        temp.push(newFilter);
                        } else {
                        if(!(tempfilters[key].data.p1.x == 0 && tempfilters[key].data.p1.y == 0 &&
                            tempfilters[key].data.p2.x == 255 && tempfilters[key].data.p2.y == 0)) {
                            newFilter.data.verticalLines = [
                                tempfilters[key].data.p1.x,tempfilters[key].data.p2.x];
                            if(tempfilters[key].data.p1.y === tempfilters[key].data.p2.y)
                                newFilter.data.horizontalLine = tempfilters[key].data.p1.y;
                            else newFilter.data.extendedLines = [tempfilters[key].data.p1, tempfilters[key].data.p2];
                            }
                            // if(tempfilters[key]?.configs?.IsGoodSelected) newFilter.isGoodSelected = tempfilters[key]?.configs?.IsGoodSelected;
                            // else newFilter.isGoodSelected = false;
                            // console.log("tempfilters[key]?.configs?.isGoodSelected)",
                            // tempfilters[key]?.configs?.isGoodSelected, typeof(tempfilters[key]?.configs?.isGoodSelected), tempfilters[key]?.configs?.isGoodSelected == "1");
                        if(tempfilters[key]?.configs?.isGoodSelected == "1") newFilter.isGoodSelected = 1;
                        else newFilter.isGoodSelected = 0;
                        if(tempfilters[key].configs.isTopSelected.toLowerCase() === "true") newFilter.goodDirection = 0;
                        else newFilter.goodDirection = 1;
                        newFilter.chartKey = tempfilters[key].configs.chartKey;
                        temp.push(newFilter);
                        }
                    })
                    setFilters(temp);
                    if(!customDefaultfilters.size || !customDefaultfilters.deep) {
                    api_electron.completeSorterConfigData(sorterConfig.configs.sorterType.toLowerCase())
                    }
                });
                if (path) {
                setFileType("");
                setDirectoryPath(path);
                navigate("/");
                setIsModalOpen(false);
                }
            });
            break;
            default:
            break;
        }
        }
    };


    const Component = ModalType[modalType]
    const componentProps = {
        NewOrOpen: {
            disableSave,
            handleSaveFile,
            setIsModalOpen,
            setFileType,
        },
        AddFilter: {
        }
    }

    return (
        <>
            <div className="w-full flex-none p-2 fixed z-50 m-auto flex flex-col gap-2 top-0">
                <div 
                    className="w-full h-12 shadow-xl 
                    shadow-gray-300 max-w-[1900px] flex 
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
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        {hasSaveAs && 
                            <Button
                                title="Save As"
                                // icon='box-arrow-in-down'
                                expand='block'
                                fill='transparent'
                                color='gray'
                                shape="round"
                                iconWidth="1.6rem"
                                iconHeight="1.6rem"
                                outlineColor="lightgray"
                                disabled={!filterActiveId}
                                classNames={{
                                    container: "!h-7 !flex !items-center !justify-center !rounded-sm !bg-transparent !border-0 duration-200",
                                    section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                                }}
                                onClick={() => !isLoading && !disableSave && handleSaveFile(typeOfSave.saveAs)}
                                // classNames={{container: styles.submitBtn}}
                            />
                        }
                        {hasSave &&
                            <Button
                                title="Save"
                                // icon='box-arrow-in-down'
                                expand='block'
                                fill='transparent'
                                color='gray'
                                shape="round"
                                iconWidth="1.6rem"
                                iconHeight="1.6rem"
                                outlineColor="lightgray"
                                disabled={!filterActiveId}
                                classNames={{
                                    container: "!h-7 !flex !items-center !justify-center !rounded-sm !bg-transparent !border-0 duration-200",
                                    section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                                }}
                                onClick={() => !isLoading && !disableSave && handleSaveFile(typeOfSave.save)}
                                // classNames={{container: styles.submitBtn}}
                            />
                        }
                        {hasOpen &&
                            <Button
                                title="Open"
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
                                    setModalType("NewOrOpen");
                                    setIsModalOpen(true);
                                    setFileType(typeOfFile.open);
                                }}
                                // classNames={{container: styles.submitBtn}}
                            />
                        }
                        {hasNew &&
                            <Button
                                title="New"
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
                                    setModalType("NewOrOpen");
                                    setIsModalOpen(true);
                                    setFileType(typeOfFile.new);
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
                        setIsOpen={setIsModalOpen}
                    >
                        <Component  {...componentProps[modalType]}/>
                    </Modal>
                )}
            </div>
            {/* <div className="w-full h-28"/> */}
        </>

    )
} 


export function FiltersHandler() {

    const [isModalOpen, setIsModalOpen] = useRecoilState(IsModalOpenState);
    const [modalType, setModalType] = useRecoilState(ModalTypeState);
    const [filters, setFilters] = useRecoilState(FilterState)
    const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)

    UseOnDataFromIpcMain("deleteFilter_chanel", (event: any, data: any) => {
        if (data.deleted === filterActiveId) {
            const findLastFilter = data.filters.length ? data.filters.reduce((a: any, b: any) => a.id > b.id ? a : b).id : 0
            setFilterActiveId(findLastFilter)
        }
        setFilters(data.filters)
    })
    
    return (
        <div 
            className="w-full h-12 shadow-lg 
            shadow-gray-300 max-w-[1900px] flex 
            items-center justify-between m-auto px-2 border border-gray-300 
            backdrop-blur-lg bg-white bg-opacity-70 rounded-md p-1 gap-2"
        >
            <Button
                title="جمع بندی فیلترها"
                // icon='box-arrow-in-down'
                expand='block'
                fill='info'
                color='gray'
                shape="round"
                iconWidth="1.6rem"
                iconHeight="1.6rem"
                outlineColor="lightgray"
                disabled={!filterActiveId}
                classNames={{
                    container: "w-36 !h-8 !flex !items-center !justify-center !rounded-md duration-200 !flex-none",
                    section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                }}
                // onClick={() => !isLoading && !disableSave && handleSaveFile(typeOfSave.saveAs)}
                // classNames={{container: styles.submitBtn}}
            />
            <div className="h-full flex-auto flex items-center justify-start gap-2 border-l border-r border-gray-300 px-2">
                {filters.map((ele: any) => 
                    <div 
                        key={ele.id} 
                        className={`${ele.id === filterActiveId ? "bg-sky-400 ring-sky-500" : "bg-gray-200 ring-gray-300"}
                        ring-1 rounded-md flex items-stretch justify-center h-8 shadow-md cursor-pointer transition-all duration-300`}
                        
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
                        <span className="text-sm px-3 flex items-center justify-center " onClick={() => setFilterActiveId(ele.id)}>{ele.filter_name}</span>
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

// const ModalType = ({modalType}: {modalType: "New"}) => {

//     const Component = Text[modalType]
//     console.log(Component)
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     return (
//         <Component />
//     )
// }

