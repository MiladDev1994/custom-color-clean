/// <reference types="react-scripts" />

declare namespace api_electron {
  function selectedPath(): any;
  function minimize(): void;
  function quit(): void;
  function reload(): void;
  function createApp(value: any): void;
  function getChartData(value: any): void;
  function progress(type: string): void;
  function readConfusion(): void;
  function moveMash2DHVFile(): void;
  function redHists(): void;
  function existAppDataChecker(): void;
  function saveAsFile(): Promise<any>;
  function selectFolder(): Promise<any>;
  function saveFilter(path: any): Promise<any>;
  function openFilters(path: any): Promise<any>;
  function completeSorterConfigData(value: any): Promise<any>;
  function addFilter(value: any): void;
  function deleteFilter(id: any): void;
  function calculateAcc(data: any): void;
  function resultGenerator(data: any): void;
  function resultGeneratorProgress(): void;
  function readResultData(id: number): void;
  function randomImage(data: any): void;
  function resultGenerator_conclusion(count?: any): void;
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

