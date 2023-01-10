import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from '../auth/pages/LoginPage';
import { CalendarPages } from '../calendar/pages/CalendarPages';
import { useAuthStore } from "../hooks";

export const AppRouter = () => {
    const { status, checkAuthToken } = useAuthStore();
    //const authStatus = 'not-authenticated';

    useEffect(() => {
        checkAuthToken();
    },[]);

    if (status === 'checking') {
        return (
            <h3>Cargando...</h3>
        )
    }
      
    return (
    //crear rutas
    <Routes>
        {
            (
                status === 'not-authenticated'
                ? (
                    <>
                        <Route path="/auth/*" element={ <LoginPage/> }/>
                        <Route path="/*" element={ <Navigate to="/auth/login"/> } />
                    </>
                )
                : (
                    <>
                        <Route path="/" element={ <CalendarPages/> }/>
                        <Route path="/*" element={ <Navigate to="/"/> } />
                    </>
                )
            )
        }
        {/*ruta aprueba de fallos*/}
        <Route path="/*" element={ <Navigate to="/auth/login"/> } />
    </Routes>
    )
}
