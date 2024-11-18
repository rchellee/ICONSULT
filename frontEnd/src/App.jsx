import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/LoginForm';
import AdminHomePage from './admin/AdminHomePage';
import ClientDashboard from './client/ClientDashboard';
import LandingPage from '../src/Landingpage.jsx';
import ProjectManagement from './admin/Project/ProjectManagement';
import ClientManagement from './admin/Client/ClientManagement.jsx';
import EmployeeManagement from './admin/Employee/EmployeeManagement.jsx';
import AppointmentForm from './client/appointment/AppointmentForm.jsx';
import Project from './client/project/Project.jsx';
import DateofAppointments from './admin/Calendar/Availability.jsx'


// for google icons
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
link.rel = 'stylesheet';
document.head.appendChild(link);



function App() {
  // const[data, setData] = useState([])
  // useEffect(() =>{
  //   fetch('http://localhost:8081/admin')
  //   .then(res => res.json())
  //   .then(data => setData(data))
  //   .catch(err => console.log(err));
  // }, [])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/project" element={<ProjectManagement />} />
        <Route path="/clients" element={<ClientManagement />} />
        <Route path="/clientdashboard" element={<ClientDashboard />} />
        <Route path="/employee" element={<EmployeeManagement />} />
        <Route path="/appointments/new" element={<AppointmentForm />} />
        <Route path="/clientproject" element={<Project />} />
        <Route path="/calendar" element={<DateofAppointments />} />
      </Routes>
    </Router>
  );
}

export default App;