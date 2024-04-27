
import styles from "./ProgressBtn.module.scss"

const ProgressBar = ({onSubmit, progress}: any) => {

    return (
        <div 
            onClick={onSubmit}
            className={`col-span-full flex justify-end w-full h-12 rounded-md overflow-hidden relative ${progress < 100 ? "bg-gray-300 shadow-inner shadow-gray-400" : "bg-sky-500 hover:bg-sky-600 transition-all duration-200 mt-5 cursor-pointer"}`} 
        >
            <span className={`w-full h-full flex items-center justify-center absolute text-xl text-white drop-shadow-md shadow-gray-500 ${progress < 100 ? "" : "z-[1]"}`}>{progress < 100 ? `%${progress}` : " ایجاد برنامه"}</span>
            <div 
                className={`h-full relative overflow-hidden transition-all duration-300 bg-sky-500 ${progress < 100 ? styles.progress : ""}`} 
                style={{width: `${progress}%`}} 
            />
        </div>
    )
}

export default ProgressBar;