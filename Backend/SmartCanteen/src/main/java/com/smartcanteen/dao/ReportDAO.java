package com.smartcanteen.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.smartcanteen.model.Report;
import com.smartcanteen.util.DBConnection;

public class ReportDAO {

	// 1️⃣ Create Report
	public boolean createReport(Report report) {

		String sql = "INSERT INTO reports (user_id, order_id, issue_category, issue_type, description, status) VALUES (?, ?, ?, ?, ?, ?)";

		try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {

			ps.setInt(1, report.getUserId());

			if (report.getOrderId() != null)
				ps.setInt(2, report.getOrderId());
			else
				ps.setNull(2, java.sql.Types.INTEGER);

			ps.setString(3, report.getIssueCategory());
			ps.setString(4, report.getIssueType());
			ps.setString(5, report.getDescription());
			ps.setString(6, report.getStatus() == null ? "pending" : report.getStatus());

			int rows = ps.executeUpdate();
			return rows > 0;

		} catch (Exception e) {
			e.printStackTrace();
		}

		return false;
	}

	// 2️⃣ Get All Reports (Admin)
	public List<Report> getAllReports() {

		List<Report> reports = new ArrayList<>();

		String sql = "SELECT * FROM reports ORDER BY report_time DESC";

		try (Connection conn = DBConnection.getConnection();
				PreparedStatement ps = conn.prepareStatement(sql);
				ResultSet rs = ps.executeQuery()) {

			while (rs.next()) {

				Report report = new Report();

				report.setReportId(rs.getInt("report_id"));
				report.setUserId(rs.getInt("user_id"));
				report.setOrderId((Integer) rs.getObject("order_id"));
				report.setIssueCategory(rs.getString("issue_category"));
				report.setIssueType(rs.getString("issue_type"));
				report.setDescription(rs.getString("description"));
				report.setStatus(rs.getString("status"));
				reports.add(report);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return reports;
	}

	// 3️⃣ Get Reports By User
	public List<Report> getReportsByUser(int userId) {

		List<Report> reports = new ArrayList<>();

		String sql = "SELECT * FROM reports WHERE user_id = ? ORDER BY report_time DESC";

		try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {

			ps.setInt(1, userId);

			ResultSet rs = ps.executeQuery();

			while (rs.next()) {

				Report report = new Report();

				report.setReportId(rs.getInt("report_id"));
				report.setUserId(rs.getInt("user_id"));
				report.setOrderId((Integer) rs.getObject("order_id"));
				report.setIssueCategory(rs.getString("issue_category"));
				report.setIssueType(rs.getString("issue_type"));
				report.setDescription(rs.getString("description"));
				report.setStatus(rs.getString("status"));

				reports.add(report);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return reports;
	}

	// 4️⃣ Update Report Status (Admin)
	public boolean updateReportStatus(int reportId, String status) {

		String sql = "UPDATE reports SET status = ? WHERE report_id = ?";

		try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {

			ps.setString(1, status);
			ps.setInt(2, reportId);

			int rows = ps.executeUpdate();
			return rows > 0;

		} catch (Exception e) {
			e.printStackTrace();
		}

		return false;
	}

	// 5️⃣ Count Rejected Reports for a User
	public int countRejectedReports(int userId) {

		String sql = "SELECT COUNT(*) FROM reports WHERE user_id = ? AND status = 'rejected'";

		try (Connection conn = DBConnection.getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {

			ps.setInt(1, userId);

			ResultSet rs = ps.executeQuery();

			if (rs.next())
				return rs.getInt(1);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return 0;
	}
}