package com.smartcanteen.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.smartcanteen.model.RegisterRequest;
import com.smartcanteen.model.Role;
import com.smartcanteen.model.Status;
import com.smartcanteen.model.User;
import com.smartcanteen.service.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/api/admin/create-shop-admin")
public class CreateShopAdminServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private UserService userService = new UserService();
	private Gson gson = new Gson();

	/*
	 * ========================= CORS HEADERS =========================
	 */

	private void setCorsHeaders(HttpServletResponse response) {
		response.setHeader("Access-Control-Allow-Origin", "https://smart-canteen-system-lac.vercel.app");
		response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
		response.setHeader("Access-Control-Allow-Credentials", "true");
	}

	protected void doOptions(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setStatus(HttpServletResponse.SC_OK);
	}

	/*
	 * ========================= ADMIN ACCESS CHECK =========================
	 */

	private User checkAdminAccess(HttpServletRequest request, HttpServletResponse response) throws IOException {

		HttpSession session = request.getSession(false);

		if (session == null) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not logged in");
			return null;
		}

		User currentUser = (User) session.getAttribute("user");

		if (currentUser == null || currentUser.getRole() != Role.MAIN_ADMIN) {
			response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied");
			return null;
		}

		return currentUser;
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		setCorsHeaders(response);
		response.setContentType("application/json");

		if (checkAdminAccess(request, response) == null)
			return;

		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;

		while ((line = reader.readLine()) != null) {
			sb.append(line);
		}

		RegisterRequest registerRequest = gson.fromJson(sb.toString(), RegisterRequest.class);

		User user = new User();
		user.setName(registerRequest.getName());
		user.setEmail(registerRequest.getEmail());
		user.setPassword(registerRequest.getPassword());
		user.setMobileNumber(registerRequest.getMobileNumber());
		user.setRole(Role.SHOP_ADMIN);
		user.setStatus(Status.ACTIVE);

		boolean registered = userService.register(user);

		Map<String, Object> responseMap = new HashMap<>();

		if (registered) {
			responseMap.put("success", true);
			responseMap.put("message", "Shop admin created successfully");
		} else {
			responseMap.put("success", false);
			responseMap.put("message", "Registration failed");
		}

		response.getWriter().write(gson.toJson(responseMap));
	}
}