import { createRoot } from 'react-dom/client';
import {HashRouter} from "react-router-dom"
import AppRoutes from './app.routes';
import { RecoilRoot } from 'recoil';
import { Toaster } from "react-hot-toast";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <HashRouter>
      <RecoilRoot>
        <AppRoutes />
      </RecoilRoot>
      <Toaster position='bottom-left'/>
    </HashRouter>
);