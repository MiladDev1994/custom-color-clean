// const setAccuracyLinesHandler = (lineType: any, canvasPos: any, getLines: any) => {
//     setFilesPath({})
//     setFiltersArea([])
//     // console.log(lineType, canvasPos, getLines)
//     const lines = getLines.join("") >= filterActiveId.confusion.chartData ? [filterActiveId.confusion.chartData] : getLines
//     let tempFilter = { ...filtersIntensity?.[activeIndex] };
//     tempFilter.data = { ...tempFilter.data };
//     if (lineType === 0) {
//       tempFilter.data.verticalLines = lines;
//       tempFilter.data.verticalLinesCanvasPos = canvasPos;
//     } else if (lineType === 1) {
//       tempFilter.data.extendedLines = [];
//       tempFilter.data.extendedLinesCanvasPos = [];
//       tempFilter.data.horizontalLine = lines;
//       tempFilter.data.horizontalLineCanvasPos = canvasPos;
//     } else if (lineType === 2) {
//       tempFilter.data.horizontalLine = undefined;
//       tempFilter.data.horizontalLineCanvasPos = undefined;
//       if (
//         tempFilter?.data?.extendedLines === undefined ||
//         tempFilter.data.extendedLines?.length >= 1
//       ) {
//         tempFilter.data.extendedLines = [];
//         tempFilter.data.extendedLinesCanvasPos = [];
//       } else {
//         tempFilter.data.extendedLines = [
//           ...tempFilter.data.extendedLines,
//         ];
//         tempFilter.data.extendedLinesCanvasPos = [
//           ...tempFilter.data.extendedLinesCanvasPos,
//         ];
//       }
//       tempFilter.data.extendedLines.push(lines);
//       tempFilter.data.extendedLinesCanvasPos.push(canvasPos);
//     } else if (lineType === 3) {
//       tempFilter.data.horizontalLine = undefined;
//       tempFilter.data.horizontalLineCanvasPos = undefined;
//       tempFilter.data.extendedLines = lines;
//       tempFilter.data.extendedLinesCanvasPos = canvasPos;
//     }
//     let tempFilters = [...filtersIntensity];
//     tempFilters[activeIndex] = tempFilter;
//     if (tempFilters.length) {
//       const findXmlData = filterActiveId.confusion.allRecord.find((item: any) => Math.round(+item.id * 100) === Math.round(Number(lines)))

//       let numsHIndex = -1;
//       let numsNHIndex = -1;
//       const numsH = findXmlData?.opencv_storage?.numsH?.data.replaceAll("\n", "").split(" ").map((item: any) => {
//         if (item) {
//           numsHIndex++
//           return {
//             id: numsHIndex, 
//             value: Number(item)
//           }
//         }
//       }).filter((item: any) => item !== undefined) || []
//       const numsNH = findXmlData?.opencv_storage?.numsNH?.data.replaceAll("\n", "").split(" ").map((item: any) => {
//         if (item) {
//           numsNHIndex++
//           return {
//             id: numsNHIndex, 
//             value: Number(item)
//           }
//         }
//       }).filter((item: any) => item !== undefined) || []

//       setPointSelectedData({
//         ...pointSelectedData,
//         ...findXmlData?.opencv_storage,
//         numsH,
//         numsNH,
//         numsLength: numsH.length
//       })

//     }
//     setFiltersIntensity(tempFilters);
//     setChartUpdateCount(chartUpdateCount + 1);
//   }