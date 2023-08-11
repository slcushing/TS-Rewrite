import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Card, CardActionArea, CardContent } from '@mui/material';
import { Client } from '../../Models/Client.model';

export interface ClientDetailState extends Client {
    
}

export interface ClientDetailProps {
    client: ClientDetailState
}

const ClientDetail = (props: ClientDetailProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [coachNote, setCoachNote] = useState(props.client.coach_notes); 

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setCoachNote(event.target.value);
    }   

    const handleSave = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        const headers: HeadersInit = new Headers();
        headers.set("Content-Type","application/json");
        headers.set("X-CSRFToken", (Cookies.get("csrftoken") as string));
        const options = {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify({ coach_notes: coachNote }),
        };

        const response = await fetch(`/api_v1/accounts/profiles/${props.client.id}/`, options);
        if (!response.ok) {
            console.log(response)
        } else {
            const data = await response.json()
            setCoachNote(coachNote);
            setIsEditing(false);

        }
    }


    return (
        <div className='client'>
            {
               
                <>
                    <div key={props.client.id} className='client-profile'>
                        <Card className='clientprofiles d-flex-col p-2 mb-3'>
                            <CardContent className='d-flex align-items-center'>
                                <img className='client-photo rounded-circle' src={props.client.avatar} alt=''/>
                                <p>{props.client.first_name} {props.client.last_name}</p>
                            </CardContent>
                            <CardContent className="d-flex-col">
                                <p>Primary phone: {props.client.phone_number}</p>
                                <p>Primary email: {props.client.email}</p>
                                <p>Client note: {props.client.member_notes}</p>
                                <label>Coach note:</label><textarea name="coach_notes" value={coachNote} disabled={!isEditing} cols={20} onChange={handleChange}></textarea> 
                            
                                <p>PT Coach: {props.client.coach_name}</p>
                                <CardActionArea>
                                    {isEditing 
                                    ?
                                    <button type='button' className='edit-note-btn' onClick={handleSave}>Save</button>
                                    :
                                    <button type='button' className='edit-note-btn' onClick={() => setIsEditing(true)}>Edit</button>
                                    }
                                </CardActionArea>
                            </CardContent>
                        </Card>
                        
                    </div>

                </>

            }
        </div>
    )
}

export default ClientDetail