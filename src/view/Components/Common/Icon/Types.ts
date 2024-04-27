import { CSSProperties, PropsWithChildren } from "react";
import { SvgsNames } from "./IconName";
import { SvgsColorNames } from "./IconColorName";

interface BasicIconType extends PropsWithChildren<any> {
  // test
  cyIconId?: string;

  // logic
  width?: string | number;
  height?: string | number;
  color?: string;
  classNames?: string;
  style?: CSSProperties;
};

export interface IconType extends BasicIconType {
  name: SvgsNames;
  isCircle?: boolean;
  background?: string;
}

export interface IconColorType extends BasicIconType {
  name: SvgsColorNames;
}

export const IconDefaultProps: IconType | IconColorType = {
  name: "close",
  width: "1.2em",
  height: "1.2em",
  color: "black",
  background: "",
  style: {},
  classNames: "",
  isCircle: false,
};
