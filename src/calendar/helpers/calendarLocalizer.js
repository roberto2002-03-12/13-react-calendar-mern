import { dateFnsLocalizer } from 'react-big-calendar';
import { getDay, startOfWeek, parse, format} from 'date-fns';
import esES from 'date-fns/locale/es';

//seleccionar horario
const locales = {
    'es': esES,
};

//establecer el modelo para el calendar
export const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});