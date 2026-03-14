import { useState } from "react";
import AppLayout from "../components/AppLayout";
import { submitReport } from "../services/api";

function ReportIssue() {
  const [category, setCategory] = useState("SYSTEM_ISSUE");
  const [orderId, setOrderId] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!issueType.trim()) {
      setMessage("Issue type is required");
      return;
    }

    if (!description.trim()) {
      setMessage("Description is required");
      return;
    }

    if (category === "ORDER_ISSUE" && !orderId) {
      setMessage("Order ID is required for order issues");
      return;
    }

    const reportData = {
      issueCategory: category,
      issueType,
      description,
      orderId: category === "ORDER_ISSUE" ? parseInt(orderId) : null,
    };

    try {
      setLoading(true);
      const data = await submitReport(reportData);

      if (data.success) {
        setMessage("✅ Report submitted successfully");
        setIssueType("");
        setDescription("");
        setOrderId("");
      } else {
        setMessage(data.message || "Failed to submit report");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Report Issue / Feedback">
      <div style={styles.card}>
        <h2 style={styles.heading}>Report an Issue</h2>

        {/* Category */}
        <label style={styles.label}>Issue Category</label>
        <select
          style={styles.input}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="SYSTEM_ISSUE">System Issue</option>
          <option value="ORDER_ISSUE">Order Issue</option>
        </select>

        {/* Order ID */}
        {category === "ORDER_ISSUE" && (
          <>
            <label style={styles.label}>Order ID</label>
            <input
              style={styles.input}
              type="number"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID"
            />
          </>
        )}

        {/* Issue Type */}
        <label style={styles.label}>Issue Type</label>
        <input
          style={styles.input}
          type="text"
          placeholder="Example: Wrong item, Payment error..."
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
        />

        {/* Description */}
        <label style={styles.label}>Description</label>
        <textarea
          style={styles.textarea}
          rows="6"
          placeholder="Describe the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Warning */}
        <div style={styles.warning}>
          ⚠️ Submitting fake or misleading reports may result in your account
          being blocked.
        </div>

        {/* Submit Button */}
        <button
          style={loading ? styles.buttonDisabled : styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>

        {/* Message */}
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </AppLayout>
  );
}

const styles = {
  card: {
    maxWidth: "600px",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  },

  heading: {
    marginBottom: "20px",
  },

  label: {
    fontWeight: "600",
    display: "block",
    marginBottom: "6px",
    marginTop: "15px",
  },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
  },

  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    resize: "vertical",
  },

  warning: {
    marginTop: "18px",
    padding: "10px",
    background: "#fef3c7",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#92400e",
  },

  button: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg,#4f46e5,#6366f1)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
  },

  buttonDisabled: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "#94a3b8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
  },

  message: {
    marginTop: "15px",
    fontWeight: "500",
  },
};

export default ReportIssue;
