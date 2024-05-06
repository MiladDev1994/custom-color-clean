import React, { useState } from "react";
import styles from "./ImagesSwiper.module.scss"
import { useRecoilValue } from "recoil";
// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FilesPathState } from "../../../recoils/GlobalRecoil";


const ImagesSwiper = () => {
  
    const filesPath = useRecoilValue(FilesPathState)
    const [healthySwitch, setHealthySwitch] = useState<any>({
      healthy: true,
      nonHealthy: true,
    })
  
    return (
      <div className={styles.imageContainer}>
        {!!Object.entries(filesPath).length && Object.entries(filesPath).map(([keys, value]) => {
          const title = keys === "healthy" ? "خوب ها" : "بد ها";
          const switchTitle = keys === "healthy" ? "بد ها" : "خوب ها"
  
          return (
            <div key={keys} className={styles.fileBox}>
              <div className={styles.header}>
                <h3>{`خروجی ${title}`}</h3>
                <div className={styles.mode}>
                  <label>نمایش {switchTitle}</label>
                  <div 
                    className={`${styles.switch} ${healthySwitch[keys] ? styles.switchOn : styles.switchOff}`} 
                    onClick={() => setHealthySwitch({...healthySwitch, [keys]: !healthySwitch[keys]})}
                  >
                    <div className={styles.toggle} style={{right: healthySwitch[keys] ? "3px" : "27px"}}/>
                  </div>
                </div>
              </div>
  
              <div className={styles.sliderContainer}>
                {Object.entries(value).map(([folderPath, files]: any) => 
                  <div key={folderPath} className={styles.sliderBox}>
                    <div className={styles.titleBox}>
                      <h4>{folderPath.split("/").pop().replace("~", "").split("_").reverse().join("_")}</h4>
                      {/* <h4>{folderPath.includes("/Accept/") ? "Accept" : "Reject"}</h4> */}
                    </div>
                    <div className={styles.swiperBox}>
                      <Swiper
                        spaceBetween={0}
                        breakpoints={{
                            0:{slidesPerView:1},
                            400:{slidesPerView:2},
                            600:{slidesPerView:2},
                            800:{slidesPerView:3},
                            1000:{slidesPerView:3},
                            1200:{slidesPerView:4},
                            1400:{slidesPerView:4},
                        }}
                        className={styles.swiper}
                      >
                        {(keys === "healthy" ? healthySwitch[keys] : true) && files.isInXml.map((img: any, index: any) => 
                          <SwiperSlide key={index}>
                            <div 
                              className={styles.swiperItem} 
                            >
                              <Image src={img} style={{border: "5px solid #ff3d3d"}}/>
                            </div>
                          </SwiperSlide>)
                        }
  
                        {(keys === "healthy" ? true : healthySwitch[keys]) && files.isOutXml.map((img: any, index: any) => 
                          <SwiperSlide key={index}>
                            <div className={styles.swiperItem}>
                              <Image src={img}/>
                            </div>
                          </SwiperSlide>)
                        }
  
                      </Swiper>
                    </div>
                  </div>
                )}
              </div>
  
            </div>
          )}
        )}
      </div>
    )
  }
  
  
  const Image = ({src, style}: any) => {
  
    const [size, setSize] = useState({
      width: 0,
      height: 0,
    })
  
    const loadHandler = (e: any) => {
      setSize({
          width: e.target.naturalWidth,
          height: e.target.naturalHeight,
      })
    }
  
    return (
      <img 
        onLoad={loadHandler}  
        src={`data:image/jpeg;base64,${src}`}
        style={{
            width: !size.width ? "0" : size.width > size.height ? "100%" : "unset",
            height: !size.width ? "0" : size.width > size.height ? "unset" : "100%",
            ...style,
        }}
      />
    )
  }
  

export default ImagesSwiper;