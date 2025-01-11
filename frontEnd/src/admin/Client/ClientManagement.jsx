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
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending", dateSortType: "year" }); // Default sorting by name

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

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ ...sortConfig, key, direction });

    const sortedClients = [...clients].sort((a, b) => {
      if (key === "name") {
        const aName = `${a.firstName} ${a.lastName}`;
        const bName = `${b.firstName} ${b.lastName}`;
        if (aName < bName) return direction === "ascending" ? -1 : 1;
        if (aName > bName) return direction === "ascending" ? 1 : -1;
      } else if (key === "status") {
        if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      } else if (key === "dateAdded") {
        const aDate = new Date(a[key]);
        const bDate = new Date(b[key]);

        // Handle sorting by Year or Year-Month
        const aSortValue =
          sortConfig.dateSortType === "month"
            ? `${aDate.getFullYear()}-${aDate.getMonth() + 1}`
            : `${aDate.getFullYear()}`;
        const bSortValue =
          sortConfig.dateSortType === "month"
            ? `${bDate.getFullYear()}-${bDate.getMonth() + 1}`
            : `${bDate.getFullYear()}`;

        if (aSortValue < bSortValue) return direction === "ascending" ? -1 : 1;
        if (aSortValue > bSortValue) return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    setClients(sortedClients);
  };

  const handleDateSortTypeChange = (type) => {
    setSortConfig({
      ...sortConfig,
      dateSortType: type,
    });
    handleSort("dateAdded");
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
            <>
              <button onClick={() => setIsAddingClient(true)}>Add Client</button>
              <div className="date-sort-options">
                <label>
                  <input
                    type="radio"
                    checked={sortConfig.dateSortType === "year"}
                    onChange={() => handleDateSortTypeChange("year")}
                  />
                  Year
                </label>
                <label>
                  <input
                    type="radio"
                    checked={sortConfig.dateSortType === "month"}
                    onChange={() => handleDateSortTypeChange("month")}
                  />
                  Year-Month
                </label>
              </div>
              <div className="scrollable-table-container">
                <table>
                  <thead>
                    <tr>
                      <th
                        onClick={() => handleSort("name")}
                        className={sortConfig.key === "name" ? sortConfig.direction : ""}
                      >
                        Name
                      </th>
                      <th>Company</th>
                      <th>Email Address</th>
                      <th>Contact Number</th>
                      <th
                        onClick={() => handleSort("status")}
                        className={sortConfig.key === "status" ? sortConfig.direction : ""}
                      >
                        Status
                      </th>
                      <th
                        onClick={() => handleSort("dateAdded")}
                        className={sortConfig.key === "dateAdded" ? sortConfig.direction : ""}
                      >
                        Date Added
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => {
                      const initials = `${client.firstName[0]}${client.lastName[0]}`.toUpperCase();
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
