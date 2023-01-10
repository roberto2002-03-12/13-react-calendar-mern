import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from '../api';
import { onChecking, onLoggin, onLogout, clearErrorMessage, onLogoutCalendar } from "../store";

//esto deberia estar en la carpeta de auth
export const useAuthStore = () => {
    const { status, user, errorMessage } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const startLogin = async({email, password}) => {
        dispatch(onChecking());
        try {
            const { data } = await calendarApi.post('/auth', { email, password });
            //console.log({resp});
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(onLoggin({ name: data.name, uid: data.uid }));
        } 
        catch (error) {
            dispatch(onLogout('credenciales incorrectas'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        };
    };
    
    const startRegister = async({name, email, password}) => {
        dispatch(onChecking());
        try {
            const { data } = await calendarApi.post('/auth/new', { name, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(onLoggin({ name: data.name, uid: data.uid }));
        }
        catch (error) {
            dispatch(onLogout(error.response.data?.msg || '--'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        };
    };

    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if (!token) return dispatch(onLogout());

        try {
            const { data } = await calendarApi.get('/auth/renew');
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(onLoggin({ name: data.name, uid: data.uid }));
        }
        catch (error) {
            localStorage.clear();
            dispatch(onLogout());
        }
    };

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogoutCalendar());
        dispatch(onLogout());
    };

    return {
        //propiedades
        errorMessage,
        status,
        user,
        //metodos
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout,
    }
};