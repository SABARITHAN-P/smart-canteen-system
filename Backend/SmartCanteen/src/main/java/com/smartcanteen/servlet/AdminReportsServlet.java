package com.smartcanteen.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.smartcanteen.model.Report;
import com.smartcanteen.service.ReportService;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/api/admin/reports")
public class AdminReportsServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private ReportService reportService = new ReportService();
	private Gson gson = new Gson();


	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

		response.setContentType("application/json");

		List<Report> reports = reportService.getAllReports();

		response.getWriter().write(gson.toJson(reports));
	}

	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {

		response.setContentType("application/json");

		BufferedReader reader = request.getReader();

		Map data = gson.fromJson(reader, Map.class);

		int reportId = ((Double) data.get("reportId")).intValue();
		String status = (String) data.get("status");

		boolean updated = reportService.updateReportStatus(reportId, status);

		Map<String, Object> res = new HashMap<>();

		if (updated) {

			res.put("success", true);

		} else {

			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			res.put("success", false);

		}

		response.getWriter().write(gson.toJson(res));
	}
}