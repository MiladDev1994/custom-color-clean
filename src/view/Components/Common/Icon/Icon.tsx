import React, { CSSProperties } from "react";

import { IconType, IconDefaultProps } from "./Types";

import styles from "./Icon.module.scss";

const reqSvgs = require.context("../../../../../assets/icons", true, /\.svg$/);

export const svgs = reqSvgs.keys().reduce((images: any, path: any) => {
  images[path.replace("./", "").replace(".svg", "")] = reqSvgs(path);
  return images;
}, {});

const Icon = (props: IconType) => {
  return (
    <div
      cy-id={props.cyIconId}

      style={{
        width: props.width,
        height: props.height,
        "--mask-color": props.color,
        "--mask-background": props.background,
        "--mask-src": "url(" + svgs[props.name] + ")",
        "--mask-rotate": `${props.rotate}deg`,
        ...props.styles,
      } as CSSProperties}
      className={`${styles.iconContainer}${
        props.isCircle ? " " + styles.circle : ""}${
        props.classNames ? " " + props.classNames : ""}`
      }
    />
  );
};

// Icon.defaultProps = IconDefaultProps;

export default Icon;
