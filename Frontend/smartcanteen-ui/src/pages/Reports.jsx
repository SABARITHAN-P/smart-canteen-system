import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllReports, updateReportStatus } from "../services/api";
import Swal from "sweetalert2";

function Reports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getAllReports();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleStatusUpdate = async (reportId, status) => {
    try {
      await updateReportStatus(reportId, status);

      setReports((prev) =>
        prev.map((r) => (r.reportId === reportId ? { ...r, status } : r)),
      );

      Swal.fire("Updated!", `Report marked as ${status}`, "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const getStatusStyle = (status) => {
    if (status === "pending") return styles.pending;
    if (status === "resolved") return styles.resolved;
    if (status === "rejected") return styles.rejected;
    return {};
  };

  const filteredReports =
    filter === "all" ? reports : reports.filter((r) => r.status === filter);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 User Reports</h2>

      {/* FILTER BUTTONS */}
      <div style={styles.filters}>
        <button onClick={() => setFilter("all")} style={styles.filterBtn}>
          All
        </button>

        <button onClick={() => setFilter("pending")} style={styles.filterBtn}>
          Pending
        </button>

        <button onClick={() => setFilter("resolved")} style={styles.filterBtn}>
          Resolved
        </button>

        <button onClick={() => setFilter("rejected")} style={styles.filterBtn}>
          Rejected
        </button>
      </div>

      {filteredReports.length === 0 ? (
        <p>No reports available</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Report ID</th>
              <th style={styles.th}>User ID</th>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Issue</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.reportId} style={styles.row}>
                <td style={styles.td}>{report.reportId}</td>
                <td style={styles.td}>{report.userId}</td>
                <td style={styles.td}>{report.orderId || "-"}</td>

                <td style={{ ...styles.td, whiteSpace: "nowrap" }}>
                  {report.issueCategory}
                </td>

                <td style={styles.td}>{report.issueType}</td>

                <td style={styles.td}>{report.description}</td>

                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...getStatusStyle(report.status),
                    }}
                  >
                    {report.status}
                  </span>
                </td>

                <td style={styles.td}>
                  {report.status === "pending" && (
                    <div style={styles.actions}>
                      <button
                        style={styles.resolveBtn}
                        onClick={() =>
                          handleStatusUpdate(report.reportId, "resolved")
                        }
                      >
                        Resolve
                      </button>

                      <button
                        style={styles.rejectBtn}
                        onClick={() =>
                          handleStatusUpdate(report.reportId, "rejected")
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        style={styles.backBtn}
        onClick={() => navigate("/main-admin-dashboard")}
      >
        ← Back
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
  },

  title: {
    marginBottom: "20px",
  },

  filters: {
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
  },

  filterBtn: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    background: "#e2e8f0",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#ffffff",
  },

  th: {
    padding: "12px",
    textAlign: "left",
    background: "#f1f5f9",
    borderBottom: "2px solid #e2e8f0",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
  },

  row: {
    transition: "background 0.2s",
  },

  actions: {
    display: "flex",
    gap: "8px",
    whiteSpace: "nowrap",
  },

  statusBadge: {
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    color: "#fff",
    fontWeight: "500",
  },

  pending: {
    background: "#f59e0b",
  },

  resolved: {
    background: "#22c55e",
  },

  rejected: {
    background: "#ef4444",
  },

  resolveBtn: {
    background: "#22c55e",
    border: "none",
    padding: "6px 12px",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },

  rejectBtn: {
    background: "#ef4444",
    border: "none",
    padding: "6px 12px",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },

  backBtn: {
    marginTop: "20px",
    padding: "10px 18px",
    background: "#4f46e5",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Reports;
