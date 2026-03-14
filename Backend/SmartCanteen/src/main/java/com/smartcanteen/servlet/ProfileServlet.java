package com.smartcanteen.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

import com.google.gson.Gson;
import com.smartcanteen.model.User;
import com.smartcanteen.service.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/api/profile/*")
public class ProfileServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private UserService userService = new UserService();
	private Gson gson = new Gson();

	/* ================= PASSWORD REQUEST CLASS ================= */

	private static class PasswordRequest {
		String oldPassword;
		String newPassword;
	}

	private void setCorsHeaders(HttpServletResponse response) {
		response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
		response.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");
		response.setHeader("Access-Control-Allow-Credentials", "true");
	}

	public void doOptions(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setStatus(HttpServletResponse.SC_OK);
	}

	/*
	 * ========================= GET PROFILE =========================
	 */

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setContentType("application/json");

		HttpSession session = request.getSession(false);

		if (session == null) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}

		Integer userId = (Integer) session.getAttribute("userId");

		if (userId == null) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}

		User user = userService.getUserById(userId);

		PrintWriter out = response.getWriter();
		out.print(gson.toJson(user));
	}

	/*
	 * ========================= UPDATE PROFILE / PASSWORD =========================
	 */

	@Override
	protected void doPut(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setContentType("application/json");

		String path = request.getPathInfo();

		HttpSession session = request.getSession(false);

		if (session == null) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}

		Integer userId = (Integer) session.getAttribute("userId");

		if (userId == null) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}

		/* ================= CHANGE PASSWORD ================= */

		if ("/password".equals(path)) {

			BufferedReader reader = request.getReader();
			PasswordRequest data = gson.fromJson(reader, PasswordRequest.class);

			if (data == null || data.oldPassword == null || data.newPassword == null) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().print("{\"message\":\"Invalid request data\"}");
				return;
			}

			User user = userService.getUserById(userId);

			if (user == null) {
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				response.getWriter().print("{\"message\":\"User not found\"}");
				return;
			}

			boolean success = userService.changePassword(userId, data.oldPassword, data.newPassword);

			if (success) {
				response.getWriter().print("{\"message\":\"Password updated\"}");
			} else {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.getWriter().print("{\"message\":\"Old password incorrect\"}");
			}
		}

		/* ================= UPDATE PROFILE ================= */

		else {

			BufferedReader reader = request.getReader();
			User user = gson.fromJson(reader, User.class);

			if (user == null) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().print("{\"message\":\"Invalid user data\"}");
				return;
			}

			user.setUserId(userId);

			boolean success = userService.updateProfile(user);

			if (success) {
				response.getWriter().print("{\"message\":\"Profile updated\"}");
			} else {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			}
		}
	}
}