import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { signOut } from "aws-amplify/auth"; // ✅ logout method
import awsExports from "../aws-exports";

Amplify.configure(awsExports);

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(); // ✅ Perform logout
        navigate("/login"); // ✅ Redirect to login
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    handleLogout(); // 🔁 Call logout immediately
  }, [navigate]);

  return (
    <div className="logout-container">
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
