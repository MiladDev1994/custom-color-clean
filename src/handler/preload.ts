// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("api_electron", {
    selectedPath: () => ipcRenderer.invoke('dialog:selectedPath'),
    minimize: () => ipcRenderer.invoke('minimize'),
    quit: () => ipcRenderer.invoke('quit'),
    getChartData: (value: any) => {ipcRenderer.send("getChartData", value)},
    progress: (type: string) => {ipcRenderer.send("progress", type)},
    readConfusion: () => {ipcRenderer.send('readConfusion')},
    redHists: () => {ipcRenderer.send('redHists')},
    moveMash2DHVFile: () => {ipcRenderer.send("moveMash2DHVFile")},
    existAppDataChecker: () => {ipcRenderer.send("existAppDataChecker")},
    saveAsFile: () => ipcRenderer.invoke('dialog:saveAsFile'),
    selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),
    saveFile: (directoryPath: any, filters: any, configs: any) => ipcRenderer.invoke('dialog:saveFile', directoryPath, filters, configs),
    addFilter: (value: any) => ipcRenderer.send('addFilter', value),
    deleteFilter: (id: any) => ipcRenderer.send('deleteFilter', id),
    readIdealPoint(data: any) {ipcRenderer.send("readIdealPoint", data)},
    completeSorterConfigData(productType: any) {ipcRenderer.send('completeSorterConfigData', productType);},
    // walk: (data: {directory: string}) => {ipcRenderer.send('walk', data)},
    // getData: (data: {id: number, type: "first" | "next" | "previous"}) => {ipcRenderer.send('getData', data)},
    // first: (id?: any) => {ipcRenderer.send('first', id)},
    // next: (id?: any) => {ipcRenderer.send('next', id)},
    // previous: (id?: any) => {ipcRenderer.send('previous', id)},
    // count: () => {ipcRenderer.send("count")},
    // filter: (filter: any) => {ipcRenderer.send("filter", filter)},
    // xmlKeyCreate: (key: string) => {ipcRenderer.send("xmlKeyCreate", key)},
    // xmlKeyRead: (type: "all" | "active") => {ipcRenderer.send("xmlKeyRead", type)},
    // xmlKeyUpdate: (id: number) => {ipcRenderer.send("xmlKeyUpdate", id)},
    // xmlKeyUpdateAll: (status: boolean) => {ipcRenderer.send("xmlKeyUpdateAll", status)},
    // xmlKeyDelete: (id: number) => {ipcRenderer.send("xmlKeyDelete", id)},
    // renameExe: (data: any) => {ipcRenderer.send("renameExe", data)},
    // selectedDir: () => ipcRenderer.invoke('dialog:selectedDir'),
    
    onDataFromIpcMain: (channel:string, func: ()=>void) => {
        ipcRenderer.on(channel, func);
        return () => ipcRenderer.removeListener(channel, func);
    },
})