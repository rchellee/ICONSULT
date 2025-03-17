import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import "./AccountingLedger.css";

const AccountingLedger = ({
  projects,
  filteredProjects,
  formatDate,
  tasksInfo,
  totalTasks,
}) => {
  const tableRef = useRef(null); // Ref to measure the table height
  const [tableHeight, setTableHeight] = useState(0); // State to store the table height

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

  const calculateGrandTotal = () => {
    let total = 0;
    filteredProjects.forEach((project) => {
      total += parseFloat(project.contractPrice) || 0;
      total += parseFloat(tasksInfo[project.id]?.total) || 0;
    });
    return total;
  };

  useLayoutEffect(() => {
    if (tableRef.current) {
      setTableHeight(tableRef.current.offsetHeight);
    }
  }, [filteredProjects]);

  return (
    <div className="accounting-ledger">
      <h2>Accounting Ledger</h2>
      <div className="accounting-scroll" style={{ maxHeight: "400px", overflowY: "auto" }}>
        <table className="accounting-table" ref={tableRef}>
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
              const professionalFee = parseFloat(project.contractPrice) || 0;
              const taskAmount = parseFloat(tasksInfo[project.id]?.total) || 0;
              const subtotal = professionalFee + taskAmount;

              return (
                <React.Fragment key={project.id}>
                  <tr>
                    <td>{project.projectName}</td>
                    <td>{generateTransactionId()}</td>
                    <td>Professional Fee</td>
                    <td>{formatAmount(professionalFee)}</td>
                    <td>{formatDate(new Date())}</td>
                    <td>{generateModeOfPayment()}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Task</td>
                    <td>{formatAmount(taskAmount)}</td>
                    <td>{formatDate(new Date())}</td>
                    <td>{generateModeOfPayment()}</td>
                  </tr>
                  <tr className="subtotal-row">
                    <td colSpan="3"></td>
                    <td>{formatAmount(subtotal)}</td>
                    <td colSpan="2"></td>
                  </tr>
                </React.Fragment>
              );
            })}
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

/* Updated CSS */
.accounting-ledger {
  position: relative;
}

.accounting-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 18px;
  table-layout: fixed;
  height: auto;
  position: relative;
  display: block;
}

.accounting-table th,
.accounting-table td {
  padding: 3px 10px;
  border: none;
  font-size: 15px;
}

.accounting-scroll {
  overflow-y: auto;
  max-height: 400px;
  margin-top: 40px;
  margin-left: 125px;
  margin-right: 125px;
  border-radius: 10px;
  background-color: transparent;
  padding: 10px;
  border: none;
}

.accounting-scroll::-webkit-scrollbar {
  width: 12px;
}

.accounting-scroll::-webkit-scrollbar-track {
  background: #ccc;
  border-radius: 10px;
}

.accounting-scroll::-webkit-scrollbar-thumb {
  background-color: #547099;
  border-radius: 10px;
}

.accounting-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #365673;
}
