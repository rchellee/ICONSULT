import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./Login/LoginForm";
import AdminHomePage from "./admin/AdminHomePage";
import ClientDashboard from "./client/ClientDashboard";
import LandingPage from "../src/Landingpage.jsx";
import ProjectManagement from "./admin/Project/ProjectManagement";
import ClientManagement from "./admin/Client/ClientManagement.jsx";
import EmployeeManagement from "./admin/Employee/EmployeeManagement.jsx";
import AppointmentForm from "./client/Appointment/AppointmentForm.jsx";
import Project from "./client/project/Project.jsx";
import DateofAppointments from "./admin/Calendar/fullcalendar.jsx";
import Consultation from "./client/Consultation/Consultation.jsx";
import AccountSettings from "./client/AccountSettings/AccountSettings.jsx";
import Payment from "./client/project/payment.jsx";
import Notification from "./admin/Notification/Notification.jsx";
import Appointment from "./admin/Calendar/AdminAppointment.jsx";
import Availability from "./admin/Calendar/Availability";
import ChangePassword from "./Login/ChangePassword.jsx";
import Transactions from "./admin/Transaction/transactions.jsx";
import Transaction from "./client/Transactions/transaction.jsx";
import ClientNotification from "./client/Notification/ClientNotification.jsx";
import Tracking from "./client/project/tracking.jsx";
import ProjectTask from "./admin/Project/ProjectTask.jsx";
import Review from "./client/Feedback/Review.jsx";
import HelpCentre from "./client/HelpCentre.jsx";
import OtpVerification from "./Login/OtpVerification.jsx";
import Reset from "./Login/Reset.jsx";
import ReportsTab from "./admin/Reports/ReportsTab.jsx";
import AdminAccount from "./admin/AdminAccount/AdminAccount.jsx";
import AdminReview from "./admin/AdminAccount/adminReview.jsx";

// for google icons
const link = document.createElement("link");
link.href =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
link.rel = "stylesheet";
document.head.appendChild(link);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/project" element={<ProjectManagement />} />
        <Route path="/clients" element={<ClientManagement />} />
        <Route path="/clientdashboard" element={<ClientDashboard />} />
        <Route path="/employee" element={<EmployeeManagement />} />
        <Route path="/appointments/new" element={<AppointmentForm />} />
        <Route path="/clientproject" element={<Project />} />
        <Route path="/calendar" element={<DateofAppointments />} />
        <Route path="/consultations" element={<Consultation />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transact" element={<Transaction />} />
        <Route path="/client-notif" element={<ClientNotification />} />
        <Route path="/tracking/:projectId" element={<Tracking />} />
        <Route path="/projecttask" element={<ProjectTask />} />
        <Route path="/review" element={<Review />} />
        <Route path="/help-centre" element={<HelpCentre />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/reset-password" element={<Reset />} />
        <Route path="/reports" element={<ReportsTab />} />
        <Route path="/admin-settings" element={<AdminAccount />} />
        <Route path="/admin-reviews" element={<AdminReview />} />
      </Routes>
    </Router>
  );
}

export default App;
