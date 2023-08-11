import React, { useState } from 'react';
import { BsSave } from "react-icons/bs";
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { Workout } from '../../Models/Workout.model';


export interface WorkoutDetailState {

}

export interface WorkoutDetailProps {
    workout: Workout;
    isAdmin: boolean;
    handleDelete: (e: React.MouseEvent<HTMLButtonElement>) => void
    handleUpdate: (workout: Workout) => void
}


const WorkoutDetail = (props: WorkoutDetailProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editWorkout, setEditWorkout] = useState<Workout>(props.workout);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>): void => {
        const {name, value} = event.target;
        setEditWorkout(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
        props.handleUpdate(editWorkout);
        setIsEditing(false);
    }

    return (
        <div className='workout'>
            {
                isEditing
                ? 
                <>
                    <div>
                        <label htmlFor="date">Date</label>
                        <input id="date" type='date' name='date' value={editWorkout.date} min='2021-11-01' onChange={handleChange}></input>
                        <textarea name='text' id="text" className='workout-edit-box' rows={5} cols={20} value={editWorkout.text} onChange={handleChange}></textarea>
                        <button type='button' className='save-workout-btn' onClick={handleUpdate}>Save <BsSave/></button>
                    </div>
                </>
                :
                <>
                    
                    <h5 className="workout-date">{format(new Date(props.workout.date + 'T08:00:00'), 'PPPP')}</h5>
                    <article className='workout-text'>{props.workout.text}</article>
                    {props.isAdmin && <button type='button' className='edit-workout-btn' onClick={() => setIsEditing(true)}><FaRegEdit/></button>}
                </>
        
            }
                {props.isAdmin && <button type='button' className='delete-workout-btn' value={editWorkout.id} onClick={props.handleDelete}><FaTrash/></button>}
        </div>
    )

}

export default WorkoutDetail