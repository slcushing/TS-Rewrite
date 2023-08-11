import { RouteComponentProps, withRouter } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Modal, Button, Form } from 'react-bootstrap';
import Sessions from './Sessions';
import { FaRegPlusSquare } from 'react-icons/fa';
import { Workout } from '../../Models/Workout.model';
import WorkoutDetail, { WorkoutDetailProps } from './WorkoutDetail';

interface WorkoutListState {
    workouts: Workout[];
    id: number;
    text: string;
    date: string;
}

interface WorkoutListProps extends RouteComponentProps{
    workout: WorkoutDetailProps;
    isAdmin: boolean;
    isAuth: boolean;
}


const Workouts = (props: WorkoutListProps) => {
    const [workouts, setWorkouts] = useState<WorkoutListState[]>([]);
    const [show, setShow] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const [date, setDate] = useState((new Date()).toISOString().substr(0,10));

    useEffect(() => {
        async function getWorkouts() {
            const response = await fetch(`/api_v1/workouts/`);
            if(!response.ok) {
                console.log(response);
            } else {
                const data = await response.json();
                setWorkouts(data);
            }
        }
        getWorkouts();
    }, []);

    const handleUpdate = async (workout: WorkoutListState): Promise<void> => {
        const headers: HeadersInit = new Headers();
        headers.set('X-CSRFToken', (Cookies.get('csrftoken') as string));
        headers.set("Content-Type", "application/json");
        const options = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(workout)
        };

        const response = await fetch(`/api_v1/workouts/${workout.id}/`, options);
        if(!response.ok) {
            console.log(response)
        } else {
            const updatedWorkouts = [...workouts];
            const index = updatedWorkouts.findIndex(e => e.id === workout.id);
            updatedWorkouts[index] = workout;
            setWorkouts(updatedWorkouts);
        }
    }

    const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        const id = event.currentTarget.value;
        const headers: HeadersInit = new Headers();
        headers.set('X-CSRFToken', (Cookies.get('csrftoken') as string));
        const options = {
            method: 'DELETE',
            headers: headers,
        };
        const response = await fetch(`/api_v1/workouts/${id}/`, options);
        if(!response.ok) {
            console.log(response);
        } else {
            let updatedWorkouts = [...workouts];
            const index = updatedWorkouts.findIndex(e => e.id === id as unknown as number);
            updatedWorkouts.splice(index, 1);
            setWorkouts(updatedWorkouts);
        }
    }

    const handleError = (error: string) => {
        console.warn(error)
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        const headers: HeadersInit = new Headers();
        headers.set('Content-Type' , 'application/json');
        headers.set("X-CSRFToken", (Cookies.get("csrftoken") as string));
        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                date,
                text,
            })
        };

        const response = await fetch(`/api_v1/workouts/`, options).catch(handleError);
        if(!response) {
            console.log(response)
        } else {
            const data = await response.json();
            setShow(false);
            setText('');
            console.log(workouts)
            let updatedWorkouts = [...workouts, data];
            updatedWorkouts = updatedWorkouts.sort((a, b) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
            setWorkouts(updatedWorkouts);
        }
    }

    const handleAdd = () => setShow(true)
    const handleClose = () => setShow(false)

    if(!workouts) {
        return <div>spinner thingy</div>
    }

    const WorkoutListHTML = workouts.map(workout =>
       <WorkoutDetail
            key={workout.id}
            workout={workout}
            handleDelete={handleDelete}
            handleUpdate={() => handleUpdate(workout)}
            isAdmin={props.isAdmin}
        />
    )
    
    return(
        <>  
            <div className='workout-container'>
                
                <section className='workout-list'>
                    <div className='workout-header'>
                    <h3>Adult Performance Workouts</h3>
                    {props.isAdmin && (
                        <button type='button' className='add-workout-btn' onClick={handleAdd}>Add <FaRegPlusSquare/></button>
                    )}
                    </div>
                    {WorkoutListHTML}
                </section>
                
                <section className='class-list'>
                    <h3>Adult Performance Group Training</h3>
                    <Sessions isAuth={props.isAuth} isAdmin={props.isAdmin}/>
                </section>
            </div>
 
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Workout</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Date:</Form.Label>
                            <Form.Control type='date' name='workout-date' value={date} min={date} onChange={(e) => setDate(e.target.value)}></Form.Control>
                            <Form.Label>Workout:</Form.Label>
                            <Form.Control type='text' as='textarea' onChange={(e) => setText(e.target.value)} name='text' value={text}>
                            </Form.Control>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='button' variant='success' onClick={handleSubmit}>Add</Button>
                        <Button type='button' variant='danger' onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>    
        </>
    )
}

export default withRouter(Workouts);