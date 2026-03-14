package com.smartcanteen.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import jakarta.servlet.ServletException;

import com.google.gson.Gson;
import com.smartcanteen.model.User;
import com.smartcanteen.service.UserService;
import com.smartcanteen.model.RegisterRequest;

@WebServlet("/api/register")
public class RegisterServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private UserService userService = new UserService();
	private Gson gson = new Gson();

	private void setCorsHeaders(HttpServletResponse response) {
		response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
		response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");
		response.setHeader("Access-Control-Allow-Credentials", "true");
	}

	protected void doOptions(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setStatus(HttpServletResponse.SC_OK);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		setCorsHeaders(response);
		response.setContentType("application/json");

		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;

		while ((line = reader.readLine()) != null) {
			sb.append(line);
		}

		RegisterRequest registerRequest = gson.fromJson(sb.toString(), RegisterRequest.class);

		Map<String, Object> responseMap = new HashMap<>();

		if (registerRequest == null || registerRequest.getEmail() == null || registerRequest.getPassword() == null
				|| registerRequest.getName() == null) {

			responseMap.put("success", false);
			responseMap.put("message", "Invalid registration data");

			response.getWriter().write(gson.toJson(responseMap));
			return;
		}

		User user = new User();
		user.setName(registerRequest.getName());
		user.setEmail(registerRequest.getEmail());
		user.setPassword(registerRequest.getPassword());
		user.setMobileNumber(registerRequest.getMobileNumber());

		boolean registered = userService.register(user);

		if (registered) {
			responseMap.put("success", true);
			responseMap.put("message", "Registration successful");
		} else {
			responseMap.put("success", false);
			responseMap.put("message", "Registration failed (Email may already exist)");
		}

		response.getWriter().write(gson.toJson(responseMap));
	}
}