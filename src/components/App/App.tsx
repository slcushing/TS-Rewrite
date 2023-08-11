import {useEffect, useState} from 'react';
import { Route, Switch, withRouter, useHistory } from 'react-router-dom';
import './App.scss';
import Spinner from 'react-bootstrap/Spinner';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import RegistrationForm from '../Registration/RegistrationForm';
import LoginForm from '../Login/LoginForm';
import MainHeader from '../Header/MainHeader';
import LandingPage from '../Landing/LandingPage';
import Dashboard from '../Dashboard/Dashboard';
import DashboardHeader from '../Header/DashboardHeader';
import CommunityCalendar from '../Calendar/CommunityCalendar';
import Workout from '../Workout/Workout';
import Clients from '../Clients/Clients';
import ProfileForm from '../Profile/ProfileForm';
import Footer from '../Footer/Footer';
import Cookies from 'js-cookie';


export interface AppState {
  username: string,
  password: string,
  isAuth: boolean,
  isAdmin: boolean,
}

const App = () => { 
  const [user, setUser] = useState<AppState>({
    username: '',
    password: '',
    isAuth: false,
    isAdmin: false,
  });

  const history = useHistory();

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/rest-auth/user/');
      if(!response.ok) {
        setUser({...user, isAuth: false});
      } else {
        const data = await response.json();
        setUser({...data, isAuth: true, isAdmin: data.is_staff})
      }
    }
    checkAuth();
  }, [history]);

  async function handleLogout() {
    const headers: HeadersInit = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("X-CSRFToken", (Cookies.get("csrftoken") as string))
    const options: RequestInit = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(user)
    };
    const response = await fetch('/rest-auth/logout/', options);
    if (!response.ok) {
      console.log(response);
    } else {
      // const data = await response.json();
      Cookies.remove('Authorization');
      setUser({...user, isAuth:false});
      history.push('/');
    }
  }


  if(!user) {
    return <Spinner animation='border'/>
  }

  const isAuth = user?.isAuth;
  const isAdmin = user?.isAdmin;
  const username = user?.username;
  

  return (
    <>
      <MainHeader isAuth={isAuth} isAdmin={isAdmin} handleLogout={handleLogout}/>
      {isAuth && <DashboardHeader username={username} isAdmin={isAdmin}/> }
      <Switch>
        <Route
          path="/registration"
          render={(props) => (
            <RegistrationForm 
              {...props}  
              setUser={setUser} 
            />
          )}
        />
        <Route
          path="/login"
          render={(props) => (
            <LoginForm 
              {...props}  

              setUser={setUser} 
            />
          )}
        />
        <PrivateRoute 
          path="/profile" 
          isAuth={isAuth} 
          isAdmin={isAdmin}
          component={ProfileForm} 
        />
        <PrivateRoute
          path="/dashboard"
          isAuth={isAuth}
          isAdmin={isAdmin}
          component={Dashboard}
        />
        <PrivateRoute
          path="/clients/:filter?"
          isAuth={isAuth}
          isAdmin={isAdmin}
          component={Clients}
        />
        <PrivateRoute
          path="/calendar"
          isAuth={isAuth}
          isAdmin={isAdmin}
          component={CommunityCalendar}
        />
        <PrivateRoute
          path="/workouts"
          isAuth={isAuth}
          isAdmin={isAdmin}
          component={Workout}
        />
        <Route 
          path="/" 
          exact  
          component={LandingPage}
        />
      </Switch>
      <Footer />
    </>
  );
}

export default withRouter(App);
