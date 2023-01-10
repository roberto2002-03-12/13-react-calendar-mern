import { createSlice } from '@reduxjs/toolkit';
/*
import { addHours } from 'date-fns';

const tempEvent = {
    _id: new Date().getTime(),
    title: 'Cumpleaños',
    notes: 'Comprar pastel',
    start: new Date(),
    end: addHours(new Date(), 2),
    bgColor: '#fafafa',
    user: {
      _id: '123',
      name: 'roberto'
    }
};
*/

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        isLoadingEvents: true,
        events: [
            
        ],
        activeEvent: null,
    },
    reducers: {
        onSetActiveEvent: (state, { payload }) => {
            //al darle click a un evento me pasa el los datos acerca de ese vento
            //por lo tanto de esos datos lo selecciono como activo
            state.activeEvent = payload;
        },
        onAddNewEvent: (state, {payload}) => {
            state.events.push(payload);
            //al hacer submit el modal se cierra, por lo tanto se debe establecer
            //la nota activa como null
            state.activeEvent = null;
        },
        onUpdateEvent: (state, {payload}) => {
            state.events = state.events.map(event => {
                //map es como un loop
                //va repasar entre todos sus elementos para comprobar esta condicional
                //si cumple entonces cambia ese especifico elemento
                if (event.id === payload.id) {
                    //el return hace que el loop termine
                    return payload;
                }
                //si no hay nada entonces mantenerlo como ha estado
                return event;
            });
        },
        onDeleteEvent: (state) => {
            if (state.activeEvent) {
                state.events = state.events.filter(event => event.id !== state.activeEvent.id);
                state.activeEvent = null;
            }
        },
        onLoadEvents: (state, { payload = [] }) => {
            state.isLoadingEvents = false;
            //state.events = payload;
            //esto sirve para mostrar los eventos nuevos y así no cambiar
            //los ya creados
            payload.forEach(event => {
                //recomiendo agregar un filtro para agregar los eventos actualizados
                const exists = state.events.some(dbEvent => dbEvent.id === event.id);
                if (!exists) {
                    state.events.push(event);
                }
            });
        },
        onLogoutCalendar: (state) => {
            state.isLoadingEvents = true;
            state.events = [];
            state.activeEvent = null;
        }
    }
});


// Action creators are generated for each case reducer function
export const { onSetActiveEvent, onAddNewEvent, onUpdateEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar } = calendarSlice.actions;