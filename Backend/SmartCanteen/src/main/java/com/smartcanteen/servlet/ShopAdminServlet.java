package com.smartcanteen.servlet;

import java.io.IOException;

import com.google.gson.Gson;
import com.smartcanteen.model.Role;
import com.smartcanteen.model.Shop;
import com.smartcanteen.model.User;
import com.smartcanteen.service.ShopService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/api/shop-admin")
public class ShopAdminServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private ShopService shopService = new ShopService();
	private Gson gson = new Gson();

	

	/* =========================
	   CHECK SHOP ADMIN SESSION
	========================= */

	private User checkShopAdmin(HttpServletRequest request, HttpServletResponse response) throws IOException {

		HttpSession session = request.getSession(false);

		if (session == null) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not logged in");
			return null;
		}

		User currentUser = (User) session.getAttribute("user");

		if (currentUser == null || currentUser.getRole() != Role.SHOP_ADMIN) {
			response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied");
			return null;
		}

		return currentUser;
	}

	/* =========================
	   GET SHOP PROFILE
	========================= */

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		
		response.setContentType("application/json");

		User admin = checkShopAdmin(request, response);
		if (admin == null) return;

		/* Get shop using logged-in admin id */
		Shop shop = shopService.getShopByAdmin(admin.getUserId());

		String json = gson.toJson(shop);
		response.getWriter().write(json);
	}

	/* =========================
	   TOGGLE SHOP STATUS
	========================= */

	protected void doPut(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		
		response.setContentType("application/json");

		User admin = checkShopAdmin(request, response);
		if (admin == null) return;

		/* Get shop using admin id */
		Shop shop = shopService.getShopByAdmin(admin.getUserId());

		if (shop == null) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND, "Shop not found");
			return;
		}

		boolean result = shopService.toggleShopStatus(shop.getShopId());

		String json = gson.toJson(result);
		response.getWriter().write(json);
	}
}