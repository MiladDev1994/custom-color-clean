
import styles from "./ProgressBtn.module.scss"

const ProgressBar = ({onSubmit, progress, title}: any) => {

    return (
        <div 
            onClick={onSubmit}
            className={`col-span-full flex justify-end w-full h-12 rounded-md overflow-hidden relative mt-5 ${progress < 100 ? "bg-gray-300 shadow-inner shadow-gray-400" : "bg-sky-500 hover:bg-sky-600 transition-all duration-200 cursor-pointer"}`} 
        >
            <div 
                className={`h-full relative overflow-hidden transition-all duration-300 bg-sky-500 ${progress < 100 ? styles.progress : ""}`} 
                style={{width: `${progress}%`}} 
            />
            <span className={`w-full h-full flex items-center justify-center absolute text-xl text-white drop-shadow-md shadow-gray-500`}>{progress < 100 ? `%${progress}` : title}</span>
        </div>
    )
}

export default ProgressBar;