import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';

const { VITE_API_URL } = getEnvVariables();

const calendarApi = axios.create({
    baseURL: VITE_API_URL
});

//ToDo configurar interceptores
/* 
esto sirve para que al realizar una petición con la api intercepte,
puede interceptar en varias partes de un request en este caso solo
va ser en los headers que es donde te pide el token, si no hay token
en los headers pues no va dejar realizar ninguna acción.
*/
calendarApi.interceptors.request.use(config => {
    config.headers = {
        //puede que haya unos headers custom que se desee mantener
        //con esto lo esparcimos con los mismos valores que estaban
        ...config.headers,
        'x-token': localStorage.getItem('token')
    };

    return config;
});

export default calendarApi;