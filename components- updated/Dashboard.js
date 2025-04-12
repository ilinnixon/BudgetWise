import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { getCurrentUser } from "@aws-amplify/auth";

const Dashboard = () => {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
  });

  // ✅ Get Cognito user ID & email
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await getCurrentUser();
        const sub = user.signInUserSession.idToken.payload.sub;
        const email = user.signInUserSession.idToken.payload.email;
        setUserId(sub);
        setUserEmail(email);
      } catch (error) {
        console.error("Error fetching user ID:", error);
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  // ✅ Fetch user-specific expenses
  useEffect(() => {
    if (!userId) return;

    const fetchExpenses = async () => {
      try {
        const response = await fetch(
          `https://lkvidrpalk.execute-api.eu-north-1.amazonaws.com/prod/getExpense?user_id=${userId}`
        );
        const data = await response.json();
        const parsedBody =
          typeof data.body === "string" ? JSON.parse(data.body) : data.body;

        if (parsedBody?.expenses) {
          setExpenses(parsedBody.expenses);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userId]);

  // ✅ Add user-specific expense
  const handleAddExpense = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: userId,
      ...newExpense,
    };

    try {
      const response = await fetch(
        "https://lkvidrpalk.execute-api.eu-north-1.amazonaws.com/prod/logExpense",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("Expense added:", result);

      setExpenses((prev) => [...prev, newExpense]);
      setNewExpense({ category: "", amount: "", date: "", description: "" });
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + (Number(exp.amount) || 0),
    0
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h2>💰 Budget Dashboard</h2>
      {userEmail && <p><strong>Logged in as:</strong> {userEmail}</p>}

      <div>
        <label><strong>Set Monthly Budget:</strong></label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          placeholder="Enter monthly budget"
        />
      </div>

      <p><strong>Monthly Budget:</strong> ${budget}</p>
      <p><strong>Remaining Balance:</strong> ${budget - totalExpenses}</p>

      <form onSubmit={handleAddExpense} className="add-expense-form">
        <h3>Add New Expense</h3>
        <input
          type="text"
          placeholder="Category"
          value={newExpense.category}
          onChange={(e) =>
            setNewExpense({ ...newExpense, category: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) =>
            setNewExpense({ ...newExpense, amount: e.target.value })
          }
          required
        />
        <input
          type="date"
          value={newExpense.date}
          onChange={(e) =>
            setNewExpense({ ...newExpense, date: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newExpense.description}
          onChange={(e) =>
            setNewExpense({ ...newExpense, description: e.target.value })
          }
        />
        <button type="submit">Add Expense</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="4">No expenses added yet</td>
            </tr>
          ) : (
            expenses.map((expense, index) => (
              <tr key={expense.expense_id || index}>
                <td>{expense.category}</td>
                <td>${expense.amount}</td>
                <td>{expense.date}</td>
                <td>{expense.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
