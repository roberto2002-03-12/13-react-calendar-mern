import { parseISO } from "date-fns";

export const convertEventsToDateEvents = (events = []) => {
    return events.map(event => {
        //tengo fechas guardadas tipo javascript, para evitar conflicto transformo las fechas a date que sea leible
        event.start = parseISO(event.start);
        event.end = parseISO(event.end);

        return event;
    });
};