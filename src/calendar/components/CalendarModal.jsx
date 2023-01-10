import { useMemo, useState, useEffect } from 'react';
import { useCalendarStore } from '../../hooks';
import { addHours, differenceInSeconds } from 'date-fns';
import { useUiStore } from '../../hooks';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/modal/modal-style.css';

registerLocale('es', es);

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};
//te pide el id del html padre, la cual es root
//esto hará que ponga primero a los demás componentes
Modal.setAppElement('#root');
export const CalendarModal = () => {
    const { isDateModalOpen, closeDateModal } = useUiStore();
    const { activeEvent, startSavingEvent } = useCalendarStore();

    const [isOpen, setIsOpen] = useState(true);
    //esto sirve para saber si se esta subiendo algo al formulario
    const [formSubmited, setFormSubmited] = useState(false);

    const [formValues, setFormValues] = useState({
        title: 'Emilio',
        notes: 'Contreras',
        start: new Date(),
        end: addHours(new Date(), 2),
    });

    //vamos a memorizar el valor
    const titleClass = useMemo(() => {
        //cuando esta en false es porque no se ha subido nada, cuando esta en true si ha lanzado submit
        if(!formSubmited) return '';
        //is-invalid se va guardar al menos que el titulo cambie
        return (formValues.title.length) ? '' : 'is-invalid'
    }, [formValues.title, formSubmited])

    //esta función siempre se va lanzar cuando se cambie de nota activa
    useEffect(() => {
        if (activeEvent !== null) {
            setFormValues({...activeEvent});
        }
    }, [activeEvent])
    

    const onInputChange = ({target}) => {
        setFormValues({
            ...formValues,
            //recordemos que en el target muestra el name del input
            [target.name]: target.value,
        });
    }

    const onDateChange = (event, changing) => {
        setFormValues({
            ...formValues,
            //en este caso no hay target value, pero el event solo viene  aser una fecha
            [changing]: event
        });
    }

    const onCloseModal = () => {
        closeDateModal();
    }

    const onSubmit = async (event) => {
        //evitar que refresquee la página al hacer submit
        event.preventDefault();
        setFormSubmited(true);

        const difference = differenceInSeconds(formValues.end, formValues.start);
        
        //si difference es isNan mostrar error, también si la fecha esta mal colocada
        if (isNaN(difference) || difference <= 0) {
            //mostrar mensaje de error
            Swal.fire('Fechas incorrectas','Revisar las fechas','error');
            return;
        }

        if (formValues.title.length <= 0) return;

        console.log(formValues);

        //ToDo:
        await startSavingEvent(formValues);
        //cerrar modal
        closeDateModal();
        //remover errores de pantalla
        setFormSubmited(false);
    }

    return (
        <Modal
            isOpen={ isDateModalOpen } //define con un boolean cuando se abre
            onRequestClose={ onCloseModal } //cuando se de un click fuera del modal llamar una func para cerrar
            style={ customStyles } //definir estilos con objeto
            className="modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={ 200 } //tiempo para cerrar
        >
            <h1> Nuevo evento </h1>
            <hr />
            <form className="container" onSubmit={ onSubmit }>

                <div className="form-group mb-2">
                    <label>Fecha y hora inicio</label>
                    <DatePicker 
                        selected={ formValues.start }
                        className="form-control"
                        onChange={ (event) => onDateChange(event, 'start') }
                        dateFormat="Pp" //mostrar horas y minutos
                        showTimeSelect //seleccionar hora y tiempo
                        locale="es"
                        timeCaption='Hora'
                    />
                </div>

                <div className="form-group mb-2">
                    <label>Fecha y hora fin</label>
                    <DatePicker
                        minDate={ formValues.start } //no se puede seleccionar fechas anteriores que el inicio
                        selected={ formValues.end }
                        className="form-control"
                        onChange={ (event) => onDateChange(event, 'end') }
                        dateFormat="Pp" //mostrar horas y minutos
                        showTimeSelect
                        locale="es"
                        timeCaption='Hora'
                    />
                </div>

                <hr />
                <div className="form-group mb-2">
                    <label>Titulo y notas</label>
                    <input 
                        type="text" 
                        className={ `form-control ${ titleClass }` }
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={ formValues.title }
                        onChange={ onInputChange }
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group mb-2">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={ formValues.notes }
                        onChange={ onInputChange }
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>
    )
}
