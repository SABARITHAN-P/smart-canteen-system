package com.smartcanteen.servlet;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import com.google.gson.Gson;
import com.smartcanteen.model.Shop;
import com.smartcanteen.model.User;
import com.smartcanteen.service.ShopService;

@WebServlet("/api/shops")
public class ShopServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private ShopService shopService = new ShopService();
	private Gson gson = new Gson();

	private void setCorsHeaders(HttpServletResponse response) {
		response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
		response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");
		response.setHeader("Access-Control-Allow-Credentials", "true");
	}

	protected void doOptions(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setStatus(HttpServletResponse.SC_OK);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

		setCorsHeaders(response);
		response.setContentType("application/json");

		/*
		 * ========================= CHECK LOGIN SESSION =========================
		 */

		HttpSession session = request.getSession(false);
		User currentUser = (session != null) ? (User) session.getAttribute("user") : null;

		if (currentUser == null) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not logged in");
			return;
		}

		try {

			List<Shop> shops = shopService.getAvailableShops();

			String json = gson.toJson(shops);
			response.getWriter().write(json);

		} catch (Exception e) {

			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to fetch shops");

		}
	}
}