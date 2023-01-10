import { useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { NavBar } from "../components/NavBar";
import { localizer } from '../helpers/calendarLocalizer';
import { getMessagesEs } from '../helpers/getMessages';
import { CalendarEvent } from '../components/CalendarEvent';
import { CalendarModal } from '../components/CalendarModal';
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks';
import { FabAddNew } from '../components/FabAddNew';
import { FabDelete } from '../components/FabDelete';
import { useEffect } from 'react';

export const CalendarPages = () => {
  const { user } = useAuthStore();
  const { openDateModal } = useUiStore();
  const { events, setActiveEvent, activeEvent, startLoadingEvents } = useCalendarStore();
  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');

  //event: obtiene los valores de events, establecido anteriormente
  //start: fecha actual o que inicia según la selección del usuario
  //end: hora que termina
  //isSelected: boleano que sirve para saber si esta seleccionado o no
  const eventStyleGetter = (event, start, end, isSelected) => {
    //esto va servir para cambiar de color según el usuario
    const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid)
    
    const style = {
      backgroundColor: isMyEvent ? '#347CF7' : '#465660',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
    }

    return {
      style
    }
  };

  const onDoubleClick = (event) => {
    //console.log({doubleClick: event});
    openDateModal();
  };

  const onSelect = (event) => {
    setActiveEvent(event);
  };

  const onViewChanged = (event) => {
    localStorage.setItem('lastView', event);
    setLastView(event);
  }

  useEffect(() => {
    startLoadingEvents();
  }, [])
  

  return (
    <>
      <NavBar />

      <Calendar
        culture='es'
        localizer={ localizer }
        events={ events }
        defaultView={ lastView }
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 80px)' }}
        messages={ getMessagesEs() }
        eventPropGetter={ eventStyleGetter }
        components={{
          event: CalendarEvent //pasar propiedades al componente CalendarEvent
        }}
        onDoubleClickEvent={ onDoubleClick } //darle doble click abrir un componente
        onSelectEvent={ onSelect } //muestra el evento seleccionado con un click
        onView={ onViewChanged } //ve el tipo de vista que es semana, día, mes, agenda
        //se va utilizar esto para guardar el tipo de vista cuando el usuario le da a refresh
      />

      <CalendarModal />
      <FabAddNew />
      <FabDelete />
    </>

  )
}
