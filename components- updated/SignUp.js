import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import { signUp, confirmSignUp } from "@aws-amplify/auth";
import { useNavigate } from "react-router-dom"; // 👈 Used for redirecting after signup
import awsExports from "../aws-exports";
import "./SignUp.css";

Amplify.configure(awsExports);

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "", // ✅ Added for verification
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const navigate = useNavigate(); // 👈 for navigating after successful signup

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    try {
      await signUp({
        username: formData.email, // ✅ Email as username
        password: formData.password,
        attributes: {
          email: formData.email,
          name: formData.name,
        },
      });

      setMessage("You did it! Check your email for the verification code.");
      setIsConfirming(true);
    } catch (error) {
      console.error("Sign-up error:", error);
      setMessage(error.message || "Sign-up failed. Please try again.");
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      if (!formData.email.trim()) {
        setMessage("Email is required for confirmation.");
        return;
      }
      if (!formData.verificationCode.trim()) {
        setMessage("Please enter the verification code.");
        return;
      }

      await confirmSignUp({
        username: formData.email,
        confirmationCode: formData.verificationCode,
      });

      setMessage("Account verified successfully! You can now log in.");
      setIsConfirming(false);
      navigate("/login"); // ✅ Redirect to login page
    } catch (error) {
      console.error("Confirmation error:", error);
      setMessage(error.message || "Verification failed. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) handleSignUp();
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {message && <p className="success-message">{message}</p>}

      {!isConfirming ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

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

          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={errors.confirmPassword ? "error" : ""}
            />
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
          </div>

          <button type="submit">Sign Up</button>
        </form>
      ) : (
        <div>
          <h3>Verify Your Account</h3>
          <p>Enter the verification code sent to your email.</p>
          <input
            type="text"
            placeholder="Enter Code"
            value={formData.verificationCode}
            onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
          />
          <button onClick={handleConfirmSignUp}>Confirm Account</button>
        </div>
      )}
    </div>
  );
};

export default SignUp;
