import React, { useEffect, useRef, useState } from 'react';
import styles from "./ZoomChart.module.scss";
import Icon from '../Icon/Icon';

function ZoomChart(props: any) {

    const {chartHeight, setZoom, max, setAnimation} = props;
    let boxHeight = chartHeight - 70;
    const container = useRef(null)
    const bothRef = useRef(null)
    const [onClick, setOnClick] = useState<any>("")
    const [btnLocation, setBtnLocation] = useState<any>({
        min: 0,
        max: boxHeight,
    })
    const [containerTop, setContainerTop] = useState(0)
    const [mouseWalk, setMouseWalk] = useState("")
    const [bothOnClick, setBothOnClick] = useState(false)
    const [distance, setDistance] = useState({
        top: 0,
        bottom: 0,
    })
    const [distanceBetween, setDistanceBetween] = useState(boxHeight)
    const [scroll, setScroll] = useState(0)
    const minimumDistanceBetweenButton = 40;

    let mouseOldLocation = 0;
    let mouseNewLocation;
    const mouseStyleHandler = (e: any) => {
        let mouseY = e.pageY
        if (mouseY < mouseOldLocation) mouseNewLocation = "UP"
        else if (mouseY > mouseOldLocation) mouseNewLocation = "DOWN"
        else mouseNewLocation = undefined;
        setMouseWalk(mouseNewLocation)
        mouseOldLocation = mouseY
    }
    
    const mouseMoveHandler = (e: any, type: any) => {
        e.preventDefault()
        if (!onClick) return;
        switch (type) {
            case "max":
                if (btnLocation[type] >= btnLocation.min + minimumDistanceBetweenButton) {
                    if (btnLocation[type] < boxHeight + (mouseWalk === "DOWN" && 2 )) {
                        setBtnLocation({
                            ...btnLocation,
                            [type]: (containerTop+boxHeight - scroll) - e.pageY + scroll
                        })
                        setDistanceBetween(btnLocation.max - btnLocation.min)
                        // const chartZoom = {} 
                        // Object.entries(btnLocation).map(([keys, value]) => {return {...chartZoom[keys]= (value / boxHeight)}})
                        // setZoom({
                        //     ...chartZoom,
                        //     [type]: ((containerTop+boxHeight - scroll) - e.pageY + scroll) / boxHeight
                        // })
                    } else {
                        mouseWalk === "DOWN" && setOnClick(false)
                        setBtnLocation({
                            ...btnLocation,
                            [type]: boxHeight
                        })
                        setDistanceBetween(minimumDistanceBetweenButton)
                    }
                } else {
                    setOnClick(false)
                    setBtnLocation({
                        ...btnLocation,
                        [type]: btnLocation.min + minimumDistanceBetweenButton
                    })
                    setDistanceBetween(minimumDistanceBetweenButton)
                }
            break;
            case "min":
                if (btnLocation[type] <= btnLocation.max - minimumDistanceBetweenButton) {
                    if (btnLocation[type] > (mouseWalk === "UP" && -2)) {
                        setBtnLocation({
                            ...btnLocation,
                            [type]: (containerTop+boxHeight - scroll) - e.pageY + scroll
                        })
                        setDistanceBetween(btnLocation.max - btnLocation.min)
                    } else {
                        mouseWalk === "UP" && setOnClick(false)
                        setBtnLocation({
                            ...btnLocation,
                            [type]: 0
                        })
                        setDistanceBetween(minimumDistanceBetweenButton)
                    }
                } else {
                    setOnClick(false)
                    setBtnLocation({
                        ...btnLocation,
                        [type]: btnLocation.max - minimumDistanceBetweenButton
                    })
                    setDistanceBetween(minimumDistanceBetweenButton)
                }
            break;
        }
    }

    const distanceHandler = (e: any) => {
        const distanceBottom = bothRef.current.scrollHeight + e.target.getBoundingClientRect().top - e.pageY
        const distanceTop = (btnLocation.max - btnLocation.min) - distanceBottom
        setDistance({
            top: distanceTop,
            bottom: distanceBottom,
        })
    }

    const bothMouseMoveHandler = (e: any) => {
        e.preventDefault()
        if (!bothOnClick) return;
        if (mouseWalk === "DOWN") {
            if (btnLocation.min > 0) {
                const minValue = (containerTop+boxHeight - scroll) - e.pageY - distance.bottom
                setBtnLocation({
                    min: minValue,
                    max: minValue + distanceBetween,
                })
            } else {
                setBtnLocation({
                    min: 0,
                    max: distanceBetween,
                })
                distanceHandler(e)
            }
        } else if (mouseWalk === "UP") {
            if (btnLocation.max < boxHeight) {
                const maxValue = (containerTop+boxHeight - scroll) - e.pageY + distance.top;
                setBtnLocation({
                    min: maxValue - distanceBetween,
                    max: maxValue,
                })
            } else {
                setBtnLocation({
                    min: boxHeight - distanceBetween,
                    max: boxHeight,
                })
                distanceHandler(e)
            }
        }
        
    }

    useEffect(() => {
        boxHeight = chartHeight - 70;
        container && setContainerTop(container.current.getBoundingClientRect().top)
        setBtnLocation({
            min: 0,
            max: boxHeight
        })
        setDistanceBetween(boxHeight)
        window.addEventListener("mousemove", mouseStyleHandler)
        return () => {
            window.removeEventListener('mousemove', mouseStyleHandler);
        }
    } , [chartHeight])


    useEffect(() => {
        setZoom({
            min: btnLocation.min / boxHeight,
            max: btnLocation.max / boxHeight,
        })
    } , [btnLocation])

    useEffect(() => {
        window.addEventListener("scroll", () => setScroll(document.documentElement.scrollTop))
        return () => {
            window.removeEventListener("scroll", () => setScroll(document.documentElement.scrollTop))
        }
    } , [])
    

    return (
        <div 
            ref={container}
            className={styles.container} 
            style={{height: `${boxHeight}px`}}
            onMouseDown={() => setAnimation(false)}
            onTouchStart={() => setAnimation(false)}
            onMouseUp={() => setAnimation(true)}
            onTouchEnd={() => setAnimation(true)}
        >
            <div className={styles.maxBtn} style={{bottom: btnLocation.max ? btnLocation.max : 0, zIndex: onClick === "max" ? 10 : 9}}>
                <div className={styles.clickBox}>
                    <Icon
                        width="2rem"
                        height="2rem"
                        name={"list"}
                        color="gray"
                    />
                    <div 
                        className={styles.btn}
                        onMouseDown={() => {
                            setOnClick("max")
                            setMouseWalk("")
                        }}
                        onTouchStart={() => {
                            setOnClick("max")
                            setMouseWalk("")
                        }}
                        onMouseUp={() => setOnClick("")}
                        onTouchEnd={() => setOnClick("")}
                        onMouseLeave={() => setOnClick("")}
                        onMouseMove={(e) => mouseMoveHandler(e, "max")}
                        onTouchMove={(e) => mouseMoveHandler(e, "max")}
                        style={{width: onClick ? "65px" : "25px", height: onClick ? "80px" : "25px",}}
                    ></div>
                    <div className={styles.showLocation}>
                        {props.type === "Percent" ? 
                            <span>{Math.round(+(max * (btnLocation.max / boxHeight)).toFixed(2) * 100)}%</span> :
                            <span>{((max * (btnLocation.max / boxHeight)).toFixed(2))}</span>
                        }
                    </div>
                </div>
            </div>

            <div 
                ref={bothRef}
                className={styles.area}
                style={{
                    height: !isNaN(btnLocation.max) && btnLocation.max - btnLocation.min,
                    bottom: btnLocation.min,
                }}
            >
                <div className={styles.areaBox}>
                    <div 
                        onMouseDown={(e) => {
                            setMouseWalk("")
                            mouseNewLocation = undefined
                            setBothOnClick(true)
                            distanceHandler(e)
                        }}
                        onTouchStart={(e) => {
                            setMouseWalk("")
                            mouseNewLocation = undefined
                            setBothOnClick(true)
                            distanceHandler(e)
                        }}
                        onMouseUp={() => {
                            mouseNewLocation = undefined
                            setBothOnClick(false)
                        }}
                        onTouchEnd={() => {
                            mouseNewLocation = undefined
                            setBothOnClick(false)
                        }}
                        onMouseOut={() => {
                            mouseNewLocation = undefined
                            setBothOnClick(false)
                        }}
                        onMouseMove={(e) => {
                            mouseNewLocation = undefined
                            bothMouseMoveHandler(e)
                        }}
                        onTouchMove={(e) => {
                            mouseNewLocation = undefined
                            bothMouseMoveHandler(e)
                        }}
                        className={styles.clickBox}
                        style={{
                            width: bothOnClick ? "85px" : "100%",
                            height: bothOnClick ? "calc(100% + 100px)" : "100%",
                            zIndex: bothOnClick ? 10 : 8
                        }}
                    ></div>
                    <div className={styles.btn}></div>
                </div>
            </div>

            <div className={styles.maxBtn} style={{bottom: btnLocation.min, zIndex: onClick === "min" ? 10 : 9}}>
                <div className={styles.clickBox}>
                    <Icon
                        width="2rem"
                        height="2rem"
                        name={"list"}
                        color="gray"
                    />
                    <div 
                        className={styles.btn}
                        onMouseDown={() => {
                            setMouseWalk("")
                            setOnClick("min")
                        }}
                        onTouchStart={() => {
                            setMouseWalk("")
                            setOnClick("min")
                        }}
                        onMouseUp={() => setOnClick("")}
                        onTouchEnd={() => setOnClick("")}
                        onMouseLeave={() => setOnClick("")}
                        onMouseMove={(e) => mouseMoveHandler(e, "min")}
                        onTouchMove={(e) => mouseMoveHandler(e, "min")}
                        style={{width: onClick ? "65px" : "25px", height: onClick ? "80px" : "25px",}}
                    ></div>
                    <div className={styles.showLocation}>
                        {props.type === "Percent" ? 
                            <span>{Math.round(+(max * (btnLocation.min / boxHeight)).toFixed(2) * 100)}%</span> :
                            <span>{((max * (btnLocation.min / boxHeight)).toFixed(2))}</span>
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ZoomChart;
