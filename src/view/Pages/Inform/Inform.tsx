import { useRecoilState } from "recoil"
import { AppDataState } from "../../recoils/GlobalRecoil"
import { Link } from "react-router-dom"



export default function Inform() {
    
    const [appData, setAppData] = useRecoilState(AppDataState)
    // console.log(appData)

    return (
        <div className="w-screen">

            <Link to={"/"}>back</Link>

        </div>
    )
}
