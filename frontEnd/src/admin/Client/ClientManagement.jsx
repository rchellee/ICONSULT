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
  const [toastVisible, setToastVisible] = useState(false);

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

  const handleToggle = async (clientId) => {
    const newActiveState = !activeClients[clientId];
    setActiveClients({
      ...activeClients,
      [clientId]: newActiveState,
    });

    const newStatus = newActiveState ? "active" : "inactive";
    updateClientStatus(clientId, newStatus);
    await updateStatusInDatabase(clientId, newStatus);
  };

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 5000); // Hide the toast after 5 seconds
  };

  // Hash function to generate consistent colors based on client ID or name
  const generateColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `#${((hash >> 24) & 0xff).toString(16)}${((hash >> 16) & 0xff)
      .toString(16)}${((hash >> 8) & 0xff).toString(16)}`.slice(0, 7);
    return color.length === 7 ? color : "#007bff"; // Default color if hash fails
  };

  return (
    <div className="admin-home-page">
      <Sidebar />
      <div className="content">
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
                showToast={showToast}
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
                        <th></th> {/* Column for Client's Initials */}
                        <th>Name</th> {/* Client's Full Name */}
                        <th>Company</th> {/* Client's Company */}
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client, index) => {
                        const initials = `${client.firstName[0]}${client.lastName[0]}`.toUpperCase(); // Generate initials
                        const color = generateColor(client.id + client.firstName + client.lastName); // Generate consistent color

                        return (
                          <tr key={index}>
                            <td className="initials-cell">
                              <div
                                className="initials-circle"
                                style={{ backgroundColor: color }}
                              >
                                {initials}
                              </div>
                            </td>
                            <td
                              onClick={() => viewClientDetails(client)}
                              style={{ cursor: "pointer", color: "black" }}
                            >
                              {`${client.firstName} ${client.lastName}`.toUpperCase()}
                            </td>
                            <td>{client.companyName}</td>
                            <td>
                              <div
                                className={`toggle ${
                                  activeClients[client.id] ? "active" : ""
                                }`}
                                onClick={() => handleToggle(client.id)}
                              ></div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </>
        )}

        {toastVisible && (
          <div className="toast active">
            <div className="toast-content">
              <i className="fas fa-solid fa-check check"></i>
              <div className="message">
                <span className="text text-1">Success</span>
                <span className="text text-2">Your client has been added.</span>
              </div>
            </div>
            <i
              className="fa-solid fa-xmark close"
              onClick={() => setToastVisible(false)}
            ></i>
            <div className="progress active"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManagement;
