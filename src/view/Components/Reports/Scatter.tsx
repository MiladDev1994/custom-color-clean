import { useRecoilState } from "recoil"
import AreaChart from "../AreaChart/AreaChart"
import ImagesSwiper from "../Common/ImagesSwiper/ImagesSwiper"
import IntensityChart from "../IntensityChart/IntensityChart"
import { FilterActiveIdState, FilterState, ScatterPointLocationState } from "../../recoils/GlobalRecoil"
import { useEffect, useState } from "react"
import { chartTheme } from "../IntensityChart/Theme"

const SCATTER = (props: any) => {

  const [filterActiveId, setFilterActiveId] = useRecoilState(FilterActiveIdState)
  const [intensityGraphs, setIntensityGraphs] = useState<any>([])

  const [intensityPointSelectedData, setIntensityPointSelectedData] = useState<any>({})
  const [matrixData, setMatrixData] = useState<any>({
    e0: "", e1: "", e4: "", e2: "", 
    e3: "", e5: "", e6: "", e7: "", 
    e8: "",
    n0: "", n1: "", n4: "", n2: "", 
    n3: "", n5: "", n6: "", n7: "", 
    n8: "", numsLength: 0
  })
  const [areaPointSelectedData, setAreaPointSelectedData] = useState<any>({})
  const [filePath, setFilesPath] = useState<any>({})
  const [areaGraphs, setAreaGraph] = useState<any>([])
  const [intensityChartSize, steIntensityChartSize] = useState<any>({});
  const [areaChartSize, steAreaChartSize] = useState<any>({});
  const [lineTypeToDraw, setLineTypeToDraw] = useState(0);
  const [scatterPointLocation, setScatterPointLocation] = useRecoilState(ScatterPointLocationState) 
  

    const intensityOnClick = (lineType: any, canvasPos: any, getLines: any) => {
      // console.log(getLines)
      if (lineType === 0) {
        setFilesPath({})
        setAreaPointSelectedData([])
        let pointSelected: any = {};
        if (lineType === 0) {
          pointSelected.verticalLines = getLines;
          pointSelected.verticalLinesCanvasPos = canvasPos;
        }
        if (Object.keys(pointSelected).length) {
          const findXmlData = filterActiveId.confusion.allRecord.find((item: any) => Math.round(+item.id * 100) === Math.round(Number(getLines)))
          let numsHIndex = -1;
          let numsNHIndex = -1;
          const numsH = findXmlData?.opencv_storage?.numsH?.data.replaceAll("\n", "").split(" ").map((item: any) => {
            if (item) {
              numsHIndex++
              return {
                id: numsHIndex, 
                value: Number(item)
              }
            }
          }).filter((item: any) => item !== undefined) || []
          const numsNH = findXmlData?.opencv_storage?.numsNH?.data.replaceAll("\n", "").split(" ").map((item: any) => {
            if (item) {
              numsNHIndex++
              return {
                id: numsNHIndex, 
                value: Number(item)
              }
            }
          }).filter((item: any) => item !== undefined) || []

          setIntensityPointSelectedData({
            ...intensityPointSelectedData,
            ...findXmlData?.opencv_storage,
            numsH,
            numsNH,
            numsLength: numsH.length,
            position: pointSelected
          })
          if (findXmlData) {
            const {numsH: nums_h, numsNH: nums_nh, ...others} = findXmlData?.opencv_storage 
            setMatrixData(others)
          }
        }
      } else if (lineType === 2) {
        const allIdealPoints = filterActiveId?.allIdealPoints?.find((point: any) => point.X === canvasPos && ((point.Y-2) <= getLines && (point.Y+2) >= getLines))
        if (allIdealPoints) {
          
          setAreaPointSelectedData(allIdealPoints.areaPointSelectedData)
          setIntensityPointSelectedData(allIdealPoints.intensityPointSelectedData)
          setAreaGraph(allIdealPoints.areaGraphs)
          setFilesPath(allIdealPoints.filesPath)
          setMatrixData(allIdealPoints.idealConfusion.record)
          setScatterPointLocation({
            ...scatterPointLocation, 
            [filterActiveId.id]: {
              delta: allIdealPoints.X, 
              area: allIdealPoints?.areaPointSelectedData?.verticalLines?.[0] ?? 0
            }
          })
        }

        // console.log(Math.round(filterActiveId.allIdealPoints.find((point: any) => point.X === canvasPos).Y))
      }
    }
    
    const areaOnClick = (lineType: any, canvasPos: any, getLines: any) => {
        setFilesPath({})
        let pointSelected: any = {};
        if (lineType === 0) {
          pointSelected.verticalLines = getLines;
          pointSelected.verticalLinesCanvasPos = canvasPos;
        }
        setAreaPointSelectedData(pointSelected);
    }

    
    
    useEffect(() => {
      if (filterActiveId?.intensityGraphs) {
        setIntensityGraphs(filterActiveId?.intensityGraphs)
      } else {
        const graphs = [
          {
            ...chartTheme.public, 
            ...chartTheme["e8"],
            data: filterActiveId.confusion.chartData["e8"],
          }
        ]
        if (filterActiveId.optimalPoint && Object.keys(filterActiveId.optimalPoint).length) {
          const optimalPoint = {
            ...chartTheme.public, 
            ...chartTheme[`optimal`],
            data: [filterActiveId.optimalPoint.chartData],
          }
          graphs.unshift(optimalPoint)
        }
        setIntensityGraphs(graphs)
      }
      
      if (scatterPointLocation?.[filterActiveId.id]) {
        const idealPointSelected = filterActiveId?.allIdealPoints?.find((ele: any) => ele.X === scatterPointLocation?.[filterActiveId.id]?.delta) 
        setAreaPointSelectedData(idealPointSelected.areaPointSelectedData)
        setIntensityPointSelectedData(idealPointSelected.intensityPointSelectedData)
        setAreaGraph(idealPointSelected.areaGraphs)
        setFilesPath(idealPointSelected.filesPath)
        setMatrixData(idealPointSelected.idealConfusion.record)
      } else if (filterActiveId?.allIdealPoints?.length) {
          const lastPoint = [...filterActiveId?.allIdealPoints].pop()
          setAreaPointSelectedData(lastPoint.areaPointSelectedData)
          setIntensityPointSelectedData(lastPoint.intensityPointSelectedData)
          setAreaGraph(lastPoint.areaGraphs)
          setFilesPath(lastPoint.filesPath)
          setMatrixData(lastPoint.idealConfusion.record)
      } else {
        setAreaPointSelectedData({})
        setIntensityPointSelectedData({})
        setAreaGraph([])
        setFilesPath({})
        setMatrixData({
          e0: "", e1: "", e4: "", e2: "", 
          e3: "", e5: "", e6: "", e7: "", 
          e8: "",
          n0: "", n1: "", n4: "", n2: "", 
          n3: "", n5: "", n6: "", n7: "", 
          n8: "", numsLength: 0
        })
      }

      // برای نمایش آخرین نقطه ایده آل
      // if (filterActiveId?.allIdealPoints?.length) {
      //   const lastPoint = [...filterActiveId?.allIdealPoints].pop()
      //   setAreaPointSelectedData(lastPoint.areaPointSelectedData)
      //   setIntensityPointSelectedData(lastPoint.intensityPointSelectedData)
      //   setAreaGraph(lastPoint.areaGraphs)
      //   setFilesPath(lastPoint.filesPath)
      //   setMatrixData(lastPoint.idealConfusion.record)
      // } else {
      //   setAreaPointSelectedData({})
      //   setIntensityPointSelectedData({})
      //   setAreaGraph([])
      //   setFilesPath({})
      //   setMatrixData({
      //     e0: "", e1: "", e4: "", e2: "", 
      //     e3: "", e5: "", e6: "", e7: "", 
      //     e8: "",
      //     n0: "", n1: "", n4: "", n2: "", 
      //     n3: "", n5: "", n6: "", n7: "", 
      //     n8: "", numsLength: 0
      //   })
      // }

    }, [filterActiveId])

    
    return (
        <div className="w-full flex flex-col items-start justify-center py-3 gap-3 px-2">
            <IntensityChart 
                intensityGraphs={intensityGraphs}
                setIntensityGraphs={setIntensityGraphs}
                intensityPointSelectedData={intensityPointSelectedData}
                chartSize={intensityChartSize}
                steChartSize={steIntensityChartSize}  
                matrixData={matrixData}  
                intensityOnClick={intensityOnClick}  
                lineTypeToDraw={lineTypeToDraw}
                setLineTypeToDraw={setLineTypeToDraw}
            />
            <AreaChart 
                intensityPointSelectedData={intensityPointSelectedData}
                areaPointSelectedData={areaPointSelectedData}
                intensityGraphs={intensityGraphs}
                setIntensityGraphs={setIntensityGraphs}
                areaGraphs={areaGraphs}
                chartSize={areaChartSize}
                steChartSize={steAreaChartSize}
                intensityChartSize={intensityChartSize}
                setAreaGraph={setAreaGraph}
                intensityOnClick={intensityOnClick}
                areaOnClick={areaOnClick} 
                setAreaPointSelectedData={setAreaPointSelectedData}
                setIntensityPointSelectedData={setIntensityPointSelectedData}
                setFilesPath={setFilesPath}
                setMatrixData={setMatrixData}
                setLineTypeToDraw={setLineTypeToDraw}
                {...props}
            />
            <ImagesSwiper filesPath={filePath}/>
        </div>
    )
}

export default SCATTER