import { useState } from "react";
import { format } from 'date-fns';
import { Modal, Button } from 'react-bootstrap'
import { Session } from "../../Models/Session.model";


export interface SessionDetailState {
    is_registered: boolean;
}

export interface SessionDetailProps {
    session: Session;
    isAdmin: boolean;
    handleRegister: (session: Session) => void
}


function SessionDetail(props: SessionDetailProps) {
    const [show, setShow] = useState<boolean>(false);
    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true);

    const {session} = props;

    return (
        <div className="session">
            <div className='session-time'>
                <time>{format(new Date(session.start), 'p')} - </time>
                <time>{format(new Date(session.end), 'p')}</time>
            </div>
            {!props.isAdmin && <button type="button" onClick={() => props.handleRegister(session)}>{session.is_registered ? 'Unregister' : 'Register'}</button>}
            
            {props.isAdmin && session.attendee_list.length > 0 && <button type="button" className='add-attendee-btn' onClick={handleOpen}>Attendees</button>}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Attendees</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>{session.attendee_list.map(attendee => <div>{attendee.first_name} {attendee.last_name}</div>)}</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type='button' variant='danger' onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default SessionDetail