import  { useState } from 'react';
import ClientForm from './ClientForm'; // Assuming ClientForm component exists

const ClientList = () => {
  const [clients, setClients] = useState([]); // Client data
  const [showForm, setShowForm] = useState(false); // State to toggle between table and form

  // Function to toggle between list and form
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div>
      <h2>Client List</h2>
      {/* Toggle between the form and the list */}
      {showForm ? (
        <>
          {/* Show Add Client Form */}
          <ClientForm clients={clients} setClients={setClients} toggleForm={toggleForm} />
        </>
      ) : (
        <>
          {/* Show Client List */}
          <button onClick={toggleForm}>Add Client</button>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Projects</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No clients available
                  </td>
                </tr>
              ) : (
                clients.map((client, index) => (
                  <tr key={index}>
                    <td>{client.name}</td>
                    <td>{client.contact}</td>
                    <td>{client.status || 'N/A'}</td>
                    <td>{client.projects || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ClientList;