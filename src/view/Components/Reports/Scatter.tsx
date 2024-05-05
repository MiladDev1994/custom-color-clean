import AreaChart from "../AreaChart/AreaChart"
import IntensityChart from "../IntensityChart/IntensityChart"

const SCATTER = () => {

    return (
        <div className="w-full flex flex-col items-start justify-center p-3 gap-5">
            {/* <div className="w-full h-full bg-white border border-gray-300 rounded-md shadow-xl shadow-gray-300 flex items-start justify-center flex-auto"> */}
                <IntensityChart />
                <AreaChart />
            {/* </div> */}
        </div>
    )
}

export default SCATTER