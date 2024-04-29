/// <reference types="react-scripts" />

declare namespace api_electron {
  function selectedPath(): any;
  function minimize(): void;
  function quit(): void;
  function getChartData(value: any): void;
  function progress(type: string): void;
  function readConfusion(): void;
  function moveMash2DHVFile(): void;
  function redHists(): void;
  function existAppDataChecker(): void;
  function onDataFromIpcMain(channel:string, func: ()=>void): () => Electron.IpcRenderer;
}

declare module "*.module.css";

declare module "*.module.scss";

declare module "*.scss" {
    const css: { [className: string]: string };
    export default css;
  }
declare module "*.sass" {
  const css: { [className: string]: string };
  export default css;
}
declare interface Error {
  name: string
  message: string
  stack?: string
  code?: number | string
}

declare module "react-markup";
declare module "*.webp";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";

