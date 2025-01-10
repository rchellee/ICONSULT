import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../components/SearchProvider";
import ClientForm from "./ClientForm";
import ClientDetails from "./ClientDetails";
import Sidebar from "../sidebar";
import Topbar from "../Topbar";
import "./client-admin.css";

const ClientManagement = () => {
  const { searchTerm } = useContext(SearchContext);
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

  useEffect(() => {
    setSearchQuery(searchTerm.toLowerCase());
  }, [searchTerm]);

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
      if (response.ok) {
        setClients(
          clients.map((client) =>
            client.id === clientId ? { ...client, status: newStatus } : client
          )
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const updateClient = (updatedClient) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
      setIsAddingClient(false); // Navigate back after 5 seconds
    }, 5000);
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const filteredClients = clients.filter((client) =>
    `${client.firstName} ${client.lastName} ${client.companyName} ${
      client.email_add
    } ${client.mobile_number} ${formatDate(client.created_at)}`
      .toLowerCase()
      .includes(searchQuery)
  );

  return (
    <div>
      <Topbar />
      <div className="client-home-page">
        <Sidebar />
        <div className="client-content">
          {isAddingClient ? (
            <>
              <ClientForm
                clients={clients}
                setClients={setClients}
                showToast={() => setToastVisible(true)}
                hideToast={() => setToastVisible(false)}
                goBack={goBackToList}
              />
            </>
          ) : selectedClient ? (
            <ClientDetails
              client={selectedClient}
              updateClient={updateClient}
              showToast={() => setToastVisible(true)}
              hideToast={() => setToastVisible(false)}
              goBack={goBackToList}
            />
          ) : (
            <>
              <button onClick={() => setIsAddingClient(true)}>
                Add Client
              </button>
              {filteredClients.length === 0 ? (
                <p>No matching clients found.</p>
              ) : (
                <div className="scrollable-table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Email Address</th>
                        <th>Contact Number</th>
                        <th>Date Added</th>
                        <th>Status</th>
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
                            <td>{client.email_add}</td>
                            <td>{client.mobile_number}</td>
                            <td>{formatDate(client.created_at)}</td>
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
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;
