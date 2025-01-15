import { useState, useEffect } from "react";
import ClientForm from "./ClientForm";
import ClientDetails from "./ClientDetails";
import Sidebar from "../sidebar";
import Topbar from "../Topbar";
import "./client.css";

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filter, setFilter] = useState({ month: "", year: "" });

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

  const sortClients = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedClients = [...clients].sort((a, b) => {
      if (key === "firstName") {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        if (nameA < nameB) return direction === "asc" ? -1 : 1;
        if (nameA > nameB) return direction === "asc" ? 1 : -1;
        return 0;
      }
      if (key === "status") {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      }
      if (key === "dateAdded") {
        return direction === "asc"
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      return 0;
    });

    setClients(sortedClients);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "⇅";
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const filterClients = () => {
    return clients.filter((client) => {
      const clientDate = new Date(client.dateAdded);
      const filterMonth = filter.month ? parseInt(filter.month) : null;
      const filterYear = filter.year ? parseInt(filter.year) : null;

      return (
        (!filterMonth || clientDate.getMonth() + 1 === filterMonth) &&
        (!filterYear || clientDate.getFullYear() === filterYear)
      );
    });
  };

  const filteredClients = filterClients();

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

  const viewClientDetails = (client) => {
    setSelectedClient(client);
  };

  const goBackToList = () => {
    setSelectedClient(null);
    setIsAddingClient(false);
  };

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
            <><div className="client-filter-section">
<button className="add-client-btn" onClick={() => setIsAddingClient(true)}>Add Client</button>

                <select name="month" value={filter.month} onChange={handleFilterChange}>
                  <option value="">Months</option>
                  {[...Array(12).keys()].map((m) => (
                    <option key={m + 1} value={m + 1}>
                      {new Date(0, m).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </select>
                <select name="year" value={filter.year} onChange={handleFilterChange}>
                  <option value="">Years</option>
                  {[2025, 2024, 2023].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="scrollable-table-container">
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => sortClients("firstName")}>
                        Name {getSortIcon("firstName")}
                      </th>
                      <th>Company</th>
                      <th>Email Address</th>
                      <th>Contact Number</th>
                      <th onClick={() => sortClients("status")}>
                        Status {getSortIcon("status")}
                      </th>
                      <th onClick={() => sortClients("dateAdded")}>
                        Date Added {getSortIcon("dateAdded")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => {
                      const initials = `${client.firstName[0]}${client.lastName[0]}`.toUpperCase();
                      const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

                      return (
                        <tr key={client.id}>
                          <td onClick={() => viewClientDetails(client)}>
                            <div className="initials-circle" style={{ backgroundColor: color }}>
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
                                onChange={() => toggleStatus(client.id, client.status)}
                              />
                              <span className="slider"></span>
                            </label>
                          </td>
                          <td>{client.dateAdded}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {toastVisible && (
            <div className="toast active">
              <div className="toast-content">
                <i className="fas fa-solid fa-check check"></i>
                <div className="message">
                  <div className="text text-2">Success, your client has been added.</div>
                </div>
              </div>
              <i className="fa-solid fa-xmark close" onClick={() => setToastVisible(false)}></i>
              <div className="progress active"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;
