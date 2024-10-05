
<<<<<<< HEAD

=======
// import React, { useEffect, useState } from 'react';
>>>>>>> parent of 6bf747d (Merge branch 'main' into cabigting)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/LoginForm';
import AdminHomePage from './admin/AdminHomePage';
import ClientHomePage from './client/ClientHomePage';
import LandingPage from './landingpage';

function App() {
  // const[data, setData] = useState([])
  // useEffect(() =>{
  //   fetch('http://localhost:8081/admin')
  //   .then(res => res.json())
  //   .then(data => setData(data))
  //   .catch(err => console.log(err));
  // }, [])
  return (
    <div style={{padding: "50px"}}>
      {/* <table>
        <thead>
          <th>Username</th>
          <th>Password</th>
          <th>Created/Modified Date</th>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.username}</td>
              <td>{d.password}</td>
              <td>{d.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/client" element={<ClientHomePage />} />
      </Routes>
    </Router>

    </div>
  );
}

export default App;