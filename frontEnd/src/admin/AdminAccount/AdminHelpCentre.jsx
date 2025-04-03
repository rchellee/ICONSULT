import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import NotificationsIcon from "@mui/icons-material/Notifications";
import VideocamIcon from "@mui/icons-material/Videocam";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderIcon from "@mui/icons-material/Folder";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupIcon from "@mui/icons-material/Group";
import DescriptionIcon from "@mui/icons-material/Description";
import ReceiptIcon from "@mui/icons-material/Receipt";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const AdminHelpCentre = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [showMoreFAQs, setShowMoreFAQs] = useState(false);
  const [activeTab, setActiveTab] = useState("consultation");
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/admin");
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    console.log("Search query:", query);
    // Add functionality to handle search (e.g., filter FAQs, tutorials, etc.)
  };

  const handleFAQClick = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleViewMoreFAQs = () => {
    setShowMoreFAQs(!showMoreFAQs);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setExpandedFAQ(null); // Collapse any expanded FAQ when changing tabs
    setShowMoreFAQs(false); // Reset the "View More" state
  };

  const consultationTutorials = {
    consultation: [
      {
        title: "Scheduling Appointments",
        icon: <EventIcon color="primary" />,
        steps: [
          "Navigate to the Calendar section",
          "Click the '+' button or select a time slot",
          "Fill in client details and consultation information",
          "Set the appointment time and date",
          "Confirm the appointment",
        ],
      },
      {
        title: "Managing Time Slots",
        icon: <ScheduleIcon color="primary" />,
        steps: [
          "View available time slots in green",
          "Block unavailable times using the Availability feature",
          "Set your working hours in Settings",
          "Manage buffer times between appointments",
        ],
      },
      {
        title: "Client Management",
        icon: <PersonAddIcon color="primary" />,
        steps: [
          "Add new clients through the Clients section",
          "View client history before scheduling",
          "Set up client profiles with all necessary details",
          "Manage client preferences and notes",
        ],
      },
      {
        title: "Reminders & Notifications",
        icon: <NotificationsIcon color="primary" />,
        steps: [
          "Set automatic reminders for appointments",
          "Configure notification preferences",
          "Send confirmation emails to clients",
          "Set up custom reminder times",
        ],
      },
      {
        title: "Virtual Consultations",
        icon: <VideocamIcon color="primary" />,
        steps: [
          "Select virtual platform when creating appointment",
          "Generate meeting links automatically",
          "Send platform instructions to clients",
          "Test your audio/video setup beforehand",
        ],
      },
    ],
    project: [
      {
        title: "Creating Projects",
        icon: <EventIcon color="primary" />,
        steps: [
          "Click 'New Project' from the project list",
          "Select a client from your existing clients",
          "Set realistic start and end dates",
          "Add a clear description of project scope",
          "Save and proceed to add tasks",
        ],
      },
      {
        title: "Task Management",
        icon: <AssignmentIcon color="primary" />,
        steps: [
          "Create tasks with clear names and fees",
          "Assign to appropriate team members",
          "Set due dates within project timeframe",
          "Add miscellaneous items as needed",
          "Monitor completion in Transactions tab",
        ],
      },
      {
        title: "Document Organization",
        icon: <FolderIcon color="primary" />,
        steps: [
          "Use the Documents tab for all project files",
          "Upload contracts, deliverables, and notes",
          "Name files clearly (e.g., 'Contract_2023-11-15')",
          "Group related files together",
          "Download previous versions when needed",
        ],
      },
      {
        title: "Financial Tracking",
        icon: <AttachMoneyIcon color="primary" />,
        steps: [
          "Mark tasks as Paid when completed",
          "Record transaction IDs for accounting",
          "View balances in Transaction view",
          "Generate financial reports as needed",
          "Reconcile payments regularly",
        ],
      },
      {
        title: "Team Collaboration",
        icon: <GroupIcon color="primary" />,
        steps: [
          "Assign tasks based on employee skills",
          "Monitor workloads in Team Dashboard",
          "Use status updates to track progress",
          "Communicate via integrated tools",
          "Review completed work quality",
        ],
      },
    ],
    payments: [
      {
        title: "Recording Payments",
        icon: <AttachMoneyIcon color="primary" />,
        steps: [
          "Navigate to the project containing the task",
          "Click 'Mark as Paid' on completed tasks",
          "Enter transaction details (ID, payment method, date)",
          "Alternatively, edit the task to add payment details",
          "Verify amount matches the task fee",
          "Save to update accounting records automatically",
        ],
      },
      {
        title: "Viewing Transactions",
        icon: <ReceiptIcon color="primary" />,
        steps: [
          "Go to the Project section and select your project",
          "Click on the 'Transactions' tab inside the project",
          "This will show all payments for the project",
          "You can also access the full Accounting Ledger from here",
          "Use filters to find specific transactions",
        ],
      },
      {
        title: "Generating Invoices",
        icon: <DescriptionIcon color="primary" />,
        steps: [
          "Go to the Payments section in the Reports Tab",
          "Select 'project' for the desired client",
          "Review included tasks and amounts",
          "Export as PDF or CSV",
        ],
      },
      {
        title: "Marking Tasks as Paid",
        icon: <CheckCircleIcon color="primary" />,
        steps: [
          "Locate the task in the project's task list",
          "Click 'Edit' on the completed task",
          "Fill in the payment details section",
          "Enter Transaction ID (letters and numbers only)",
          "Select Mode of Payment (Cash, Cheque, Online)",
          "Set the Paid Date",
          "Save to mark the task as completed and paid",
        ],
      },
      {
        title: "Payment Reconciliation",
        icon: <ReceiptIcon color="primary" />,
        steps: [
          "Access the Accounting Ledger from projects section",
          "Filter payments by date range, project or client",
          "Match system records with bank statements",
        ],
      },
    ],
  };

  const faqCategories = {
    consultation: [
      {
        question: "How can I schedule an appointment for a client?",
        answer:
          "Navigate to the Calendar section and click 'Add Appointment'. Select the client from your list, choose a date and time, and fill in the consultation details. The system will automatically check for availability and send confirmation.",
      },
      {
        question: "How do I reschedule or cancel an appointment?",
        answer:
          "In the Calendar view, click on the appointment you wish to modify. You'll see options to reschedule or cancel. The client will automatically receive a notification of the change.",
      },
      {
        question: "How do I set custom reminders for appointments?",
        answer:
          "When creating or editing an appointment, you'll find a 'Set Reminder' option. You can choose from preset times (1 hour, 1 day before) or set a custom date and time for the reminder.",
      },
      {
        question: "Can I block off time slots when I'm unavailable?",
        answer:
          "Yes, in the Calendar view, click 'Add Unavailable Time' and select the time period you wish to block. The system will prevent appointments from being scheduled during these periods.",
      },
      {
        question: "How do I navigate between different calendar views?",
        answer:
          "Use the view buttons in the top right corner to switch between Day, Week, Month, and List views. Each view shows appointments in a different format suitable for various needs.",
      },
      {
        question: "How can I see all appointments for a specific date?",
        answer:
          "Click on any date in the Month view or use the Day/Week views to see all appointments for that time period. The sidebar will also display detailed information for the selected date.",
      },
      {
        question: "What do the different colors in the calendar represent?",
        answer:
          "Available time slots are shown in green, booked appointments in blue, and unavailable/blocked times in gray. Fully booked days are marked with a special indicator.",
      },
      {
        question: "How do I add a new appointment from the calendar view?",
        answer:
          "Click the '+' button in the bottom right corner, then select 'Appointment'. You can also click directly on a time slot in Day/Week views to start creating an appointment.",
      },
      {
        question: "How can I quickly check an appointment's details?",
        answer:
          "Hover over any appointment in the calendar to see a popup with basic information. Click on the appointment to see full details in the sidebar.",
      },
      {
        question: "What happens when I delete an appointment?",
        answer:
          "Deleting an appointment removes it permanently from the system. The client will receive a cancellation notification if their contact information is available.",
      },
      {
        question: "How do I set my availability in the calendar?",
        answer:
          "Click the '+' button and select 'Availability'. Use the availability calendar to mark dates and times when you're available for appointments.",
      },
      {
        question: "Can I filter appointments in the calendar?",
        answer:
          "Yes, use the search field to filter appointments by client name, consultation type, or other criteria. The list view also supports filtering and sorting.",
      },
    ],
    project: [
      {
        question: "How do I create a new project for a client?",
        answer:
          "Go to the Projects section and click 'Add New Project'. Select the client, enter project details, set milestones, and assign team members as needed.",
      },
      {
        question: "How can I track project progress?",
        answer:
          "Each project has a dashboard showing completion status, upcoming milestones, and task assignments. You can also generate progress reports from the Reports section.",
      },
      {
        question: "How do I create a new project?",
        answer:
          "Navigate to Projects > click 'New Project' button > Fill in project details (name, client, dates, description) > Click 'Create'. You can assign tasks and upload documents after creation.",
      },
      {
        question: "How do I assign tasks to a project?",
        answer:
          "From the Project view, click 'Create Task' > Enter task details (name, fee, due date) > Assign to an employee > Add any miscellaneous items > Save. Tasks appear in the project's task list.",
      },
      {
        question: "What are miscellaneous items in tasks?",
        answer:
          "Miscellaneous items are additional expenses or sub-tasks within a main task. Add them by clicking the '+' button next to the miscellaneous fields when creating/editing a task.",
      },
      {
        question: "How do I track project progress?",
        answer:
          "The system automatically calculates progress based on completed tasks. View overall progress in the project list or detailed task completion in the project's Transactions tab.",
      },
      {
        question: "How do I update a project's status?",
        answer:
          "In the project list, use the status dropdown to change between Pending, Ongoing, and Completed. Status affects project filtering and visual indicators.",
      },
      {
        question: "How do I manage project documents?",
        answer:
          "Switch to the 'Documents' tab within a project to upload files. Supported formats include PDF, Word, Excel, and images. Organize files with clear naming conventions.",
      },
      {
        question: "How do project payments work?",
        answer:
          "Each task can be marked as Paid by editing the task > entering payment details (transaction ID, mode, date). The system tracks paid amounts and calculates balances automatically.",
      },
      {
        question: "Can I edit a project after creation?",
        answer:
          "Yes, click the edit icon on any project to modify its details. Note that changing dates may affect task due dates and project timeline.",
      },
      {
        question: "How do I filter and sort projects?",
        answer:
          "Use the Status dropdown to filter by project state. The Sort button lets you order projects by name, date, or progress. Filters persist across sessions.",
      },
      {
        question: "What happens when I delete a project?",
        answer:
          "Deleting a project removes it and all associated tasks permanently. You'll be asked to confirm before deletion. Consider marking as Completed instead if you need records.",
      },
      {
        question: "How do I view financial summaries for projects?",
        answer:
          "Switch to the Accounting view to see total amounts, paid sums, and balances across all projects. Drill into individual projects for detailed financial breakdowns.",
      },
      {
        question: "How do task due dates relate to project dates?",
        answer:
          "Task due dates should fall within the project's start/end dates. The system highlights overdue tasks in red and shows completion percentages for timeline tracking.",
      },
    ],
    payments: [
      {
        question: "How do I record a payment from a client?",
        answer:
          "Navigate to the project containing the completed task, click 'Mark as Paid', and enter the payment details including transaction ID, payment method (Cash, Cheque, Online Payment), and payment date. The system will automatically update the accounting records.",
      },
      {
        question: "Can I generate invoices through the system?",
        answer:
          "Yes, you can generate professional invoices directly from the Payments section. The system automatically includes all outstanding tasks and fees for the selected client. You can customize the invoice with your logo, add notes, and export as PDF or send directly via email.",
      },
      {
        question: "How do I handle partial payments for a task?",
        answer:
          "For partial payments, mark the task as partially paid and specify the amount received. The system will track the remaining balance and automatically update the client's outstanding amount. You can add multiple partial payments until the full amount is settled.",
      },
      {
        question: "What payment methods are supported?",
        answer:
          "The system supports Cash, Cheque, Bank Transfer, and Online Payments (GCash, PayMaya, PayPal). Each payment method is tracked separately in the accounting reports for easy reconciliation.",
      },
      {
        question: "How can I view a client's payment history?",
        answer:
          "Go to the client's profile and select the 'Payment History' tab. You'll see a complete record of all payments including dates, amounts, payment methods, and associated tasks. You can filter by date range or export the data for accounting purposes.",
      },
      {
        question: "What should I do if a payment is recorded incorrectly?",
        answer:
          "If a payment was recorded incorrectly, you can edit the payment details within 24 hours. For older transactions, create a reversing entry and record the correct payment. The system maintains an audit trail of all corrections.",
      },
      {
        question: "How are taxes handled in the payment system?",
        answer:
          "The system can automatically calculate taxes based on your settings. You can configure tax rates (VAT, withholding tax, etc.) in the Accounting Settings. Taxes appear as separate line items on invoices and are included in financial reports.",
      },
      {
        question: "Can I set up recurring payments or payment plans?",
        answer:
          "Yes, for clients with payment plans, you can set up recurring payment schedules. The system will automatically generate reminders and track installment payments against the total amount due.",
      },
    ],
    client: [
      {
        question: "How can I add a new client to the system?",
        answer:
          "Go to the Clients section and click 'Add New Client'. Fill in the required details including name, contact information, and company details. The system will automatically generate a client profile.",
      },
      {
        question: "How can I view a client's appointment history?",
        answer:
          "In the Client Profile section, select the client and navigate to the 'Appointment History' tab. You'll see a complete record of past and upcoming appointments with details about each consultation.",
      },
    ],
    employees: [
      {
        question: "How do I assign tasks to other team members?",
        answer:
          "In the Team section, select 'Assign Task'. Choose the team member, set priority and deadline, and add any relevant notes or files. The assignee will receive a notification.",
      },
      {
        question: "How can I view my team's workload?",
        answer:
          "The Team Dashboard shows each member's current assignments, upcoming deadlines, and availability. You can filter by date range or project.",
      },
    ],
    reports: [
      {
        question: "How do I generate reports for client consultations?",
        answer:
          "Navigate to the Reports section and select 'Consultation Report'. You can filter by date range, client, or consultant. The system can generate PDF or Excel reports.",
      },
      {
        question: "What types of financial reports are available?",
        answer:
          "The system offers revenue reports, outstanding payments, and expense tracking. All reports can be customized with date ranges and filtered by client or service type.",
      },
    ],
  };

  return (
    <Container>
      <Button
        variant="outlined"
        color="primary"
        sx={{ marginTop: 3 }}
        onClick={handleGoBack}
      >
        back
      </Button>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Help Centre
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          Welcome to the Help Centre! Explore the sections below for assistance.
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for help..."
          sx={{ marginBottom: 1 }}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Consultation" value="consultation" />
          <Tab label="Project" value="project" />
          <Tab label="Payments" value="payments" />
          <Tab label="Client" value="client" />
          <Tab label="Employees" value="employees" />
          <Tab label="Reports" value="reports" />
        </Tabs>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {/* FAQ Section */}
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} FAQs
              </Typography>
              <Typography variant="body2" gutterBottom>
                Find answers to common questions about {activeTab} management.
              </Typography>

              {/* Display FAQs for the selected category */}
              {faqCategories[activeTab]
                .slice(0, showMoreFAQs ? faqCategories[activeTab].length : 2)
                .map((faq, index) => (
                  <Box key={index} sx={{ marginTop: index > 0 ? 2 : 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                      onClick={() => handleFAQClick(index)}
                    >
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {index + 1}. {faq.question}
                      </Typography>
                      <IconButton>
                        <ExpandMoreIcon />
                      </IconButton>
                    </Box>
                    {expandedFAQ === index && (
                      <Typography variant="body2" sx={{ marginLeft: 2 }}>
                        {faq.answer}
                      </Typography>
                    )}
                  </Box>
                ))}

              {/* Show "View More" button if there are more FAQs in this category */}
              {faqCategories[activeTab].length > 2 && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleViewMoreFAQs}
                  sx={{ mt: 2 }}
                >
                  {showMoreFAQs ? "Show Fewer FAQs" : "View More FAQs"}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tutorials Section */}
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Tutorials
              </Typography>

              {activeTab === "consultation" && (
                <List sx={{ width: "100%" }}>
                  {consultationTutorials.consultation.map((tutorial, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemIcon>{tutorial.icon}</ListItemIcon>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {tutorial.title}
                          </Typography>
                          <List
                            component="ol"
                            sx={{ listStyleType: "decimal", pl: 2 }}
                          >
                            {tutorial.steps.map((step, stepIndex) => (
                              <ListItem
                                key={stepIndex}
                                sx={{ display: "list-item", p: 0 }}
                              >
                                <Typography variant="body2">{step}</Typography>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </ListItem>
                      {index <
                        consultationTutorials.consultation.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}

              {activeTab === "project" && (
                <List sx={{ width: "100%" }}>
                  {consultationTutorials.project.map((tutorial, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemIcon>{tutorial.icon}</ListItemIcon>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {tutorial.title}
                          </Typography>
                          <List
                            component="ol"
                            sx={{ listStyleType: "decimal", pl: 2 }}
                          >
                            {tutorial.steps.map((step, stepIndex) => (
                              <ListItem
                                key={stepIndex}
                                sx={{ display: "list-item", p: 0 }}
                              >
                                <Typography variant="body2">{step}</Typography>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </ListItem>
                      {index < consultationTutorials.project.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}

              {activeTab === "payments" && (
                <List sx={{ width: "100%" }}>
                  {consultationTutorials.payments.map((tutorial, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemIcon>{tutorial.icon}</ListItemIcon>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {tutorial.title}
                          </Typography>
                          <List
                            component="ol"
                            sx={{ listStyleType: "decimal", pl: 2 }}
                          >
                            {tutorial.steps.map((step, stepIndex) => (
                              <ListItem
                                key={stepIndex}
                                sx={{ display: "list-item", p: 0 }}
                              >
                                <Typography variant="body2">{step}</Typography>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </ListItem>
                      {index < consultationTutorials.payments.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}

              {!["consultation", "project"].includes(activeTab) && (
                <Typography variant="body2" gutterBottom>
                  Learn how to use our {activeTab} features and make the most
                  out of your experience.
                </Typography>
              )}

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Explore {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Tutorials
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 6, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Need More Help?
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          We're here to assist you! Feel free to browse our resources.
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminHelpCentre;
