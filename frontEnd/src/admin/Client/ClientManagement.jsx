import { useState } from 'react';
import ClientForm from './ClientForm'; // Assuming ClientForm is in the same directory
import ClientDetails from './ClientDetails'; // Assuming ClientDetails is in the same directory

const ClientManagement = () => {
  const [clients, setClients] = useState([]); // State to store client data
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility
  const [selectedClient, setSelectedClient] = useState(null); // State to store selected client

  // Function to toggle the form's visibility
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Function to handle client selection for viewing details
  const viewClientDetails = (client) => {
    setSelectedClient(client);
  };

  // Function to go back to the client list
  const goBackToList = () => {
    setSelectedClient(null);
  };

  // Function to update client details
  const updateClient = (updatedClient) => {
    setClients(clients.map(client => (client.id === updatedClient.id ? updatedClient : client)));
    setSelectedClient(updatedClient); // Update the selected client to reflect changes
  };

  return (
    <div>
      <h2>Clients</h2>

      {/* If a client is selected, show ClientDetails component */}
      {selectedClient ? (
        <ClientDetails client={selectedClient} goBack={goBackToList} updateClient={updateClient} />
      ) : (
        <>
          {/* Button to toggle form visibility */}
          <button onClick={toggleForm}>
            {isFormVisible ? 'Cancel' : 'Add Client'}
          </button>

          {/* Display the form when isFormVisible is true */}
          {isFormVisible && (
            <ClientForm clients={clients} setClients={setClients} toggleForm={toggleForm} />
          )}

          {/* Display the client list only when form is not visible */}
          {!isFormVisible && (
            <>
              <h3>Clients List</h3>
              {clients.length === 0 ? (
                <p>No clients added yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client, index) => (
                      <tr key={index}>
                        {/* When the client's name is clicked, viewClientDetails is triggered */}
                        <td onClick={() => viewClientDetails(client)} style={{ cursor: 'pointer', color: 'black' }}>
                          {client.firstName}
                        </td>
                        <td>{client.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ClientManagement;
