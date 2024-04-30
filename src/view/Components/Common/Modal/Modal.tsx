import React from "react";

import { ModalType, ModalDefaultProps } from "./Types";

import styles from "./Modal.module.scss";

const Modal = (props: ModalType) => {
  return (
    <div
      id={`overlay_${props.idSuffix}`}
      className={`${styles.overlay} ${
        !props.isOpen ? styles.hide : ""}${
        props.classNames?.overlay ? " " + props.classNames.overlay : ""}`
      }
      style={props.style?.overlay}
      onClick={(e) => {
        const target = e?. target as Element
        if (e && target.id.includes(`overlay_${props.idSuffix}`)) {
          props.onOverlayClick && props.onOverlayClick();
          props.setIsOpen(false);
        }
      }}
    >
      <div
        className={`${styles.bodyContainer}${props.classNames?.bodyContainer ? " " + props.classNames.bodyContainer : ""}`}
        style={props.style?.bodyContainer}
      >
        {props.children}
      </div>
    </div>
  );
};

// Modal.defaultProps = ModalDefaultProps;

export default Modal;
