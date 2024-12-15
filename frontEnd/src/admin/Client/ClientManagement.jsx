import { useState, useEffect } from "react";
import ClientForm from "./ClientForm";
import ClientDetails from "./ClientDetails";
import "./client.css";
import Sidebar from "../sidebar";

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeClients, setActiveClients] = useState({});
  const [toastVisible, setToastVisible] = useState(false); // State to manage toast visibility
  
  
  // Fetch clients from the database when the component mounts
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:8081/clients");
        const data = await response.json();
        setClients(data);

        // Initialize activeClients based on database status values
        const initialActiveStates = data.reduce((acc, client) => {
          acc[client.id] = client.status === "active";
          return acc;
        }, {});
        setActiveClients(initialActiveStates);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const viewClientDetails = (client) => {
    setSelectedClient(client);
  };

  const goBackToList = () => {
    setSelectedClient(null);
  };

  const updateClientStatus = (clientId, newStatus) => {
    setClients(
      clients.map((client) =>
        client.id === clientId ? { ...client, status: newStatus } : client
      )
    );
  };

  // Function to update client status in the database
  const updateStatusInDatabase = async (clientId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8081/clients/${clientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update status in database");
      }
      console.log("Status updated successfully in database");
    } catch (error) {
      console.error("Error updating status in database:", error);
    }
  };

  // Handle toggle click for each client
  const handleToggle = async (clientId) => {
    const newActiveState = !activeClients[clientId];
    setActiveClients({
      ...activeClients,
      [clientId]: newActiveState,
    });

    // Update client status in the state
    const newStatus = newActiveState ? "active" : "inactive";
    updateClientStatus(clientId, newStatus);

    // Update client status in the database
    await updateStatusInDatabase(clientId, newStatus);
  };

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 5000); // Hide the toast after 5 seconds
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
            updateClient={updateClientStatus}
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
                showToast={showToast} // Pass showToast function to ClientForm
              />
            )}
            {!isFormVisible && (
              <>
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
                            style={{ cursor: "pointer", color: "black" }}
                          >
                            {`${client.firstName} ${client.lastName}`.toUpperCase()}
                          </td>
                          <td>
                            <div
                              className={`toggle ${
                                activeClients[client.id] ? "active" : ""
                              }`}
                              onClick={() => handleToggle(client.id)}
                            ></div>
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

        {/* Toast Notification */}
        {toastVisible && (
          <div className="toast active">
            <div className="toast-content">
              <i className="fas fa-solid fa-check check"></i>
              <div className="message">
                <span className="text text-1">Success</span>
                <span className="text text-2">Your client has been added.</span>
              </div>
            </div>
            <i className="fa-solid fa-xmark close" onClick={() => setToastVisible(false)}></i>
            <div className="progress active"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManagement;
