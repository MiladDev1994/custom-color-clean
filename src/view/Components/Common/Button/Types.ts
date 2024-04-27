import { CSSProperties } from "react";
import { SvgsNames } from "../Icon/IconName";

const btnShape = [
  "pill",
  "round",
  "square",
] as const;

export type BtnShape = typeof btnShape[number];

export type StylePropertiesType = {
  "--color": string;
  "--hover": string;
  "--title": string;
  "--titleHover"?: string;
  "--circle"?: string;
  "--circleHover"?: string;
  "--circleIconColor"?: string;
  "--borderColor": string;
  "--circleIconHover"?: string;
  "--icon": string;
  "--iconHover"?: string;
  "--borderSize"?: string;
}


type ThemeTypes<T> = {
  primary: T;
  // whitePrimary: T;
  // lightPrimary: T;
  
  secondary: T;

  // warning: T;
  // whiteWarning: T;
  // lightWarning: T;

  tertiary: T;
  // whiteTertiary: T;
  // lightTertiary: T;

  success: T;
  // whiteSuccess: T;
  // lightSuccess: T;

  danger: T;
  // whiteDanger: T;
  // lightDanger: T;

  gray: T;
  // info: T;

  // blackWhite: T;
  // dark: T;
  // light: T;
}

export type BtnColor = keyof ThemeTypes<string>;

const btnExpand = [
  "block" ,
  "full",
  "default",
  "equilateral",
] as const;

const btnDirection = [
  "column",
  "row",
  "column_reverse",
  "row_reverse",
] as const;

export type BtnExpand = typeof btnExpand[number];

type BtnDirection = typeof btnDirection[number];

export type FillTypes = {
  disable: StylePropertiesType;
  outline: ThemeTypes<StylePropertiesType>;
  info: ThemeTypes<StylePropertiesType>;
  light: ThemeTypes<StylePropertiesType>;
  basic: ThemeTypes<StylePropertiesType>;
  transparent: ThemeTypes<StylePropertiesType>;
}

export type BtnFill = keyof Omit<FillTypes, "disable">;


export type ButtonType = {
  // test
  cyBtnId?: string;
  cyIconId?: string;

  // logic
  title?: React.ReactNode;
  fill: BtnFill;
  shape?: BtnShape;
  color: BtnColor;
  icon?: SvgsNames;
  expand?: BtnExpand;
  iconWidth: string | number;
  iconHeight: string | number;
  centered?: boolean;
  isIconCircle?: boolean;
  iconColor?: string;
  iconBackground?: string;
  iconRotate?: string | number;
  type?: "submit" | "reset" | "button";
  classNames?: {
    container?: string;
    icon?: string;
    section?: string;
  };
  style?: {
    container?: CSSProperties;
    icon?: CSSProperties
  };
  onClick?: (args?: any) => void;

  disabled?: boolean;
  outlineColor?: string;
  outLineSize?: string;
  direction?: BtnDirection;
  titleColor?: string;
  titleHover?: string;
  iconHover?: string;
  isBadge?: boolean;
  loading?: boolean;
};

export const ButtonDefaultProps: ButtonType = {
  isBadge: false,
  disabled: false,
  color: "primary",
  iconWidth: "1.5rem",
  iconHeight: "1.5rem",
  isIconCircle: false,
  fill: "basic",
  // shape: "round",
  // expand: "default",
  // direction: "row",
  // loading: false,
};
