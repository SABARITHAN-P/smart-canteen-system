package com.smartcanteen.servlet;

import com.smartcanteen.service.AdminDashboardService;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;

@WebServlet("/api/admin/dashboard")
public class AdminDashboardServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private AdminDashboardService service = new AdminDashboardService();

	private void setCorsHeaders(HttpServletRequest request, HttpServletResponse response) {

        String origin = request.getHeader("Origin");

        // Allow Vercel + localhost
        if (origin != null && (
                origin.contains("vercel.app") ||
                origin.contains("localhost")
        )) {
            response.setHeader("Access-Control-Allow-Origin", origin);
        }

        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

		setCorsHeaders(response);

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		int shopId = Integer.parseInt(request.getParameter("shopId"));

		Map<String, Object> stats = service.getDashboardStats(shopId);

		Gson gson = new Gson();
		response.getWriter().write(gson.toJson(stats));
	}

	protected void doOptions(HttpServletRequest request, HttpServletResponse response) {
		setCorsHeaders(response);
		response.setStatus(HttpServletResponse.SC_OK);
	}
}