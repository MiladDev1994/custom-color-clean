import { Toast } from "./Toast";

export const AccuracyLineByStepUtil = (data: any) => {
  const {
    allRecord,
    chartLength,
    chartSize,
    chartValueSelected, // نموداری که نمایش میده
    filters, // مقطه ای که انتخاب شده
    message,
    type,
    verticalLinesValue, // مقطه ای که انتخاب شده
    percent,
    setAccuracyLinesHandler
  } = data

  if (!chartValueSelected.length) return Toast("error", message);

  const filterDataLength = filters.length ? Object.keys(filters[0].data).length : false;
  let newline: any = [0];
  let newPos: any = [0];

  if (filterDataLength) {
    let increase = +verticalLinesValue;
    let decrease = +verticalLinesValue;

    const findRecord = (): any => {
      switch (type) {
        case "default":
          const find = allRecord.find((item: any) => Math.round(item.id * percent) === increase || Math.round(item.id * percent) === decrease)
          if (find) {
            newline = [(find.id * percent)];
            return true
          } else {
            increase++;
            decrease--;
            return findRecord()
          }
        case "plus":
          if (increase <= chartLength - 1) {
            const find = allRecord.find((item: any) => Math.round(item.id * percent) === increase + 1)
            if (find) {
              newline = [(find.id * percent)];
              return true
            } else {
              increase++;
              return findRecord()
            }
          }
          break;
        case "minus":
          if (decrease > 0) {
            const find = allRecord.find((item: any) => Math.round(item.id * percent) === decrease - 1)
            if (find) {
              newline = [(find.id * percent)];
              return true
            } else {
              decrease--;
              return findRecord()
            }
          }
          break;
        default: null;
      }
    }
    const findStatus = findRecord()
    const xLength = newline / (Math.ceil(chartLength * 1.02) - 1);
    const selectedLocation = chartSize.width * xLength;
    newPos = [selectedLocation + chartSize.left];
    // if (findStatus) return {
    //   status: true,
    //   type: 0,
    //   newPos,
    //   newline
    // }
    // else return {
    //   status: false,
    // }

    newline && setAccuracyLinesHandler(0, newPos, newline)
  } else {
    // return {
    //   status: true,
    //   type: 0,
    //   newPos: [chartSize.left],
    //   newline: [0]
    // }
    setAccuracyLinesHandler(0, [chartSize.left], [0])
  }
}

