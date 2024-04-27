const Input = ({name, label, value, onBlur, error, focus, onChange}: any) => {

    return (
        <div className={`w-full relative`}>
            <label className='after:content-["*"] after:text-red-400 block p-1 text-sm'>{label}</label>
            <input 
                name={name}
                value={value}
                onChange={onChange}
                onBlur={() => onBlur({...focus, [name]: true})}
                placeholder={`${label} را وارد کنید`}
                className='w-full p-2 border border-gray-300 rounded-md overflow-hidden flex items-center outline-none font-bold bg-gray-100 text-md placeholder:text-gray-400 placeholder:text-sm placeholder:font-thin'
            />
            {(error && focus) && <span className='absolute text-red-400 text-xs left-1 -bottom-4'>{error}</span>}
        </div>
    )
}

export default Input