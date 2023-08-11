import { RouteComponentProps, withRouter } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import {Modal, Button, Form} from 'react-bootstrap';
import { FaPlusSquare } from 'react-icons/fa';
import TaskDetail, { TaskDetailState } from './TaskDetail';
import { Task } from '../../Models/Task.model';

export interface TaskListState extends Task {
    tasks: TaskDetailState[];

  }

interface TaskListProps extends RouteComponentProps {
    // task: TaskDetailProps
}

const TaskList = (props: TaskListProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [show, setShow] = useState<boolean>(false);
    const [text, setText] = useState<string>('');

    useEffect(() => {
        async function getTasks() {
            const response = await fetch(`/api_v1/tasks/`);
            if(!response.ok) {
                console.log(response);
            } else {
                const data = await response.json();
                
                setTasks(data);
            }
        }
        getTasks();
    }, []);

    const handleUpdate = async (task: Task): Promise<void> => {
        const headers: HeadersInit = new Headers();
        headers.set("Content-Type","application/json");
        headers.set("X-CSRFToken", (Cookies.get("csrftoken") as string))
        const options: RequestInit = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(task)
        };

        const response = await fetch(`/api_v1/tasks/${task.id}/`, options);
        if(!response.ok) {
            console.log(response)
        } else {
            const updatedTasks = [...tasks];
            const index = updatedTasks.findIndex(e => e.id === task.id); 
            updatedTasks[index] = task;
            setTasks(updatedTasks);
        }
    }

    const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        const id  = parseInt(event.currentTarget.value, 10);
        const headers: HeadersInit = new Headers();
        headers.set('X-CSRFToken', (Cookies.get('csrftoken') as string))
        const options = {
            method: 'DELETE',
            headers: headers,
        };
        const response = await fetch(`/api_v1/tasks/${id}/`, options);
        if (!response.ok) {
            console.log(response);
        } else {
            let updatedTasks = [...tasks];
            const index = updatedTasks.findIndex(e => e.id === id as unknown as number);
            updatedTasks.splice(index, 1);
            setTasks(updatedTasks);
        }
    }

    const toggleCompletion = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const updatedTasks = [...tasks];
        const id = parseInt(event.target.value, 10);
        const index = updatedTasks.findIndex(task => task.id === id as unknown as number);

        updatedTasks[index].complete = !updatedTasks[index].complete;
        setTasks(updatedTasks);
        console.log(index)
        console.log()

        const headers: HeadersInit = new Headers();
        headers.set("Content-Type","application/json");
        headers.set("X-CSRFToken", (Cookies.get("csrftoken") as string))
        const options = {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify({
                complete: updatedTasks[index].complete
            }),
        };
        const response = await fetch(`/api_v1/tasks/${id}/`, options);
        
        if (!response.ok) {
            console.log(response);
        } 
    }

    const handleError = (error: string): void => {
        console.warn(error);
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        const headers: HeadersInit = new Headers();
        headers.set('Content-Type','application/json');
        headers.set('X-CSRFToken', Cookies.get('csrftoken') as string)
        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({text})
        };

        const response = await fetch(`/api_v1/tasks/`, options).catch(handleError);
        if(!response) {
            console.log(response)
        } else {
            const data = await response.json();
            setShow(false);
            setText('');
            setTasks([...tasks, data]);
        }
    }

    const handleAdd = () => setShow(true)
    const handleClose = () => setShow(false)

    if(!tasks) {
        return <div>spinner thingy</div>
    }

    const TaskListHTML = tasks.map(task =>
        <TaskDetail 
            key={task.id} 
            task={task}
            toggleCompletion={(e) => toggleCompletion(e)} 
            handleDelete={(e) => handleDelete(e)}
            handleUpdate={(x) => handleUpdate(x)} // Fixed edit here, werent passing an arguement so the "task" you were sending was from this components state.
            />
        )


    return (
        <>
            <div className='task-container'>
                <h4>Tasks</h4>
                {TaskListHTML}
                <button type="button" className='add-task-btn' onClick={handleAdd}>Add task <FaPlusSquare/></button>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Task:</Form.Label><Form.Control type='text' onChange={(e) => setText(e.target.value)} autoComplete='off' name='text' value={text}></Form.Control>
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

export default withRouter(TaskList)