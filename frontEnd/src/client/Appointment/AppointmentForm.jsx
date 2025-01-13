import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";
import "./appointment.css";
import DynamicCalendar from "./DynamicCalendar";
import Topbar from "../Topbar";

function AppointmentForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [timePeriod, setTimePeriod] = useState("");
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    consultationType: "",
    otherDetails: "",
    additionalInfo: "",
    platform: "",
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
      // console.log(clientData);
      setClients(clientData);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await fetch("http://localhost:8081/availability");
      if (!response.ok) throw new Error("Failed to fetch availability data");
      const data = await response.json();

      const formattedData = {};
      data.forEach((entry) => {
        formattedData[entry.dates] = entry.status || "available";
      });

      return formattedData; // Return formatted data
    } catch (error) {
      console.error("Error fetching availability data:", error);
      return {}; // Return empty object on error
    }
  };

  useEffect(() => {
    const loadAvailability = async () => {
      const counts = await fetchAppointmentCounts();
      const availability = await fetchAvailability(); // Await result

      Object.entries(counts).forEach(([date, count]) => {
        availability[date] = count < 3 ? "available" : "fully-booked";
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
    setSelectedDate(date);
    setFormData({ ...formData, date });

    try {
      const response = await fetch(
        `http://localhost:8081/appointments-client/times?date=${date}`
      );
      if (!response.ok) throw new Error("Failed to fetch booked times");

      const { bookedTimes, start_time, end_time } = await response.json();
      const blockedTimes = new Set(bookedTimes);

      const startIndex = times.indexOf(start_time);
      const endIndex = times.indexOf(end_time);

      const filteredTimes =
      startIndex !== -1 && endIndex !== -1
        ? times.slice(startIndex, endIndex + 1)
        : times;

      bookedTimes.forEach((bookedTime) => {
        const bookedIndex = times.indexOf(bookedTime);
        if (bookedIndex !== -1) {
          if (bookedIndex - 1 >= 0) {
            blockedTimes.add(times[bookedIndex - 1]);
          }
          blockedTimes.add(bookedTime);
          if (bookedIndex + 1 < times.length) {
            blockedTimes.add(times[bookedIndex + 1]);
          }
        }
      });

      const updatedTimes = filteredTimes.map((time) => ({
        time,
        isBooked: blockedTimes.has(time),
      }));

      setAvailableTimes(updatedTimes);
    } catch (error) {
      console.error("Error fetching times for date:", error);
      setAvailableTimes(times.map((time) => ({ time, isBooked: false })));
    }
  };

  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
    setFormData({ ...formData, time: "" });
  };

  const handleTimeSelect = (time) => {
    setFormData((prevData) => ({ ...prevData, time }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => {
    const stepFields = {
      1: ["date", "time"],
      2: ["consultationType"],
    };

    const missingFields = stepFields[currentStep].filter((field) => {
      if (field === "consultationType") {
        return (
          !formData[field] ||
          (formData[field] === "Others" && !formData.otherDetails)
        );
      }
      return !formData[field];
    });

    if (missingFields.length > 0) {
      const missingFieldNames = missingFields
        .map((field) => {
          switch (field) {
            case "date":
              return "Date";
            case "time":
              return "Time";
            case "consultationType":
              return "Consultation Type";
            case "otherDetails":
              return "Other Details";
            default:
              return field;
          }
        })
        .join(", ");

      alert(`Please fill out the following fields: ${missingFieldNames}`);
      return;
    }

    setCurrentStep((prevStep) => prevStep + 1);
  };
  const prevStep = () => setCurrentStep((prevStep) => prevStep - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientId = localStorage.getItem("clientId");

    if (!clientId) {
      alert("Client ID not found. Please log in.");
      return;
    }

    const selectedClient = clients.find(
      (client) => client.id === parseInt(clientId)
    );

    if (!selectedClient) {
      alert(
        "Client not found. Please ensure your account is linked to a valid client record."
      );
      return;
    }

    const consultationType =
      formData.consultationType === "Others"
        ? formData.otherDetails
        : formData.consultationType;

    const formDataWithClientDetails = {
      ...formData,
      consultationType,
      clientId,
      name: `${selectedClient.firstName} ${selectedClient.lastName}`,
      email: selectedClient.email_add,
      contact: selectedClient.mobile_number,
      companyName: selectedClient.companyName,
      postedBy: "client",
    };

    try {
      const response = await fetch("http://localhost:8081/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithClientDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to save appointment");
      }

      const result = await response.json();
      console.log("Appointment Submitted:", result);
      alert("Appointment Confirmed!");
      navigate("/consultations");

      setCurrentStep(1);
      setFormData({
        date: "",
        time: "",
        consultationType: "",
        otherDetails: "",
        additionalInfo: "",
        platform: "",
        reminder: "",
      });
    } catch (error) {
      console.error("Error submitting appointment:", error);
      alert("Error submitting appointment. Please try again.");
    }
  };

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="appointment-form-container">
        <div className="content-calendar">
          {currentStep === 1 && (
            <div>
              <h3>Select date and time for consulation</h3>
              <div className="calendar-time-container">
                <DynamicCalendar
                  availableDates={availableDates}
                  onDateSelect={handleDateSelect}
                />
                {selectedDate && (
                  <div className="time-slots">
                    Available time for{" "}
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    <div className="time-dropdowns">
                      <label htmlFor="timePeriod" className="required-label">
                        AM/PM *
                      </label>
                      <select
                        id="timePeriod"
                        value={timePeriod}
                        onChange={handleTimePeriodChange}
                      >
                        <option value="" disabled>
                          -- Select --
                        </option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    {timePeriod && (
                      <div className="time-dropdowns">
                        <label htmlFor="time" className="required-label">
                          Select Time *
                        </label>
                        <select
                          id="time"
                          value={formData.time}
                          onChange={(e) => handleTimeSelect(e.target.value)}
                          disabled={!timePeriod}
                        >
                          <option value="" disabled>
                            -- Select Time --
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
                      </div>
                    )}
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
          {currentStep === 2 && (
            <div>
              <h3>Step 2: Consultation Details</h3>
              <div className="form-group">
                <label htmlFor="consultationType" className="required-label">
                  Consultation Type *
                </label>
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
                  <option value="Video Call">Zoom</option>
                  <option value="Video Call">Google Meet</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Phone Call">Microsoft Teams</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reminder">Remind Me:</label>
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

          {/** Step 4: Confirmation **/}
          {currentStep === 3 && (
            <div>
              <h3>Step 3: Confirmation</h3>
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
    </div>
  );
}

export default AppointmentForm;
