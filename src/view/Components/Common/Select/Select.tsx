

import { useEffect, useState } from "react";
import styles from "./Select.module.scss"
import Button from "../Button/Button";
// import { FilterState } from "../../../../src/Components/Recoil/Atoms";
import { useRecoilState } from "recoil";
import { WorksState } from "../../../recoils/GlobalRecoil";
// import { WORK_FA } from "../../../config/work.Config";

const Select = ({data, label, setValue, value, slug, icon, iconRotate, button, classNames, drop, theme, error, focus}: any) => {

    const [allRecordDrop, setAllRecordDrop] = useState(false)
    const [worksData, setWorksData] = useRecoilState(WorksState)
    // const [filter, setFilter] = useRecoilState(FilterState)
    let dropAct = false;
  
    // const selectHandler = (values: any) => {
    //     setAllRecordDrop(false)
    //     setValue({
    //         ...value,
    //         [slug]: values.value
    //     })

    // }
    useEffect(() => {
        if (data?.length === 1) setValue({...value, type: data[0]})
    }, [data])

    // console.log(data.option.find((ele: any) => ele.value === value[data.value])?.name)

    // console.log(value[data.value])
    // console.log(data.option)
    return (
        <div 
            tabIndex={0} 
            className={`${styles.selectRecord}${classNames?.container ? " " + classNames.container : ""}`} 
            onBlur={() => !dropAct && setAllRecordDrop(false)}
        >
            <label>{label}</label>
            <Button
                title={data.option.find((ele: any) => ele.value === value[data.value])?.name || "انتخاب..."}
                color='gray'
                fill={theme === "dark" ? "basic" : "light"}
                outLineSize="1px"
                outlineColor={theme === "dark" ? "black" : "lightgray"}
                expand='full'
                icon={icon ? icon : 'chevron-down'}
                iconWidth="1.1rem"
                iconHeight="1.1rem"
                iconRotate={iconRotate && allRecordDrop ? 180 : 0}
                direction='row_reverse'
                onClick={() => setAllRecordDrop(prev => !prev)}
                classNames={{
                    container: `${styles.btnContainer}${classNames?.btn?.container ? " " + classNames?.btn?.container : ""}`,
                    section: `${classNames?.btn?.section ? " " + classNames.btn.section : ""}`
                }}
                {...button}
            />
            {(error && focus) && <span>{error}</span>}

            {allRecordDrop && 
                <div 
                    className={`${styles.allRecordDrop}${classNames?.dropBox ? " " + classNames?.dropBox : ""}`} 
                    // onClick={() => setAllRecordDrop(true)}
                    onMouseDown={() => dropAct = true}
                    onMouseUp={() => dropAct = false}
                >
                    <div className={styles.recordBox}>
                        {data && data.option.map((work: any) =>

                            <div 
                                key={work.id} 
                                className={`${styles.recordItem}${classNames?.dropItem ? " " + classNames?.dropItem : ""}`} 
                                onMouseDown={() => setValue({...value, [data.value]: work.value})}
                            >
                                <span className={styles.recordId}>{work.name}</span>
                            </div>
                        )}
                    </div>
                </div>
            }
        </div>
    )
  }


  export default Select;