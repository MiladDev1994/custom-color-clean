import AreaChart from "../AreaChart/AreaChart"
import ImagesSwiper from "../Common/ImagesSwiper/ImagesSwiper"
import IntensityChart from "../IntensityChart/IntensityChart"

const SCATTER = () => {

    return (
        <div className="w-full flex flex-col items-start justify-center py-3 gap-3 px-2">
            <IntensityChart />
            <AreaChart />
            <ImagesSwiper />
        </div>
    )
}

export default SCATTER