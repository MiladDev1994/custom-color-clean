
import React from "react";
import { Route, Routes } from "react-router-dom";
import CreateApp from "./Pages/CreateApp/CreateApp";

const AppRoutes = () => {

    return (
        <Routes>
            <Route path="/" element={<CreateApp />} />
        </Routes>
    )
}

export default AppRoutes;