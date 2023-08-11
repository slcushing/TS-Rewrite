import { useState} from 'react';
import {withRouter, Redirect, Link, RouteComponentProps} from 'react-router-dom';
import Cookies from 'js-cookie';
import { LoginFormResponse } from '../../Models/LoginFormResponse.model';
import { AppState } from '../App/App';

interface LoginFormState {
    username: string,
    password: string,
    isAuth: boolean,
    isAdmin: boolean,
    key: string,
}

export interface LoginFormProps extends RouteComponentProps{
    setUser: (user: AppState) => void

}

const LoginForm = (props: LoginFormProps) => {
    const [user, setUser] = useState<LoginFormState>({
        username: '',
        password: '',
        isAuth: false,
        isAdmin: false,
        key: '',
    });

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const {name,value} = event.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleError = (error:string): void => {
        console.warn(error);
    }

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        const headers: HeadersInit = new Headers();
            headers.set("Content-Type","application/json");
            headers.set("X-CSRFToken", (Cookies.get("csrftoken") as string))
            const options: RequestInit = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(user)
            };

        const response = await fetch('/rest-auth/login/', options).catch(handleError);
        if(!response) {
            console.log(response);
        } else {
            const data : LoginFormResponse = await response.json();
            Cookies.set('Authorization', `Token ${data.key}`);
            props.setUser({
                username:data.user.username,
                password: '',
                isAdmin: data.user.is_staff,
                isAuth: true,

            });
            if(data.user.is_staff) {
                props.history.push('/dashboard/');
            } else {
                props.history.push('/workouts/'); 
            }
            
        }
    }

    if(user.isAuth && user.isAdmin) {
        return <Redirect to='/dashboard' />
    }

    if(user.isAuth) {
        return <Redirect to='/workouts' />
    }

    return (
        <div className="login-container">
            <form className='col-4 offset-lg-4 login-form' onSubmit={handleSubmit}>
                <div className='form-group text-left mb-3'>
                    <label htmlFor='username'>Username</label>
                    <input
                        type='text'
                        className='form-control'
                        id='username'
                        placeholder='Enter Username'
                        onChange={handleInput}
                        required
                        name='username'
                        value={user.username}
                        />
                </div>
                <div className='form-group text-left mb-3'>
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        className='form-control'
                        id='password'
                        placeholder='Enter Password'
                        onChange={handleInput}
                        required
                        name='password'
                        value={user.password}
                        />
                </div>
                <button type='submit' className='btn btn-danger' id='login-button'>Login</button>
                <div>Not a member yet? Register <Link to='/registration'>here.</Link></div>
            </form>
            

        </div>
    )

}

export default withRouter(LoginForm)