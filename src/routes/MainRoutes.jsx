import { Route, Routes } from "react-router-dom";
import MainPage from "../pages/home/MainPage";
import MainLayout from "../layouts/MainLayout";

export default function MainRoutes() {


    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<MainPage />} />
            </Route>
        </Routes>
    );
}

