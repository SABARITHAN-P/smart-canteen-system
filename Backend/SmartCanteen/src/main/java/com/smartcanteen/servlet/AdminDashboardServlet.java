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

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {


		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		int shopId = Integer.parseInt(request.getParameter("shopId"));

		Map<String, Object> stats = service.getDashboardStats(shopId);

		Gson gson = new Gson();
		response.getWriter().write(gson.toJson(stats));
	}

}