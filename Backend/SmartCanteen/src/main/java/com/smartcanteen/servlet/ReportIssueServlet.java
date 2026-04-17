package com.smartcanteen.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.smartcanteen.model.Report;
import com.smartcanteen.service.ReportService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/api/report-issue")
public class ReportIssueServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private Gson gson = new Gson();
	private ReportService reportService = new ReportService();

	private void setCorsHeaders(HttpServletResponse response) {
		response.setHeader("Access-Control-Allow-Origin", "https://smart-canteen-system-lac.vercel.app");
		response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
		response.setHeader("Access-Control-Allow-Credentials", "true");
	}

	// Handle CORS preflight
	protected void doOptions(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setStatus(HttpServletResponse.SC_OK);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setContentType("application/json");

		Map<String, Object> responseMap = new HashMap<>();

		try {

			/*
			 * ================= SESSION CHECK =================
			 */

			HttpSession session = request.getSession(false);

			if (session == null || session.getAttribute("userId") == null) {

				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

				responseMap.put("success", false);
				responseMap.put("message", "User not logged in");

				response.getWriter().write(gson.toJson(responseMap));
				return;
			}

			int userId = (int) session.getAttribute("userId");

			/*
			 * ================= READ REQUEST BODY =================
			 */

			StringBuilder sb = new StringBuilder();
			BufferedReader reader = request.getReader();
			String line;

			while ((line = reader.readLine()) != null) {
				sb.append(line);
			}

			if (sb.length() == 0) {

				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

				responseMap.put("success", false);
				responseMap.put("message", "Request body is empty");

				response.getWriter().write(gson.toJson(responseMap));
				return;
			}

			/*
			 * ================= PARSE JSON =================
			 */

			Report report = gson.fromJson(sb.toString(), Report.class);

			if (report == null) {

				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

				responseMap.put("success", false);
				responseMap.put("message", "Invalid request data");

				response.getWriter().write(gson.toJson(responseMap));
				return;
			}

			/*
			 * ================= SET USER =================
			 */

			report.setUserId(userId);

			/*
			 * ================= CALL SERVICE =================
			 */

			boolean success = reportService.submitReport(report);

			if (success) {

				responseMap.put("success", true);
				responseMap.put("message", "Report submitted successfully");

			} else {

				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

				responseMap.put("success", false);
				responseMap.put("message", "Invalid report data");
			}

		} catch (JsonSyntaxException e) {

			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

			responseMap.put("success", false);
			responseMap.put("message", "Invalid JSON format");

		} catch (Exception e) {

			e.printStackTrace();

			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

			responseMap.put("success", false);
			responseMap.put("message", "Server error occurred");
		}

		response.getWriter().write(gson.toJson(responseMap));
	}
}