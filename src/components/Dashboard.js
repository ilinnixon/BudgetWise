import React, { useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [budget, setBudget] = useState(0); // Start with 0 budget
  const [expenses, setExpenses] = useState([]); // Empty expenses

  return (
    <div className="dashboard">
      <h2>💰 Budget Dashboard</h2>
      <p><strong>Monthly Budget:</strong> ${budget}</p>
      <p><strong>Remaining Balance:</strong> ${budget}</p> {/* No expenses yet */}

      <input
        type="number"
        placeholder="Enter monthly budget"
        onChange={(e) => setBudget(Number(e.target.value))}
      />
      <button>Set Budget</button>

      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {/* No expenses initially */}
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="3">No expenses added yet</td>
            </tr>
          ) : (
            expenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.category}</td>
                <td>${expense.amount}</td>
                <td>{expense.date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
