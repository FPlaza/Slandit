import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "../../pages/Home";
import Login from "../../pages/Login";;

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route
                path="/home"
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
}
