package com.smartcanteen.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.smartcanteen.model.Role;
import com.smartcanteen.model.Status;
import com.smartcanteen.model.User;
import com.smartcanteen.service.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/api/admin/users")
public class AdminUserServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private UserService userService = new UserService();
	private Gson gson = new Gson();

	/*
	 * ========================= CORS HEADERS =========================
	 */

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

	public void doOptions(HttpServletRequest request, HttpServletResponse response)
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

	/*
	 * ========================= GET → FETCH ALL USERS =========================
	 */

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setContentType("application/json");

		if (checkAdminAccess(request, response) == null)
			return;

		List<User> users = userService.getUsersByRole(Role.USER);

		String json = gson.toJson(users);
		response.getWriter().write(json);
	}

	/*
	 * ========================= PUT → BLOCK / UNBLOCK USER
	 * =========================
	 */

	protected void doPut(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

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

		User user = gson.fromJson(sb.toString(), User.class);

		boolean success = false;

		if (user.getStatus() == Status.BLOCKED) {
			success = userService.blockUser(user.getUserId());
		} else if (user.getStatus() == Status.ACTIVE) {
			success = userService.unblockUser(user.getUserId());
		}

		Map<String, Object> responseMap = new HashMap<>();
		responseMap.put("success", success);

		response.getWriter().write(gson.toJson(responseMap));
	}
}