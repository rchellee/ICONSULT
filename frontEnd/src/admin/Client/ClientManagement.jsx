import { useState, useEffect } from "react";
import ClientForm from "./ClientForm";
import ClientDetails from "./ClientDetails";
import Sidebar from "../sidebar";

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Fetch clients from the database when the component mounts
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:8081/clients");
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []); // Empty dependency array means this runs once on mount

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const viewClientDetails = (client) => {
    setSelectedClient(client);
  };

  const goBackToList = () => {
    setSelectedClient(null);
  };

  const updateClient = (updatedClient) => {
    setClients(
      clients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
    setSelectedClient(updatedClient);
  };

  return (
    <div className="admin-home-page">
      <Sidebar />
      <div className="content">
        <h2>Clients</h2>
        {selectedClient ? (
          <ClientDetails
            client={selectedClient}
            goBack={goBackToList}
            updateClient={updateClient}
          />
        ) : (
          <>
            <button onClick={toggleForm}>
              {isFormVisible ? "Cancel" : "Add Client"}
            </button>
            {isFormVisible && (
              <ClientForm
                clients={clients}
                setClients={setClients}
                toggleForm={toggleForm}
              />
            )}
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
                          <td
                            onClick={() => viewClientDetails(client)}
                            style={{ cursor: "pointer", color: "blue" }}
                          >
                            {client.firstName} {client.lastName}
                          </td>
                          <td
                            onClick={() => viewClientDetails(client)}
                            style={{ cursor: "pointer", color: "blue" }}
                          >
                            {client.status}
                          </td>
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
    </div>
  );
};

export default ClientManagement;
