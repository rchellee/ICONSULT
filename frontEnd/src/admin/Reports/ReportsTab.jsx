import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Sidebar from "../sidebar";
import Topbar from "../Topbar";
import AppointmentReports from "./AppointmentReports";
import ClientReports from "./ClientsReports";
import RevenueReports from "./RevenueReports";
import ProjectReports from "./ProjectReports";
import EmployeeReports from "./EmployeeReports";
import "./ReportsTab.css";

const ReportsTab = () => {
  const [reportType, setReportType] = useState("appointments");


  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="reports-tab-container">
        <div>
          <h4 className="text-xl font-bold mb-4">Reports</h4>

          <div className="flex space-x-4 mb-4">
            <select
              className="border p-2 text-sm w-40 ml-auto"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="appointments">Appointments</option>
              <option value="clients">Clients</option>
              <option value="payments">Revenue</option>
              <option value="projects">Projects</option>
              <option value="employees">Employees</option>
            </select>
          </div>

          {reportType === "appointments" && <AppointmentReports />}
          {reportType === "clients" && <ClientReports />}
          {reportType === "payments" && <RevenueReports />}
          {reportType === "projects" && <ProjectReports />}
          {reportType === "employees" && <EmployeeReports />}
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";
// import Topbar from "../Topbar";
// import Sidebar from "../sidebar";
// import "./ReportsTab.css";
// import ClientReports from "./ClientReports/ClientReports";
// import YearlyProjects from "./YearlyProjects";
// import EmployeeReports from "./EmployeeReports/EmployeeReports";
// import ActiveProjects from "./ActiveProjects";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const ReportsTab = () => {
//   const [dateRange, setDateRange] = useState("This Month");
//   const [isManagementDropdownOpen, setIsManagementDropdownOpen] =
//     useState(false);
//   const [isTimePeriodOpen, setIsTimePeriodOpen] = useState(false);
//   const [isMonthlyHovered, setIsMonthlyHovered] = useState(false);
//   const [selectedManagementOption, setSelectedManagementOption] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [isYearlyBucket, setIsYearlyBucket] = useState(false);
//   const [showChartOptions, setShowChartOptions] = useState(false);
//   const [selectedChartOption, setSelectedChartOption] = useState(null);
//   const [isChartOptionSelect, setIsChartOptionSelect] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [projectData, setProjectData] = useState({
//     monthly: [],
//     weekly: {
//       January: [],
//       February: [],
//       March: [],
//       April: [],
//       May: [],
//       June: [],
//       July: [],
//       August: [],
//       September: [],
//       October: [],
//       November: [],
//       December: [],
//     },
//   });
//   const [error, setError] = useState(null);
//   useEffect(() => {
//     axios
//       .get("http://localhost:8081/projectsReports/monthly")
//       .then((response) => {
//         console.log(response.data);
//         const monthlyData = Array(12).fill(0);
//         const weeklyData = {
//           January: [],
//           February: [],
//           March: [],
//           April: [],
//           May: [],
//           June: [],
//           July: [],
//           August: [],
//           September: [],
//           October: [],
//           November: [],
//           December: [],
//         };

//         if (Array.isArray(response.data)) {
//           response.data.forEach((item) => {
//             const monthIndex = new Date(`${item.month} 1, 2000`).getMonth();
//             monthlyData[monthIndex] = item.project_count;

//             if (item.weekly) {
//               weeklyData[item.month] = item.weekly;
//             }
//           });
//         } else {
//           const { monthly, weekly } = response.data;
//           setProjectData({ monthly, weekly });
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError("Failed to fetch project data. Please try again later.");
//         console.error(err);
//       });
//   }, []);

//   const barChartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: `Projects (${dateRange})`,
//       },
//     },
//   };

//   const handleMonthlyOptionClick = (month) => {
//     setSelectedMonth(month === "Per Month" ? "" : month);
//     setDateRange(month);
//     setIsMonthlyHovered(false); // Close submenu when a month is selected
//     setIsTimePeriodOpen(false); // Close the time period submenu after selection
//     setIsYearlyBucket(false); // Close Yearly Bucket when selecting a time period
//     setIsChartOptionSelect(false);
//   };

//   const handleDropdownClick = () => {
//     setIsTimePeriodOpen(!isTimePeriodOpen);
//   };

//   const handleManagementDropdownClick = () => {
//     setIsManagementDropdownOpen(!isManagementDropdownOpen);
//   };

//   const handleManagementOptionClick = (option) => {
//     setSelectedManagementOption(option);
//     setIsManagementDropdownOpen(false);
//     setIsYearlyBucket(false); // this one para mag close si yearly bucket
//     setIsChartOptionSelect(false);
//   };

//   const handleMonthlyHover = () => {
//     setIsMonthlyHovered(true);
//   };

//   const handleMonthlyLeave = () => {
//     setIsMonthlyHovered(false);
//   };

//   const hideTimePeriodButtons =
//     selectedManagementOption === "Client" ||
//     selectedManagementOption === "Task" ||
//     selectedManagementOption === "Employee" ||
//     selectedManagementOption === "Appointments" ||
//     selectedManagementOption === "Revenue";

//   const handleYearlyBucketClick = () => {
//     setIsYearlyBucket(true);
//     setSelectedManagementOption(""); // Reset management option to avoid confusion
//     setIsTimePeriodOpen(false); // Close time period dropdown
//   };

//   const handleDisplayChartClick = () => {
//     setShowChartOptions(!showChartOptions);
//   };

//   const handleChartOptionSelect = (option) => {
//     setSelectedChartOption(option);
//     setShowChartOptions(false);
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <Topbar />
//       <Sidebar />
//       <div className="reports-tab-container">
//         <div className="reports-header"></div>
//         <div className="management-chart-section">
//           <div className="chart-container">
//             <div className="dropdown-container">
//               <button
//                 className="Management-button"
//                 onClick={handleManagementDropdownClick}
//               >
//                 Management
//               </button>

//               {/* Hide Time Period and Yearly Bucket buttons only when Active Projects is selected */}
//               {selectedChartOption !== "Active Projects" &&
//                 !hideTimePeriodButtons && (
//                   <>
//                     <button
//                       className="Time-button"
//                       onClick={handleDropdownClick}
//                     >
//                       Time Period
//                     </button>
//                     <button onClick={handleYearlyBucketClick}>
//                       Yearly Bucket
//                     </button>
//                   </>
//                 )}

//               {![
//                 "Client",
//                 "Task",
//                 "Employee",
//                 "Appointments",
//                 "Revenue",
//               ].includes(selectedManagementOption) && (
//                 <button
//                   className="Display-Chart-button"
//                   onClick={handleDisplayChartClick}
//                 >
//                   Display Chart
//                 </button>
//               )}
//               {showChartOptions && (
//                 <div className="chart-options-dropdown">
//                   <button
//                     className="chart-option"
//                     onClick={() =>
//                       handleChartOptionSelect("Per Month and Monthly")
//                     }
//                   >
//                     Per Month and Monthly
//                   </button>
//                   <button
//                     className="chart-option"
//                     onClick={() => handleChartOptionSelect("Active Projects")}
//                   >
//                     Active Projects
//                   </button>
//                 </div>
//               )}
//             </div>

//             {isManagementDropdownOpen && (
//               <div className="management-dropdown">
//                 <button
//                   className="dropdown-option"
//                   onClick={() => handleManagementOptionClick("Client")}
//                 >
//                   Client
//                 </button>
//                 <button
//                   className="dropdown-option"
//                   onClick={() => handleManagementOptionClick("Projects")}
//                 >
//                   Projects
//                 </button>
//                 <button
//                   className="dropdown-option"
//                   onClick={() => handleManagementOptionClick("Task")}
//                 >
//                   Task
//                 </button>
//                 <button
//                   className="dropdown-option"
//                   onClick={() => handleManagementOptionClick("Employee")}
//                 >
//                   Employee
//                 </button>
//                 <button
//                   className="dropdown-option"
//                   onClick={() => handleManagementOptionClick("Appointments")}
//                 >
//                   Appointments
//                 </button>
//                 <button
//                   className="dropdown-option"
//                   onClick={() => handleManagementOptionClick("Revenue")}
//                 >
//                   Revenue
//                 </button>
//               </div>
//             )}

//             {isTimePeriodOpen && (
//               <div className="time-period-buttons">
//                 <button
//                   className="time-option"
//                   onClick={() => handleMonthlyOptionClick("Per Month")}
//                 >
//                   Per Month
//                 </button>
//                 <button
//                   className="time-option"
//                   onClick={() => handleMonthlyOptionClick("Monthly")}
//                   onMouseEnter={handleMonthlyHover}
//                   onMouseLeave={handleMonthlyLeave}
//                 >
//                   Monthly
//                 </button>
//               </div>
//             )}

//             {isMonthlyHovered && (
//               <div
//                 className="monthly-options"
//                 onMouseEnter={handleMonthlyHover}
//                 onMouseLeave={handleMonthlyLeave}
//               >
//                 {[
//                   "January",
//                   "February",
//                   "March",
//                   "April",
//                   "May",
//                   "June",
//                   "July",
//                   "August",
//                   "September",
//                   "October",
//                   "November",
//                   "December",
//                 ].map((month) => (
//                   <button
//                     key={month}
//                     className="time-select-option"
//                     onClick={() => handleMonthlyOptionClick(month)}
//                   >
//                     {month}
//                   </button>
//                 ))}
//               </div>
//             )}

//             {isYearlyBucket ? (
//               <YearlyProjects />
//             ) : selectedManagementOption === "Client" ? (
//               <ClientReports />
//             ) : selectedManagementOption === "Employee" ? (
//               <EmployeeReports />
//             ) : selectedChartOption === "Active Projects" ? (
//               <ActiveProjects />
//             ) : selectedMonth && selectedMonth !== "Per Month" ? (
//               <Bar
//                 options={{
//                   responsive: true,
//                   plugins: {
//                     legend: { position: "top" },
//                     title: {
//                       display: true,
//                       text: `Weekly Projects (${selectedMonth})`,
//                     },
//                   },
//                 }}
//                 data={{
//                   labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
//                   datasets: [
//                     {
//                       label: `Projects in ${selectedMonth}`,
//                       data: projectData.weekly[selectedMonth],
//                       backgroundColor: "rgba(99, 132, 255, 0.5)",
//                     },
//                   ],
//                 }}
//                 width={300}
//                 height={100}
//               />
//             ) : (
//               <Bar
//                 options={barChartOptions}
//                 data={{
//                   labels: [
//                     "January",
//                     "February",
//                     "March",
//                     "April",
//                     "May",
//                     "June",
//                     "July",
//                     "August",
//                     "September",
//                     "October",
//                     "November",
//                     "December",
//                   ],
//                   datasets: [
//                     {
//                       label: "Projects per Month",
//                       data: projectData.monthly,
//                       backgroundColor: "rgba(247, 131, 164, 0.5)",
//                     },
//                   ],
//                 }}
//                 width={300}
//                 height={100}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportsTab;