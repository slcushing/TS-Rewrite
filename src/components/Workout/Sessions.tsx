import { withRouter, RouteComponentProps } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import SessionDetail from "./SessionDetail";
import { Session } from "../../Models/Session.model";

interface SessionState {
    [key: string]: Session[]
}

interface SessionProps extends RouteComponentProps {
    isAdmin: boolean;
    isAuth: boolean;
}


const Sessions = (props: SessionProps) => {
    const [sessions, setSessions] = useState<SessionState>({});
   

    const handleError = (error:string) => {
        console.warn(error);
    }

    useEffect (() => {
        async function getSessions() {
            const response = await fetch(`/api_v1/events/?type=session`);
            if(!response.ok) {
                throw new Error('Network response was not OK');
            } else {
            
            const newSessions: { [key: string]: Session[] } = {};
            const data = await response.json();
            console.log('data', data)
            

            data.forEach((session: Session) => {
                const date = new Date(session.start);
                const key = date.toDateString();
                
                if(!newSessions[key]) {
                    newSessions[key] = [session];
                } else {
                    newSessions[key].push(session);
                }
                
            });
            setSessions(newSessions);
        }}
        getSessions();
    }, []);

    const handleRegister = async(session: Session): Promise<void> => {
        const headers: HeadersInit = new Headers();
        headers.set('X-CSRFToken', (Cookies.get('csrftoken') as string));
        headers.set('Content-Type', 'application/json')
        const options = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(session),
        };

        const response = await fetch(`/api_v1/events/register/${session.id}/`, options).catch(handleError);
        if(!response) {
            console.log(response)
        } else {
            const data = await response.json(); // updated session event from the server (single object)
            const key = new Date(data.start).toDateString(); // key inside sessions you need to target (sessions is an object on state)
            const values = [...sessions[key]]; // all sessions (listed inside an array) for sessions[key]
            const index = values.findIndex(e => e.id === data.id);
            values[index] = data;
            
            const updatedSessions = {...sessions};
            updatedSessions[key] = values;

            setSessions(updatedSessions);
        }

    }

    if(!sessions) {
        return <div>No Sessions</div>
    }

    
    const days = Object.keys(sessions);
    console.log(days);
    const sessionsHTML = days.map(day => {
            const details = sessions[day].map((session: Session) => <SessionDetail session={session} handleRegister={handleRegister} isAdmin={props.isAdmin} />);

            return (
                <>
                <h5 className='session-day'>{day}:</h5>
                {details}
                </>
            )
        })
    
    
    return(
        <>
        {sessionsHTML}
        </>
    )
}

export default withRouter(Sessions)