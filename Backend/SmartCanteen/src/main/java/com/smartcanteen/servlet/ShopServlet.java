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

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

		
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