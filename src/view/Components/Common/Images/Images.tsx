import { useState } from "react";
import { useRecoilState } from "recoil";
import { ImageActiveState } from "../../../recoils/GlobalRecoil";
import { ModalTypeState } from "../../../recoils/GlobalRecoil";
import { IsModalOpenState } from "../../../recoils/GlobalRecoil";

const Image = ({image, type}: any) => {

    const [isModalOpen, setIsModalOpen] = useRecoilState(IsModalOpenState);
    const [modalType, setModalType] = useRecoilState(ModalTypeState);
    const [imageActive, setImageActive] = useRecoilState(ImageActiveState)
    const [size, setSize] = useState({
        width: 0,
        height: 0,
    })

    const imageLoadHandler = (e: any) => {
        setSize({
            width: e.target.naturalWidth,
            height: e.target.naturalHeight,
        })
    }

    const showImageHandler = () => {
        setIsModalOpen(true)
        setModalType("ShowImage")
        const imageDetails = {
            ...image,
            type
        }
        setImageActive(imageDetails)
    }

    
    return (
        <div 
            className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded-md overflow-hidden cursor-pointer"
            onClick={showImageHandler}
        >
            <img 
                src={`data:image/jpeg;base64,${image.image}`} 
                style={{
                    width: size.width >= size.height ? "100%" : "unset",
                    height: size.width <= size.height ? "100%" : "unset"
                }}
                onLoad={imageLoadHandler}
                className="hover:brightness-150 transition-all duration-200"
            />
        </div>
    )
}


export default Image