import Button from "../Button/Button";


export function NewOrOpen({disableSave, handleSaveFile, setIsModalOpen, setFileType}: any) {

    return (
        <div className={"w-[800px] text-center p-2"}>
            <div className={`w-full text-lg before:content-["اخطار:"] before:text-red-400 before:mx-1`}>
                قبل از باز کردن برنامه جدید، وضعیت برنامه فعلی را مشخص کنید 
            </div>
            <div className={"flex items-center justify-around mt-10 gap-2"}>
                
                <Button
                    title="ذخیره کردن"
                    // icon='box-arrow-in-down'
                    expand='block'
                    fill='info'
                    color='gray'
                    shape="round"
                    iconWidth="1.6rem"
                    iconHeight="1.6rem"
                    outlineColor="lightgray"
                    classNames={{
                        container: "!h-12 !w-[25%] !flex !items-center !justify-center !rounded-md duration-200",
                        section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                    }}
                    onClick={() => !disableSave && handleSaveFile("save")}
                />
                <Button
                    title="ذخیره کردن با نام جدید"
                    expand='block'
                    fill='info'
                    color='gray'
                    shape="round"
                    iconWidth="1.6rem"
                    iconHeight="1.6rem"
                    outlineColor="lightgray"
                    classNames={{
                        container: "!h-12 !w-[25%] !flex !items-center !justify-center !rounded-md duration-200",
                        section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                    }}
                    onClick={() => !disableSave && handleSaveFile("saveAs")}
                />
                <Button
                    title="ذخیره نشود"
                    expand='block'
                    fill='info'
                    color='gray'
                    shape="round"
                    iconWidth="1.6rem"
                    iconHeight="1.6rem"
                    outlineColor="lightgray"
                    classNames={{
                        container: "!h-12 !w-[25%] !flex !items-center !justify-center !rounded-md duration-200",
                        section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                    }}
                    onClick={() => handleSaveFile()}
                />
                <Button
                    title="انصراف"
                    expand='block'
                    fill='info'
                    color='gray'
                    shape="round"
                    iconWidth="1.6rem"
                    iconHeight="1.6rem"
                    outlineColor="lightgray"
                    classNames={{
                        container: "!h-12 !w-[25%] !flex !items-center !justify-center !rounded-md duration-200",
                        section: "!text-sm !overflow-hidden !flex !items-center !justify-center"
                    }}
                    onClick={() => {
                        setIsModalOpen(false);
                        setFileType("");
                    }}
                />
            </div>
        </div>
        
    )
}




export function AddFilter() {
    return (
        <h1>AddFilter</h1>
    )
}