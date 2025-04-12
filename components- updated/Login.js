import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { Amplify } from "aws-amplify";
import * as Auth from "aws-amplify/auth"; // ✅ Correct import
import awsExports from "../aws-exports";
import "./Login.css";

Amplify.configure(awsExports);

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await Auth.signIn({ username: formData.email, password: formData.password }); // ✅ Ensure username is email
      setMessage("Login successful! Redirecting...");

      setTimeout(() => navigate("/dashboard"), 2000); // ✅ Redirect to Dashboard
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={errors.password ? "error" : ""}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        <button type="submit">Login</button>

        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
