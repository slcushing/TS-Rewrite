import React, {useState} from 'react';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { BsSave } from "react-icons/bs";
import { Task } from '../../Models/Task.model';


export interface TaskDetailState extends Task{
    
}

export interface TaskDetailProps {
    task: Task,
    toggleCompletion: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleDelete: (e: React.MouseEvent<HTMLButtonElement>) => void
    handleUpdate: (task: Task) => void
}

const TaskDetail = (props: TaskDetailProps):JSX.Element => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editText, setEditText] = useState<TaskDetailState>({
        id: 0,
        complete: false,
        text: props.task.text,
        owner: 0,
    });
    const {id, text, complete} = props.task;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setEditText({
            ...editText,
            text: (event.target.value)
         });
    }

    const handleUpdate = (event: any): void => {
        const updatedTask = {...props.task, text: editText.text}
        props.handleUpdate(updatedTask);
        setIsEditing(false);
    }

    return (
        <div className='task-item'>
            <input type='checkbox' checked={complete} name="complete" onChange={props.toggleCompletion} value={id} />
            {
                isEditing ?
                <input type="text" name="editText" value={editText.text} onChange={handleChange} /> :
                <label>{text}</label>
            }
           
            {
                isEditing ? 
                <button type='button' className='save-task-btn' onClick={(e) => handleUpdate(e)}><BsSave/></button> :
                <button type='button' className='edit-task-btn' onClick={() => setIsEditing(true)}><FaRegEdit/></button>
            }
            <button type='button' className='delete-task-btn' onClick={props.handleDelete} value={id}><FaTrash/></button>
        </div>
    )
}

export default TaskDetail