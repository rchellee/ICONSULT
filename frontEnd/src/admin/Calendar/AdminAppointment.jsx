import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../sidebar"; // Import the Sidebar component
import "./calendar.css";
import Calendar from "./DynamicCalendar";

function AdminAppointment() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // Track the current step
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    consultationType: "",
    additionalInfo: "",
    reminder: "",
  });

  const generateRandomAvailability = () => {
    const today = new Date();
    const dates = {};
    for (let i = 0; i < 60; i++) {
      // Current and next month
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + i
      );
      const dateStr = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const rand = Math.random();
      if (rand < 0.3) {
        dates[dateStr] = "available";
      } else if (rand < 0.6) {
        dates[dateStr] = "fullyBooked";
      }
    }
    return dates;
  };

  const [availableDates] = useState(generateRandomAvailability());

  const times = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData({ ...formData, date });
    setAvailableTimes(times); // Adjust dynamically if necessary
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

    const clientId = localStorage.getItem("clientId"); // Get clientId from local storage or context

    if (!clientId) {
        alert("Client ID not found. Please log in.");
        return;
    }

    const formDataWithClientId = { ...formData, clientId, contact: formData.contact }; // Include clientId and contact

    try {
        const response = await fetch("http://localhost:8081/appointments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataWithClientId),
        });

        if (!response.ok) {
            throw new Error("Failed to save appointment");
        }

        const result = await response.json();
        console.log("Appointment Submitted:", result);
        alert("Appointment Confirmed!");
        navigate("/clientdashboard");

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
};

  return (
    <div className="appointment-form-container">
      <Sidebar />
      <div className="content">
        {/** Step 1: Date and Time **/}
        {currentStep === 1 && (
          <div>
            <div className="calendar-time-container">
              <Calendar
                availableDates={availableDates}
                onDateSelect={handleDateSelect}
              />
              {selectedDate && (
                <div className="time-slots">
                  <h4>Available Times for {selectedDate}</h4>
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      className={`time-slot ${
                        formData.time === time ? "selected" : ""
                      }`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={nextStep}
              disabled={!formData.date || !formData.time}
            >
              Next
            </button>
          </div>
        )}

        {/** Step 2: Consultation Details **/}
        {currentStep === 2 && (
          <div>
            <div className="form-group">
              <label htmlFor="client">Select Client:</label>
              <select
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  -- Select Client --
                </option>
                {/* Add your client options here */}
                <option value="Client 1">Client 1</option>
                <option value="Client 2">Client 2</option>
                <option value="Client 3">Client 3</option>
                {/* Example, you can dynamically populate this list from an API or local data */}
              </select>
            </div>

            <div className="form-group">
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
                  -- Select Consultation Type --
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
                  <option value="Financial Advisory">Financial Advisory</option>
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
              <div className="form-group">
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

            <div className="form-group">
              <label htmlFor="additionalInfo">Purpose:</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
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
                  -- Select Platform --
                </option>
                <option value="In-Person">In-Person</option>
                <option value="Zoom">Zoom</option>
                <option value="Google Meet">Google Meet</option>
                <option value="Phone Call">Phone Call</option> 
                <option value="Microsoft Teams">Microsoft Teams</option> 
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reminder">Reminder Me:</label>
              <select
                id="reminder"
                name="reminder"
                value={formData.reminder || ""}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  -- Select Reminder Time --
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

            <button onClick={prevStep}>Back</button>
            <button
              onClick={nextStep}
              disabled={
                !formData.consultationType ||
                (formData.consultationType === "Others" &&
                  !formData.otherDetails)
              }
            >
              Next
            </button>
          </div>
        )}

        {/** Step 3: Confirmation **/}
        {currentStep === 3 && (
          <div>
            <p>
            <strong>Client:</strong> {formData.client}
          </p>
            <p>
              <strong>Date:</strong> {formData.date}
            </p>
            <p>
              <strong>Time:</strong> {formData.time}
            </p>
            <p>
              <strong>Consultation Type:</strong> {formData.consultationType}
            </p>
            <p>
              <strong>Additional Info:</strong> {formData.additionalInfo}
            </p>
            <p>
              <strong>Consultation Mode:</strong> {formData.platform}
            </p>
            <p>
              <strong>Reminder:</strong> {formData.reminder}
            </p>
            <button onClick={prevStep}>Back</button>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAppointment;
