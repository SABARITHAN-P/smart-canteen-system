package com.smartcanteen.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.smartcanteen.model.Menu;
import com.smartcanteen.model.Role;
import com.smartcanteen.model.User;
import com.smartcanteen.model.Shop;
import com.smartcanteen.service.MenuService;
import com.smartcanteen.service.ShopService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/api/menu")
public class MenuServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private MenuService menuService = new MenuService();
	private ShopService shopService = new ShopService();
	private Gson gson = new Gson();

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

	private String readRequestBody(HttpServletRequest request) throws IOException {

		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;

		while ((line = reader.readLine()) != null) {
			sb.append(line);
		}

		return sb.toString();
	}

	/*
	 * ========================= SESSION CHECK =========================
	 */

	private User getLoggedUser(HttpServletRequest request, HttpServletResponse response) throws IOException {

		HttpSession session = request.getSession(false);

		if (session == null) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not logged in");
			return null;
		}

		return (User) session.getAttribute("user");
	}

	/*
	 * ========================= GET MENU (USER + SHOP_ADMIN)
	 * =========================
	 */

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setContentType("application/json");

		User currentUser = getLoggedUser(request, response);
		if (currentUser == null)
			return;

		String shopIdParam = request.getParameter("shopId");

		if (shopIdParam == null || shopIdParam.isBlank()) {
			response.getWriter().write("[]");
			return;
		}

		int shopId;

		try {
			shopId = Integer.parseInt(shopIdParam);
		} catch (NumberFormatException e) {
			response.getWriter().write("[]");
			return;
		}

		List<Menu> menus = menuService.getMenuByShop(shopId);

		response.getWriter().write(gson.toJson(menus));
	}

	/*
	 * ========================= ADD MENU (SHOP_ADMIN ONLY)
	 * =========================
	 */

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setContentType("application/json");

		User currentUser = getLoggedUser(request, response);
		if (currentUser == null)
			return;

		if (currentUser.getRole() != Role.SHOP_ADMIN) {
			response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied");
			return;
		}

		String requestBody = readRequestBody(request);

		Menu menu = gson.fromJson(requestBody, Menu.class);

		Shop shop = shopService.getShopByAdmin(currentUser.getUserId());

		if (shop == null || menu.getShopId() != shop.getShopId()) {
			response.sendError(HttpServletResponse.SC_FORBIDDEN, "Cannot modify other shop menu");
			return;
		}

		boolean success = menuService.addMenuItem(menu);

		Map<String, Object> responseMap = new HashMap<>();
		responseMap.put("success", success);

		response.getWriter().write(gson.toJson(responseMap));
	}

	/*
	 * ========================= UPDATE MENU (SHOP_ADMIN ONLY)
	 * =========================
	 */

	protected void doPut(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setContentType("application/json");

		User currentUser = getLoggedUser(request, response);
		if (currentUser == null)
			return;

		if (currentUser.getRole() != Role.SHOP_ADMIN) {
			response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied");
			return;
		}

		String requestBody = readRequestBody(request);

		Menu menu = gson.fromJson(requestBody, Menu.class);

		Shop shop = shopService.getShopByAdmin(currentUser.getUserId());

		if (shop == null || menu.getShopId() != shop.getShopId()) {
			response.sendError(HttpServletResponse.SC_FORBIDDEN, "Cannot modify other shop menu");
			return;
		}

		boolean success = menuService.updateMenuItem(menu);

		Map<String, Object> responseMap = new HashMap<>();
		responseMap.put("success", success);

		response.getWriter().write(gson.toJson(responseMap));
	}

	/*
	 * ========================= DELETE MENU (SHOP_ADMIN ONLY)
	 * =========================
	 */

	protected void doDelete(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setContentType("application/json");

		User currentUser = getLoggedUser(request, response);
		if (currentUser == null)
			return;

		if (currentUser.getRole() != Role.SHOP_ADMIN) {
			response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied");
			return;
		}

		String idParam = request.getParameter("id");

		if (idParam == null || idParam.isBlank()) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Menu id required");
			return;
		}

		int menuId;

		try {
			menuId = Integer.parseInt(idParam);
		} catch (NumberFormatException e) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid menu id");
			return;
		}

		boolean success = menuService.deleteMenuItem(menuId);

		Map<String, Object> responseMap = new HashMap<>();
		responseMap.put("success", success);

		response.getWriter().write(gson.toJson(responseMap));
	}
}