import { useState } from 'react';
import './ClientManagement.css';
import ClientForm from './ClientForm'; // Import ClientForm

function ClientManagement() {
    const [clients, setClients] = useState([]);
    const [isFormVisible, setFormVisible] = useState(false); // State to control form visibility
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    const toggleFormVisibility = () => {
        setFormVisible(!isFormVisible); // Toggle form visibility
    };

    const handleClientAdded = (clientName) => {
        // Show success message
        setSuccessMessage(`Client ${clientName} added successfully!`);

        // Clear the success message after a timeout
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000); // Clear the message after 3 seconds
    };

    return (
        <div className="client-list">
            <h2>Clients</h2>

            {/* Button to toggle Add Client Form */}
            <button onClick={toggleFormVisibility}>
                {isFormVisible ? 'Cancel' : 'Add Client'}
            </button>

            {/* Add Client Form */}
            {isFormVisible && (
                <ClientForm
                    clients={clients}
                    setClients={setClients}
                    toggleForm={toggleFormVisibility}
                    onClientAdded={handleClientAdded} // Pass handleClientAdded as prop
                />
            )}

            {/* Success Message */}
            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}

            {/* Client Table - Only show this if there are clients and the form is not visible */}
            {!isFormVisible && clients.length > 0 && (
                <div className="client-table">
                    <h3>Client List</h3>
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
                            {clients.map((client, index) => (
                                <tr key={index}>
                                    <td>{client.name}</td>
                                    <td>{client.contact}</td>
                                    <td>{client.status}</td>
                                    <td>{client.projects}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ClientManagement;
