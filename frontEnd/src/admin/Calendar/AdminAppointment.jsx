import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";
import "./calendar.css";
import Topbar from "../Topbar";
import Calendar from "./AdminDynamicCalendar";
import '@fortawesome/fontawesome-free/css/all.min.css';

function AdminAppointment() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [timePeriod, setTimePeriod] = useState("");
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    consultationType: "",
    additionalInfo: "",
    reminder: "",
    client: "",
  });

  const [availableDates, setAvailableDates] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchAppointmentCounts = async () => {
    try {
      const response = await fetch("http://localhost:8081/appointments/count");
      if (!response.ok) throw new Error("Failed to fetch appointment counts");
      return await response.json();
    } catch (error) {
      console.error("Error fetching appointment counts:", error);
      return {};
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:8081/clients");
      if (!response.ok) throw new Error("Failed to fetch clients");
      const clientData = await response.json();
      console.log(clientData);
      setClients(clientData);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    const loadAvailability = async () => {
      const counts = await fetchAppointmentCounts();
      const availability = {};
      Object.entries(counts).forEach(([date, count]) => {
        availability[date] = count < 3 ? "available" : "fullyBooked";
      });
      setAvailableDates(availability);
    };

    loadAvailability();
    fetchClients();
  }, []);

  const times = [
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
  ];

  const handleDateSelect = async (date) => {
    const today = new Date().toISOString().split("T")[0];
    if (date <= today) {
      alert("You cannot select a past or current date.");
      return;
    }
    setSelectedDate(date);
    setFormData({ ...formData, date });

    try {
      const response = await fetch(
        `http://localhost:8081/appointments/times?date=${date}`
      );
      if (!response.ok) throw new Error("Failed to fetch booked times");

      const { bookedTimes } = await response.json();
      const blockedTimes = new Set(bookedTimes);

      bookedTimes.forEach((bookedTime) => {
        const bookedIndex = times.indexOf(bookedTime);
        if (bookedIndex !== -1) {
          if (bookedIndex + 1 < times.length)
            blockedTimes.add(times[bookedIndex + 1]);
          if (bookedIndex + 2 < times.length)
            blockedTimes.add(times[bookedIndex + 2]);
        }
      });

      // Mark times as booked or available
      const updatedTimes = times.map((time) => ({
        time,
        isBooked: blockedTimes.has(time),
      }));

      setAvailableTimes(updatedTimes);
    } catch (error) {
      console.error("Error fetching times for date:", error);
      setAvailableTimes(times.map((time) => ({ time, isBooked: false }))); // Default to all available
    }
  };
  

  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
    setFormData({ ...formData, time: "" }); // Reset time when period changes
  };

  const handleTimeSelect = (time) => {
    setFormData({ ...formData, time });
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => setCurrentStep((prevStep) => prevStep + 1);
  const prevStep = () => setCurrentStep((prevStep) => prevStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const client_Id = formData.client;

    if (!client_Id) {
      alert("Please select a client.");
      return;
    }

    const selectedClient = clients.find(
      (client) => client.id === parseInt(client_Id)
    );

    if (!selectedClient) {
      alert("Client not found. Please select a valid client.");
      return;
    }

    const formDataWithClientName = {
      date: formData.date,
      time: formData.time,
      name: `${selectedClient.firstName} ${selectedClient.lastName}`,
      email: selectedClient.email_add,
      contact: selectedClient.mobile_number,
      consultationType: formData.consultationType,
      additionalInfo: formData.additionalInfo || "",
      platform: formData.platform || "",
      clientId: client_Id, // Note: Correct field naming `clientId` as per backend
      companyName: selectedClient.companyName || "",
      reminder: formData.reminder || "",
    };
    console.log("Submitting appointment:", formDataWithClientName);

    try {
      const response = await fetch("http://localhost:8081/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithClientName),
      });

      if (!response.ok) {
        throw new Error("Failed to save appointment");
      }

      const result = await response.json();
      console.log("Appointment Submitted:", result);
      alert("Appointment Confirmed!");
      navigate("/calendar");

      // Reset the form
      setCurrentStep(1);
      setFormData({
        date: "",
        time: "",
        consultationType: "",
        additionalInfo: "",
        reminder: "",
        client: "",
      });
    } catch (error) {
      console.error("Error submitting appointment:", error);
      alert("An error occurred. Please try again.");
    }
    const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
      weekday: 'long',  // "Monday"
      year: 'numeric',  // "2025"
      month: 'long',    // "January"
      day: 'numeric'    // "11"
    });
  };

  return (
    <div>
      <Topbar />
      <Sidebar />

      <div className="step1-container">
        <div className="appointment-form-content">
          {currentStep === 1 && (
            <div>
              <p>Select a date and time for the appointment.</p>
              <div className="admin-calendar-time-container">
                
                <Calendar
                  availableDates={availableDates}
                  onDateSelect={handleDateSelect}
                />
                {selectedDate && (
                  <div className="time-slots-admin">
                    <h4>Available Options for Scheduling on{selectedDate}</h4>
                    <div className="time-dropdowns">
                      <label htmlFor="timePeriod">Choose Time Format:</label>
                      <select
                        id="timePeriod"
                        value={timePeriod}
                        onChange={handleTimePeriodChange}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>

                    {timePeriod && (
                      <div className="time-dropdowns">
                        <label htmlFor="time">Select Time:</label>
                        <select
                          id="time"
                          value={formData.time}
                          onChange={(e) => handleTimeSelect(e.target.value)}
                          disabled={!timePeriod}
                        >
                          <option value="" disabled>
                            Select Time
                          </option>
                          {availableTimes
                            .filter(({ time }) => time.endsWith(timePeriod))
                            .map(({ time, isBooked }) => (
                              <option
                                key={time}
                                value={time}
                                disabled={isBooked}
                                className={isBooked ? "booked" : ""}
                              >
                                {time} {isBooked ? "(Booked)" : ""}
                              </option>
                            ))}
                        </select>
                        <button
                          onClick={nextStep}
                          disabled={!formData.date || !formData.time}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="step2form">
              <p className="step2-form-description">
              Select client and consultation type</p>                
                    <div className="admin-app-form-group">
                <label htmlFor="client">Select Client</label>
                <select
                  id="client"
                  name="client"
                  value={formData.client}
                  onChange={(e) => {
                    const selectedClientId = e.target.value;
                    const selectedClient = clients.find(
                      (client) => client.id === parseInt(selectedClientId)
                    );
                    setFormData({
                      ...formData,
                      client: selectedClientId, // Set the client ID
                      clientName: selectedClient
                        ? `${selectedClient.firstName} ${selectedClient.lastName}`
                        : "", // Set the client name for display purposes
                    });
                  }}
                  required
                >
                  <option value="" disabled>
                    Select Client
                  </option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-app-form-group">
                <label htmlFor="consultationType">Consultation Type:</label>
                <select
                  id="consultationType"
                  name="consultationType"
                  value={formData.consultationType}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    setFormData({
                      ...formData,
                      consultationType: selectedValue,
                      otherDetails: selectedValue === "Others" ? "" : undefined, // Reset if "Others" selected
                    });
                  }}
                  required
                >
                  <option value="" disabled>
                    Select Consultation Type
                  </option>
                  <optgroup label="Corporate and Consultancy Services">
                    <option value="Strategic Planning Consultation">
                      Strategic Planning Consultation
                    </option>
                    <option value="Corporate Governance Review">
                      Corporate Governance Review
                    </option>
                    <option value="Business Process Improvement">
                      Business Process Improvement
                    </option>
                  </optgroup>
                  <optgroup label="Management Advisory Services">
                    <option value="Risk Management Consultation">
                      Risk Management Consultation
                    </option>
                    <option value="Organizational Development Advisory">
                      Organizational Development Advisory
                    </option>
                    <option value="Financial Advisory">
                      Financial Advisory
                    </option>
                  </optgroup>
                  <optgroup label="Professional Services">
                    <option value="Accounting Consultation">
                      Accounting Consultation
                    </option>
                    <option value="Legal Advisory">Legal Advisory</option>
                    <option value="Tax Advisory">Tax Advisory</option>
                  </optgroup>
                  <optgroup label="Payroll Services">
                    <option value="Payroll System Setup Consultation">
                      Payroll System Setup Consultation
                    </option>
                    <option value="Employee Benefits and Compliance Advisory">
                      Employee Benefits and Compliance Advisory
                    </option>
                  </optgroup>
                  <optgroup label="Business Set-up">
                    <option value="Startup Planning">Startup Planning</option>
                    <option value="Business Structuring and Licensing Advisory">
                      Business Structuring and Licensing Advisory
                    </option>
                  </optgroup>
                  <optgroup label="Registrations">
                    <option value="Business Name Registration">
                      Business Name Registration
                    </option>
                    <option value="SEC/DTI/Mayor’s Permit Assistance">
                      SEC/DTI/Mayor’s Permit Assistance
                    </option>
                    <option value="Compliance Consultation">
                      Compliance Consultation
                    </option>
                  </optgroup>
                  <option value="Follow up">Follow up</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {formData.consultationType === "Others" && (
                <div className="admin-app-form-groupp">
                  <label htmlFor="otherDetails">Please specify:</label>
                  <textarea
                    id="otherDetails"
                    name="otherDetails"
                    value={formData.otherDetails || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, otherDetails: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              <div className="admin-app-form-group">
                <label htmlFor="additionalInfo">Purpose:</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-app-form-group">
                <label htmlFor="platform">
                  Preferred Communication Platform:
                </label>
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Platform
                  </option>
                  <option value="In-Person">In-Person</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Google Meet">Google Meet</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                </select>
              </div>

              <div className="admin-app-form-group">
                <label htmlFor="reminder">Remind me:</label>
                <select
                  id="reminder"
                  name="reminder"
                  value={formData.reminder || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Reminder Time
                  </option>
                  <option value="At Time of Event">At Time of Event</option>
                  <option value="5 minutes before">5 minutes before</option>
                  <option value="10 minutes before">10 minutes before</option>
                  <option value="15 minutes before">15 minutes before</option>
                  <option value="30 minutes before">30 minutes before</option>
                  <option value="1 hour before">1 hour before</option>
                  <option value="2 hours before">2 hours before</option>
                  <option value="1 day before">1 day before</option>
                  <option value="2 days before">2 days before</option>
                  <option value="1 week before">1 week before</option>
                </select>
              </div>
              <div  className="step2form-button">
              <button onClick={prevStep}>Back</button>
              <button 
              
  onClick={nextStep}
  disabled={
    !formData.consultationType ||
    (formData.consultationType === "Others" && !formData.otherDetails)
  }
>
  Next
  
</button>
</div>

            </div>
          )}
{/** Step 3: Confirmation **/}
{currentStep === 3 && (
  <div className="confirmation-container">
    <div className="confirmation-form">
      <p className="confirmation-header">
        <span>Review</span> and <span>Confirm</span> your appointment details before submitting.
      </p>
      
      <div className="icon-line">
        <i className="bx bxs-user"></i>
        <p><strong>Client:</strong> {formData.clientName}</p>
      </div>
      <div className="divider"></div>

      <div className="icon-line">
        <i className="bx bxs-calendar"></i>
        <p><strong>Date:</strong> {formData.date}</p>
      </div>
      <div className="divider"></div>

      <div className="icon-line">
        <i className="bx bxs-time"></i>
        <p><strong>Time:</strong> {formData.time}</p>
      </div>
      <div className="divider"></div>

      <div className="icon-line">
        <i className="bx bxs-category"></i>
        <p><strong>Consultation Type:</strong> {formData.consultationType}</p>
      </div>
      <div className="divider"></div>

      <div className="icon-line">
        <i className="bx bxs-info-circle"></i>
        <p><strong>Additional Info:</strong> {formData.additionalInfo}</p>
      </div>
      <div className="divider"></div>

      <div className="icon-line">
        <i className="bx bxs-platform"></i>
        <p><strong>Consultation Mode:</strong> {formData.platform}</p>
      </div>
      <div className="divider"></div>

      <div className="icon-line">
        <i className="bx bxs-bell"></i>
        <p><strong>Reminder:</strong> {formData.reminder}</p>
      </div>
      <div className="divider"></div>

      <div className="confirmation-buttons">
        <button onClick={prevStep}>Back</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}

export default AdminAppointment;
