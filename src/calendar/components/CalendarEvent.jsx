import { memo } from 'react';

//estoy memorizando este componente porque se va re-renderizar 
//incluso cuando no se haya hecho ningun cambio en props

export const CalendarEvent = memo(({ event }) => {
    const { title, user } = event;
    
    return (
        <>
            <strong>{ title } </strong>
            <span>- { user?.name }</span>
        </>
    );
})
