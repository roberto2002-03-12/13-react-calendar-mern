import { useCalendarStore } from "../../hooks";
import { useSelector } from "react-redux";

export const FabDelete = () => {
    const { startDeletingEvent, hasEventSelected, activeEvent } = useCalendarStore();

    const handleDelete = () => {
        startDeletingEvent();
    }

    return (
        <button
            className="btn btn-danger fab-danger"
            onClick={ handleDelete }
            style={{
                display: hasEventSelected && activeEvent.title ? '':'none'
            }}
        >
            <i className="fas fa-trash-alt"></i>
        </button>
    )
}