import { useEffect } from "react";

export const UseOnDataFromIpcMain = (channel, listener, deps=[]) => {
    useEffect(() => {
      if (listener) {
        const removeListener = api_electron.onDataFromIpcMain(
            channel, listener);
        return () => {
          if (removeListener) removeListener();
        };
      }
    }, [deps]);
  };