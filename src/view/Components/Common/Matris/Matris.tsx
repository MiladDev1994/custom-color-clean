import React from 'react';
import styles from "./Matris.module.scss"
import Icon from '../Icon/Icon';

function Matris({
    data, 
    onClick,
    charts,
    pointSelected,
    name,
}: any) {
    return (
        
        <div className={styles.matrixBox}>
            {name && <h3>{name}</h3>}
            
            <div className={styles.matrix}>
                {data.map((item: any) => 
                    <div 
                        key={item.type} 
                        className={`
                            ${styles.matrixItem}
                            ${styles[item.style]}
                        `} 
                        onClick={onClick ? () => onClick(item.nickname, item.type) : console.warn}
                    > 
                        {onClick &&
                            <Icon
                                width="2rem"
                                height="2rem"
                                name={charts.find((ele: any) => ele.label.replaceAll(" ", "") === item.nickname) ? "check2" : "x"}
                                classNames={`${styles.chartIcon} ${styles[item.style]}`}
                            />
                        }
                        <div 
                            className={`${styles.matrixCard}`}
                        >
                            <h5
                            // className={`${!dataSelected.find(ele => ele.label.replaceAll(" ", "") === item.nickname) ? styles.onSelect : ""} `}
                            >{item.title}</h5>
                            <h2>{
                                !(pointSelected[item.type]) ? "---" :
                                `${((1-pointSelected[item.type]) * 100)?.toFixed(0)}%`
                            }</h2>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Matris;