package com.smartcanteen.service;

import java.util.ArrayList;
import java.util.List;

import com.smartcanteen.dao.ReportDAO;
import com.smartcanteen.model.Report;

public class ReportService {

	private ReportDAO reportDAO;

	public ReportService() {
		this.reportDAO = new ReportDAO();
	}

	// 1️⃣ Submit Report
	public boolean submitReport(Report report) {

		if (report == null)
			return false;

		if (report.getUserId() <= 0)
			return false;

		if (report.getIssueCategory() == null || report.getIssueCategory().isEmpty())
			return false;

		if (report.getIssueType() == null || report.getIssueType().isEmpty())
			return false;

		if (report.getDescription() == null || report.getDescription().isEmpty())
			return false;

		/*
		 * ================= CATEGORY VALIDATION =================
		 */

		String category = report.getIssueCategory();

		switch (category) {

		case "ORDER_ISSUE":

			// order issue must contain orderId
			if (report.getOrderId() == null)
				return false;

			break;

		case "SYSTEM_ISSUE":

			// system issue must not contain orderId
			report.setOrderId(null);

			break;

		default:
			return false;
		}

		/*
		 * ================= DEFAULT STATUS =================
		 */

		if (report.getStatus() == null)
			report.setStatus("pending");

		return reportDAO.createReport(report);
	}

	// 2️⃣ Get All Reports (Admin)
	public List<Report> getAllReports() {
		return reportDAO.getAllReports();
	}

	// 3️⃣ Get Reports by User
	public List<Report> getReportsByUser(int userId) {

		if (userId <= 0)
			return new ArrayList<>();

		return reportDAO.getReportsByUser(userId);
	}

	// 4️⃣ Update Report Status
	public boolean updateReportStatus(int reportId, String status) {

		if (reportId <= 0)
			return false;

		if (status == null || status.isEmpty())
			return false;

		return reportDAO.updateReportStatus(reportId, status);
	}

	// 5️⃣ Detect fake reporters
	public boolean isUserAbusingReports(int userId) {

		int rejectedCount = reportDAO.countRejectedReports(userId);

		return rejectedCount >= 3;
	}
}