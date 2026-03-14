package com.smartcanteen.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import jakarta.servlet.ServletException;

import com.google.gson.Gson;
import com.smartcanteen.service.UserService;

@SuppressWarnings("unchecked")
@WebServlet("/api/forgot-password")
public class ForgotPasswordServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private UserService userService = new UserService();
	private Gson gson = new Gson();

	private void setCorsHeaders(HttpServletResponse response) {

		response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
		response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");
		response.setHeader("Access-Control-Allow-Credentials", "true");
	}

	protected void doOptions(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setStatus(HttpServletResponse.SC_OK);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setContentType("application/json");

		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;

		while ((line = reader.readLine()) != null) {
			sb.append(line);
		}

		Map<String, String> data = gson.fromJson(sb.toString(), Map.class);

		// Accept email
		String email = data.get("email");

		boolean success = userService.initiateForgotPassword(email);

		Map<String, Object> responseMap = new HashMap<>();

		if (success) {
			responseMap.put("success", true);
			responseMap.put("message", "If account exists, OTP sent.");
		} else {
			responseMap.put("success", false);
			responseMap.put("message", "Failed to generate OTP.");
		}

		String json = gson.toJson(responseMap);
		response.getWriter().write(json);
	}
}