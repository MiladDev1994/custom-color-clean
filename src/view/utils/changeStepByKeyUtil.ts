
import { AccuracyLineByStepUtil } from "./LineByStepUtils";

export const changeStepByKeyUtil = (e: any, stepData: any) => {
    if (e.code === "ArrowRight") {
      AccuracyLineByStepUtil({...stepData, type: "plus"})
    } else if (e.code === "ArrowLeft") {
      AccuracyLineByStepUtil({...stepData, type: "minus"})
    }
}