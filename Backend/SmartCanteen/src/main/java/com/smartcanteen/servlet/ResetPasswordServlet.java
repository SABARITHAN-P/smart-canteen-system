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
@WebServlet("/api/reset-password")
public class ResetPasswordServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private UserService userService = new UserService();
	private Gson gson = new Gson();

	
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		
		response.setContentType("application/json");

		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;

		while ((line = reader.readLine()) != null) {
			sb.append(line);
		}

		Map<String, String> data = gson.fromJson(sb.toString(), Map.class);

		String email = data.get("email");
		String otp = data.get("otp");
		String newPassword = data.get("newPassword");

		// Validate request
		if (email == null || email.isBlank() || otp == null || otp.isBlank() || newPassword == null
				|| newPassword.isBlank()) {

			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

			Map<String, Object> error = new HashMap<>();
			error.put("success", false);
			error.put("message", "Email, OTP and new password are required");

			response.getWriter().write(gson.toJson(error));
			return;
		}

		boolean success = userService.resetPassword(email, otp, newPassword);

		Map<String, Object> responseMap = new HashMap<>();

		if (success) {
			responseMap.put("success", true);
			responseMap.put("message", "Password reset successful");
		} else {
			responseMap.put("success", false);
			responseMap.put("message", "Invalid or expired OTP");
		}

		String json = gson.toJson(responseMap);
		response.getWriter().write(json);
	}
}