import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom'
import { format } from 'date-fns'

interface DashboardHeaderProps extends RouteComponentProps {
    username: string;
    isAdmin: boolean;
}

const DashboardHeader = (props: DashboardHeaderProps) => {
    const today = new Date();
    const formattedDate = format(today, 'PPPP');
    
    return (
        <>
        <header className="dash-header bg-dark">Welcome {props.username}!  Today is {formattedDate} </header>
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark' id='dash-header'>
            <div className='container d-flex justify-content-center'>
                <ul className='navbar-nav' id='dash-nav'>
                    {props.isAdmin && (
                        <>
                            <li className='nav-item'>
                                <NavLink to='/dashboard'>Dashboard</NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink to='/clients'>Clients</NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink to='/calendar'>Event Calendar</NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink to='/workouts'>Workouts + Group Training</NavLink>
                            </li>
                        </>
                    )}
                    {!props.isAdmin && (
                        <>
                            <li className='nav-item'>
                                <NavLink to='/calendar'>Event Calendar</NavLink> 
                            </li>
                            <li className='nav-item'>
                                <NavLink to='/workouts'>Workouts + Group Training</NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink to='/profile'>Manage Profile</NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
        </>
    )
}

export default withRouter(DashboardHeader)