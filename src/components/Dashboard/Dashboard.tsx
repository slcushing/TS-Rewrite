import {withRouter} from 'react-router-dom'
import DashCalendar from './DashCalendar'
import TaskList from './TaskList'

const Dashboard = () => {

    return(
        <>
        <main className='dashboard-main'>
                <DashCalendar/>
                <TaskList />
        </main>
        </>
    )
}

export default withRouter(Dashboard)