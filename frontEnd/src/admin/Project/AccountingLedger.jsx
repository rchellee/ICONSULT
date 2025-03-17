import React from "react";
import "./AccountingLedger.css"; 

const AccountingLedger = ({
  projects,
  filteredProjects,
  formatDate,
  tasksInfo,
  totalTasks,
}) => {

  const generateTransactionId = () => {
    return `TX${Math.floor(Math.random() * 1000000)}`;
  };

  const generateModeOfPayment = () => {
    const modes = ["Cheque", "Online", "Cash", "Credit Card"];
    return modes[Math.floor(Math.random() * modes.length)];
  };

  const formatAmount = (amount) => {
    return `₱${parseFloat(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Calculate the total amount for all projects
  const calculateGrandTotal = () => {
    let total = 0;
    filteredProjects.forEach((project) => {
      total += parseFloat(project.contractPrice) || 0;
      total += parseFloat(tasksInfo[project.id]?.total) || 0;
    });
    return total;
  };

  return (
    <div className="accounting-ledger">
      <h2>Accounting Ledger</h2>
      <div className="">
        <table className="accounting-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Transaction ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date Paid</th>
              <th>Mode of Payment (MOA)</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => {
              // Calculate subtotal for the current project
              const professionalFee = parseFloat(project.contractPrice) || 0;
              const taskAmount = parseFloat(tasksInfo[project.id]?.total) || 0;
              const subtotal = professionalFee + taskAmount;

              return (
                <React.Fragment key={project.id}>
                  {/* Row for Professional Fee */}
                  <tr>
                    <td>{project.projectName}</td>
                    <td>{generateTransactionId()}</td>
                    <td>Professional Fee</td>
                    <td>{formatAmount(professionalFee)}</td>
                    <td>{formatDate(new Date())}</td>
                    <td>{generateModeOfPayment()}</td>
                  </tr>
                  {/* Row for Task */}
                  <tr>
                    <td></td> 
                    <td></td> 
                    <td>Task1</td>
                    <td>{formatAmount(taskAmount)}</td>
                    <td>{formatDate(new Date())}</td>
                    <td>{generateModeOfPayment()}</td>
                  </tr>
                  {/* Subtotal Row for the Project */}
                  <tr className="subtotal-row">
                    <td colSpan="3"></td> 
                    <td>{formatAmount(subtotal)}</td>
                    <td colSpan="2"></td> 
                  </tr>
                </React.Fragment>
              );
            })}
            {/* Grand Total Row */}
            <tr className="grand-total-row">
              <td colSpan="3">Total</td>
              <td>{formatAmount(calculateGrandTotal())}</td>
              <td colSpan="2"></td> 
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountingLedger;