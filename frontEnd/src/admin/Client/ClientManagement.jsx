import { useState, useEffect } from "react";
import ClientForm from "./ClientForm";
import ClientDetails from "./ClientDetails";
import Sidebar from "../sidebar";
import Topbar from "../Topbar";
import "./client.css";

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isAddingClient, setIsAddingClient] = useState(false);

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
  }, []);

  const toggleStatus = async (clientId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await fetch(
        `http://localhost:8081/clients/${clientId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setClients(
          clients.map((client) =>
            client.id === clientId ? { ...client, status: newStatus } : client
          )
        );
      } else {
        console.error("Failed to update status:", result.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const viewClientDetails = (client) => {
    setSelectedClient(client);
  };

  const goBackToList = () => {
    setSelectedClient(null);
    setIsAddingClient(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredClients = clients.filter((client) =>
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchQuery)
  );

  return (
    <div>
      <Topbar />

      <div className="client-home-page">
        <Sidebar />
        <div className="client-content">
          {isAddingClient ? (
            <ClientForm
              clients={clients}
              setClients={setClients}
              showToast={() => setToastVisible(true)}
            />
          ) : selectedClient ? (
            <ClientDetails client={selectedClient} goBack={goBackToList} />
          ) : (
            <>
              <button onClick={() => setIsAddingClient(true)}>
                Add Client
              </button>
              <input
                type="text"
                className="search-bar"
                placeholder="Search client"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {filteredClients.length === 0 ? (
                <p>No matching clients found.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Email Address</th>
                      <th>Contact Number</th>
                      <th>Status</th>
                      <th>City</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => {
                      const initials =
                        `${client.firstName[0]}${client.lastName[0]}`.toUpperCase();
                      const color = `#${Math.floor(
                        Math.random() * 16777215
                      ).toString(16)}`;

                      return (
                        <tr key={client.id}>
                          <td onClick={() => viewClientDetails(client)}>
                            <div
                              className="initials-circle"
                              style={{ backgroundColor: color }}
                            >
                              {initials}
                            </div>
                            {`${client.firstName} ${client.lastName}`}
                          </td>
                          <td>{client.companyName}</td>
                          <td>{client.email}</td>
                          <td>{client.contactNumber}</td>
                          <td>
                            <label className="toggle-btn">
                              <input
                                type="checkbox"
                                checked={client.status === "active"}
                                onChange={() =>
                                  toggleStatus(client.id, client.status)
                                }
                              />
                              <span className="slider"></span>
                            </label>
                          </td>
                          <td>{client.city}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </>
          )}
          {toastVisible && (
            <div className="toast active">
              <div className="toast-content">
                <i className="fas fa-solid fa-check check"></i>
                <div className="message">
                  <div className="text text-2">
                    Success, your client has been added.
                  </div>
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
    </div>
  );
};

export default ClientManagement;
