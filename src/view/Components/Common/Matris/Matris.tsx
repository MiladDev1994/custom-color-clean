import React, { useEffect } from 'react';
import styles from "./Matris.module.scss"
import Icon from '../Icon/Icon';
import { Structure } from './matrixStructure';
import Button from '../Button/Button';
import { IsModalOpenState } from '../../../recoils/GlobalRecoil';
import { ModalTypeState } from '../../../recoils/GlobalRecoil';
import { useRecoilState } from 'recoil';

function Matris({
    data, 
    onClick,
    charts,
    pointSelected,
    name,
}: any) {


    const [isModalOpen, setIsModalOpen] = useRecoilState(IsModalOpenState);
    const [modalType, setModalType] = useRecoilState(ModalTypeState);

    const findNanValue = () => {
        if (!Object.keys(pointSelected).length) return
        const matrixItem = ["e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8"]
        matrixItem.forEach((value: string) => {
            // console.log(value)
            if(isNaN(pointSelected?.[value])) {
                setIsModalOpen(true)
                setModalType("MatrixNan")
                return;
            }
        })

    }


    useEffect(findNanValue, [pointSelected])

    return (
        
        <div className={`w-full h-full flex flex-col items-center justify-start`}>
            {name && <h3 className='flex-none'>{name}</h3>}

            <div className='w-full flex flex-auto flex-col ps-6'>
                <div className='w-full h-8 flex text-xs xl:text-sm opacity-70'>
                    <div className='flex-auto flex gap-2'>
                        <span className='w-1/3 flex-auto'/>
                        <span className='w-1/3 flex-auto flex items-center justify-center'>
                            خروجی ردشده
                            <Icon
                                name='arrow-down'
                                width="1.3rem"
                                height="1.3rem"
                                color="black"
                            />                      
                        </span>
                        <span className='w-1/3 flex-auto flex items-center justify-center'>
                            خروجی مقبول
                            <Icon
                                name='arrow-down'
                                width="1.3rem"
                                height="1.3rem"
                                color="black"
                            />
                        </span>
                    </div>
                    <span className='w-8 flex-none'/>
                </div>
                <div className='flex items-stretch flex-auto'>
                    <div className={`${styles.matrix} flex-auto rounded-md gap-2 grid grid-cols-3 grid-rows-3`}>
                        {Structure.map((item: any) => 
                            <div 
                                key={item.type} 
                                className={`
                                    ${item.style} 
                                    !h-full flex items-center justify-center flex-col rounded-md shadow-lg shadow-gray-300 relative transition-all duration-300 group
                                `} 
                                onClick={onClick ? () => onClick(item.nickname, item.type) : console.warn}
                            >
                                <div className={`items-center justify-start absolute hidden group-hover:flex transition-all duration-300 -bottom-1 right-0 z-50 hover:hidden`}>
                                    <div className='relative'>
                                        <div className={`${item.calculate.style} w-5 absolute aspect-square rotate-45 rounded-sm right-3 -top-1 z-10`} />
                                        <div className={`${item.calculate.style} w-5 absolute aspect-square rotate-45 rounded-sm right-3 -top-1 ring-1 z-0`} />
                                        <div className={`${item.calculate.style} absolute ring-1 rounded-md shadow-lg shadow-[#0000003b] text-xs px-3 font-bold`}>
                                            <div className={`h-1/2 border-b-2 ${item.type === "e8" ? "border-gray-100" : "border-gray-500"} whitespace-nowrap mt-1 py-3 text-center`}>{item.calculate.numerator}</div>
                                            <div className='h-1/2 whitespace-nowrap py-3 text-center'>{item.calculate.denominator}</div>
                                        </div>
                                    </div>
                                </div>
                            
                                <div 
                                    className={`w-full h-full flex items-center justify-between flex-col cursor-pointer text-sm`}
                                >
                                    <h5
                                        className={`w-full h-14 flex-none flex items-center justify-center py-2 px-1 text-center`}
                                    >{item.description}</h5>

                                    <div className=' flex-auto flex items-center justify-between w-full px-3 opacity-100'>
                                        <span className='text-xs xl:text-sm'>درصد : </span>
                                        <h2 className='flex items-center justify-center text-xs xl:text-lg font-bold opacity-70'>{
                                            !String(pointSelected[item.type]) ? "---" :
                                            // `${((1-pointSelected[item.type]) * 100)?.toFixed(0)}%`
                                            `${((pointSelected[item.type]) * 100)?.toFixed(0)}%`
                                        }</h2>
                                    </div>
                                    {item.countKey && 
                                        <div className=' flex-auto flex items-center justify-between w-full px-3'>
                                            <span className='text-xs xl:text-sm'>تعداد : </span>
                                            <h2 className='flex items-center justify-center text-xs xl:text-lg font-bold opacity-70'>{
                                                !String(pointSelected[item.countKey]) ? "---" :
                                                `${(+(pointSelected[item.countKey]))}`
                                            }</h2>
                                        </div>
                                    }

                                    {onClick &&
                                        <div className='w-full h-8 flex-none'>
                                            {onClick &&
                                                <Icon
                                                    width="2rem"
                                                    height="2rem"
                                                    name={charts.find((ele: any) => ele.label.replaceAll(" ", "") === item.nickname) ? "check2" : "x"}
                                                    classNames={`${styles[item.icon_style]} rounded-full p-0 absolute opacity-50 right-0 bottom-0 !bg-transparent hover:bg-transparent !border-none`}
                                                />
                                            }
                                        </div>
                                    }

                                </div>
                            </div>
                        )}

                    </div>
                    <div className='w-8 flex -rotate-180 [writing-mode:vertical-lr] opacity-70 text-xs xl:text-sm'>
                        <span className='h-1/3 flex-auto flex items-center justify-center'>
                            بار خوب
                            <Icon
                                name='arrow-left'
                                width="1.3rem"
                                height="1.3rem"
                                color="black"
                            />
                        </span>
                        <span className='h-1/3 flex-auto flex items-center justify-center'>
                            بار بد
                            <Icon
                                name='arrow-left'
                                width="1.3rem"
                                height="1.3rem"
                                color="black"
                            />
                        </span>
                        <div className='h-1/3 flex-auto flex items-center justify-center' />
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Matris;