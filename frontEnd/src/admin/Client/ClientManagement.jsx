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
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

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

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from(new Set(clients.map(client => new Date(client.created_at).getFullYear())));

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
      setIsAddingClient(false);
    }, 5000);
  };

  const viewClientDetails = (client) => {
    setSelectedClient(client);
  };

  const goBackToList = () => {
    setSelectedClient(null);
    setIsAddingClient(false);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredClients = clients.filter((client) => {
    const clientDate = new Date(client.created_at);
    const matchesMonth = selectedMonth ? months[clientDate.getMonth()] === selectedMonth : true;
    const matchesYear = selectedYear ? clientDate.getFullYear().toString() === selectedYear : true;
    const matchesStatus = selectedStatus ? client.status === selectedStatus : true;
    return (
      matchesMonth &&
      matchesYear &&
      matchesStatus &&
      `${client.firstName} ${client.lastName} ${client.companyName} ${client.email_add} ${client.mobile_number} ${formatDate(client.created_at)}`
        .toLowerCase()
        .includes(searchQuery)
    );
  });

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="client-home-page">
        <div className="client-content">
          {isAddingClient ? (
            <ClientForm
              clients={clients}
              setClients={setClients}
              showToast={() => setToastVisible(true)}
              hideToast={() => setToastVisible(false)}
              goBack={goBackToList}
            />
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
              <div className="client-filters-section">
              <button onClick={() => setIsAddingClient(true)} className="add-client-btn">
                Add Client
              </button>
                
<div className="filter-controls">
  <div className="filter-select">
    <select 
      onChange={(e) => setSelectedMonth(e.target.value)} 
      value={selectedMonth}
    >
      <option value="">Months</option>
      {months.map((month, index) => (
        <option key={index} value={month}>{month}</option>
      ))}
    </select>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-4 w-4" 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path 
        fillRule="evenodd" 
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
        clipRule="evenodd" 
      />
    </svg>
  </div>

  <div className="filter-select">
    <select 
      onChange={(e) => setSelectedYear(e.target.value)} 
      value={selectedYear}
    >
      <option value="">Years</option>
      {years.map((year, index) => (
        <option key={index} value={year}>{year}</option>
      ))}
    </select>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-4 w-4" 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path 
        fillRule="evenodd" 
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
        clipRule="evenodd" 
      />
    </svg>
  </div>

  <div className="filter-select">
    <select 
      onChange={(e) => setSelectedStatus(e.target.value)} 
      value={selectedStatus}
    >
      <option value="">Status</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-4 w-4" 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path 
        fillRule="evenodd" 
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
        clipRule="evenodd" 
      />
    </svg>
  </div>
</div>
              </div>
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
                      {filteredClients.map((client) => (
                        <tr key={client.id}>
                          <td onClick={() => viewClientDetails(client)}>
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
                      ))}
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
