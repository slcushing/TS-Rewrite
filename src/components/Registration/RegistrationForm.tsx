import {useState} from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AppState } from '../App/App';
import { LoginFormResponse } from '../../Models/LoginFormResponse.model';

interface RegistrationFormState {
    username: string;
    email: string;
    password1: string;
    password2: string;
}

export interface RegistrationFormProps extends RouteComponentProps {
    setUser: (user: AppState) => void
}

const RegistrationForm = (props: RegistrationFormProps):JSX.Element => {
    const [user,setUser] = useState<RegistrationFormState>({
        username: '',
        email:'',
        password1: '',
        password2: '',
    });
    

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const {name,value} = event.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const [error, setError] = useState<string>('')

    const handleError = (error: string): void => {
        console.warn(error)
    };

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if(user.password1 !== user.password2) {
            setError('Passwords do not match!')
        } else {
            const headers: HeadersInit = new Headers();
            headers.set("Content-Type","application/json");
            headers.set("X-CSRFToken", (Cookies.get("csrftoken") as string))
            const options: RequestInit = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(user)
            };

            const response = await fetch('/rest-auth/registration/', options).catch(handleError);
            if(!response) {
                console.log(response);
            } else {
                const data: LoginFormResponse = await response.json();
                Cookies.set('Authorization', `Token ${data.key}`);
                props.setUser({
                    username:data.user.username,
                    password: '',
                    isAdmin: data.user.is_staff,
                    isAuth: true,
                });
                props.history.push('/profile');
            }
        }
    }

    return (
        <div className='register-container'>
            <form className='col-4 offset-lg-4 register-form' onSubmit={handleSubmit}>
                <div className='form-group text-left mb-3'>
                    <label htmlFor='username'>Username</label>
                    <input
                        type='text'
                        className='form-control'
                        id='username'
                        placeholder='Enter Username'
                        required
                        name='username'
                        value={user.username}
                        onChange={handleInput}
                        />
                </div>
                <div className='form-group text-left mb-3'>
                    <label htmlFor='email'>Email</label>
                    <input
                        type='email'
                        className='form-control'
                        id='email'
                        placeholder='Enter Email'
                        required
                        name='email'
                        value={user.email}
                        onChange={handleInput}
                        />
                </div><div className='form-group text-left mb-3'>
                    <label htmlFor='password1'>Password</label>
                    <input
                        type='password'
                        className='form-control'
                        id='password1'
                        placeholder='Enter Password'
                        required
                        name='password1'
                        value={user.password1}
                        onChange={handleInput}
                        />
                </div>
                <div className='form-group text-left mb-3'>
                    <label htmlFor='password2'>Confirm Password</label>
                    <input
                        type='password'
                        className='form-control'
                        id='password2'
                        placeholder='Confirm Password'
                        required
                        name='password2'
                        value={user.password2}
                        onChange={handleInput}
                        />
                </div>
                <button type='submit' className='btn btn-danger mt-3' id='register-button'>Register</button>
            </form>
        </div>
    )
}

export default withRouter(RegistrationForm)