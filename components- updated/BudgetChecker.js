import React, { useState } from "react";
import "./BudgetChecker.css";
import { getUserId } from "../auth";

const BudgetChecker = () => {
  const [image, setImage] = useState(null);
  const [itemName, setItemName] = useState("");
  const [fetchedPrice, setFetchedPrice] = useState(null);
  const [editedPrice, setEditedPrice] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [affordabilityResult, setAffordabilityResult] = useState(null);

  const handleImageUpload = async (event) => {
    console.log("📸 Image upload triggered");

    const file = event.target.files[0];
    if (!file) {
      console.warn("⚠️ No file selected");
      return;
    }

    try {
      const userId = await getUserId();
      if (!userId) {
        alert("User not logged in");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        const base64 = reader.result.split(",")[1]; // remove base64 prefix
        const payload = {
          image: base64,
          filename: file.name,
          userId,
        };

        console.log("📤 Sending payload:", payload);

        const response = await fetch(
          "https://w6vvimac5l.execute-api.eu-north-1.amazonaws.com/prod/upload",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        console.log("📩 Response status:", response.status);

        const text = await response.text();
        console.log("📦 Raw response text:", text);

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.error("❌ Failed to parse JSON:", err);
          alert("Server response was invalid.");
          return;
        }

        if (response.ok) {
          setImage(URL.createObjectURL(file));
          setShowOptions(true);
          setFetchedPrice(data?.price ?? 100);
          setEditedPrice(data?.price ?? 100);
          setItemName(data?.itemName ?? "Item");
          console.log("✅ Image upload successful. Parsed data:", data);
        } else {
          alert("Image upload failed.");
          console.error("❌ API error:", data);
        }
      };
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("An error occurred during upload.");
    }
  };

  const handleLogExpense = () => {
    setShowOptions(false);
    setShowExpenseForm(true);
  };

  const handleCheckAffordability = () => {
    const userBudget = 500; // Replace with actual budget logic later
    if (fetchedPrice <= userBudget) {
      setAffordabilityResult("✅ You can afford this item!");
    } else {
      setAffordabilityResult("❌ This item exceeds your budget.");
    }
    setShowOptions(false);
  };

  return (
    <div className="budget-checker-container">
      <h2>Item Budget Checker</h2>

      {!image && (
        <div className="upload-box">
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
      )}

      {image && (
        <>
          <img src={image} alt="Uploaded Item" className="uploaded-image" />

          {showOptions && (
            <div className="options">
              <button className="log-expense-btn" onClick={handleLogExpense}>
                Log as an Expense
              </button>
              <button className="check-afford-btn" onClick={handleCheckAffordability}>
                Check Affordability
              </button>
            </div>
          )}

          {showExpenseForm && (
            <div className="expense-form">
              <label>Item Name:</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Enter item name"
              />

              <label>Price:</label>
              <input
                type="number"
                value={editedPrice}
                onChange={(e) => setEditedPrice(Number(e.target.value))}
              />

              <button className="save-btn">Save Expense</button>
            </div>
          )}

          {affordabilityResult && (
            <div className="affordability-result">
              <p>{affordabilityResult}</p>
            </div>
          )}

          <div className="bottom-buttons">
            <button
              className="reupload-btn"
              onClick={() => {
                setImage(null);
                setShowOptions(false);
                setShowExpenseForm(false);
                setAffordabilityResult(null);
                setItemName("");
                setFetchedPrice(null);
                setEditedPrice(null);
              }}
            >
              🔄 Reupload
            </button>
            <button className="go-back-btn" onClick={() => window.history.back()}>
              ⬅️ Go Back
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetChecker;
