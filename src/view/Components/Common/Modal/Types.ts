import { CSSProperties, PropsWithChildren } from "react";

export interface ModalType extends PropsWithChildren<any>{
  idSuffix?: String;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onOverlayClick?: () => void;
  classNames?: {
    overlay?: string;
    bodyContainer?: string;
  }
  style?: {
    overlay?: CSSProperties;
    bodyContainer?: CSSProperties;
  }
  children?: JSX.Element | JSX.Element[];
};

export const ModalDefaultProps = {
  idSuffix: "",
  onOverlayClick: console.log,
};
