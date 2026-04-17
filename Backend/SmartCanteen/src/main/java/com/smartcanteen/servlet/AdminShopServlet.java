package com.smartcanteen.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.smartcanteen.model.Shop;
import com.smartcanteen.model.DeleteShopRequest;
import com.smartcanteen.model.Role;
import com.smartcanteen.model.User;
import com.smartcanteen.service.ShopService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/api/admin/shops")
public class AdminShopServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private ShopService shopService = new ShopService();
	private Gson gson = new Gson();

	private void setCorsHeaders(HttpServletResponse response) {
		response.setHeader("Access-Control-Allow-Origin", "https://smart-canteen-system-lac.vercel.app");
		response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
		response.setHeader("Access-Control-Allow-Credentials", "true");
	}

	public void doOptions(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setStatus(HttpServletResponse.SC_OK);
	}

	/* ========================= SESSION CHECK ========================= */

	private User getSessionUser(HttpServletRequest request, HttpServletResponse response) throws IOException {

		HttpSession session = request.getSession(false);

		if (session == null) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not logged in");
			return null;
		}

		User user = (User) session.getAttribute("user");

		if (user == null) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid session");
			return null;
		}

		return user;
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

	/* ========================= GET ALL SHOPS ========================= */

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setContentType("application/json");

		User user = getSessionUser(request, response);
		if (user == null)
			return;

		if (user.getRole() != Role.MAIN_ADMIN) {
			response.sendError(HttpServletResponse.SC_FORBIDDEN, "Only main admin can view all shops");
			return;
		}

		List<Shop> shops = shopService.getAllShops();

		response.getWriter().write(gson.toJson(shops));
	}

	/* ========================= CREATE SHOP ========================= */

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setContentType("application/json");

		User user = getSessionUser(request, response);
		if (user == null)
			return;

		if (user.getRole() != Role.MAIN_ADMIN) {
			response.sendError(HttpServletResponse.SC_FORBIDDEN, "Only main admin can create shops");
			return;
		}

		String requestBody = readRequestBody(request);

		Shop shop = gson.fromJson(requestBody, Shop.class);

		boolean success = shopService.createShop(shop);

		Map<String, Object> map = new HashMap<>();

		if (success) {
			map.put("success", true);
			map.put("message", "Shop created successfully");
		} else {
			map.put("success", false);
			map.put("message", "Shop creation failed");
		}

		response.getWriter().write(gson.toJson(map));
	}

	/* ========================= UPDATE SHOP ========================= */

	protected void doPut(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setContentType("application/json");

		User user = getSessionUser(request, response);
		if (user == null)
			return;

		String requestBody = readRequestBody(request);

		Shop shop = gson.fromJson(requestBody, Shop.class);

		if (shop == null || shop.getShopId() <= 0) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid shop data");
			return;
		}

		boolean success = false;

		if (user.getRole() == Role.MAIN_ADMIN) {

			if (shop.getShopName() != null && !shop.getShopName().isBlank()) {
				success = shopService.updateShopName(shop.getShopId(), shop.getShopName());
			} else if (shop.getShopAdminId() > 0) {
				success = shopService.updateShopAdmin(shop.getShopId(), shop.getShopAdminId());
			}

		} else if (user.getRole() == Role.SHOP_ADMIN) {

			Shop adminShop = shopService.getShopByAdmin(user.getUserId());

			if (adminShop == null || adminShop.getShopId() != shop.getShopId()) {
				response.sendError(HttpServletResponse.SC_FORBIDDEN, "Cannot modify other shops");
				return;
			}

			if (shop.getShopName() != null && !shop.getShopName().isBlank()) {
				success = shopService.updateShopName(shop.getShopId(), shop.getShopName());
			}

		}

		Map<String, Object> map = new HashMap<>();

		if (success) {
			map.put("success", true);
			map.put("message", "Shop updated successfully");
		} else {
			map.put("success", false);
			map.put("message", "Shop update failed");
		}

		response.getWriter().write(gson.toJson(map));
	}

	/* ========================= DELETE SHOP ========================= */

	protected void doDelete(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setContentType("application/json");

		User user = getSessionUser(request, response);
		if (user == null)
			return;

		if (user.getRole() != Role.MAIN_ADMIN) {
			response.sendError(HttpServletResponse.SC_FORBIDDEN, "Only main admin can delete shops");
			return;
		}

		String requestBody = readRequestBody(request);

		DeleteShopRequest deleteRequest = gson.fromJson(requestBody, DeleteShopRequest.class);

		boolean success = shopService.deleteShop(deleteRequest.getShopId(), deleteRequest.getAdminPassword());

		Map<String, Object> map = new HashMap<>();

		if (success) {
			map.put("success", true);
			map.put("message", "Shop deleted successfully");
		} else {
			map.put("success", false);
			map.put("message", "Invalid password or deletion failed");
		}

		response.getWriter().write(gson.toJson(map));
	}

}
