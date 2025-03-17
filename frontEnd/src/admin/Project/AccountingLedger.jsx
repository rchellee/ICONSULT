import React from "react";

const AccountingLedger = ({
  projects,
  filteredProjects,
  formatDate,
  tasksInfo,
  totalTasks,
}) => {
  // Function to calculate total revenue for a project
  const calculateTotalRevenue = (project) => {
    const contractPrice = parseFloat(project.contractPrice) || 0;
    const totalTaskAmount = tasksInfo[project.id]?.total
      ? tasksInfo[project.id].total * 100 // Assuming each task is worth $100 (adjust as needed)
      : 0;
    return contractPrice + totalTaskAmount;
  };

  // Function to calculate total expenses for a project
  const calculateTotalExpenses = (project) => {
    // Add logic to calculate expenses (e.g., labor, materials, etc.)
    return 5000; // Placeholder value
  };

  // Function to calculate net profit for a project
  const calculateNetProfit = (project) => {
    const revenue = calculateTotalRevenue(project);
    const expenses = calculateTotalExpenses(project);
    return revenue - expenses;
  };

  return (
    <div className="accounting-ledger">
      <h2>Accounting Ledger</h2>
      <table className="accounting-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Client</th>
            <th>Total Revenue</th>
            <th>Total Expenses</th>
            <th>Net Profit</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project.id}>
              <td>{project.projectName}</td>
              <td>{project.clientName}</td>
              <td>${calculateTotalRevenue(project).toLocaleString()}</td>
              <td>${calculateTotalExpenses(project).toLocaleString()}</td>
              <td>${calculateNetProfit(project).toLocaleString()}</td>
              <td>{project.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountingLedger;