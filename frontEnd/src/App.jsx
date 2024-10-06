import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/LoginForm';
import AdminHomePage from './admin/AdminHomePage';
import ClientHomePage from './client/ClientHomePage';
import LandingPage from './landingpage';
import ProjectManagement from './admin/Project/ProjectManagement';
import ClientManagement from './admin/Client/ClientManagement.jsx';

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
        <Route path="/client" element={<ClientHomePage />} />
        <Route path="/project" element={<ProjectManagement />} />
         <Route path="/clients" element={<ClientManagement />} />  {/* Client page */}
      </Routes>
    </Router>
  );
}

export default App;