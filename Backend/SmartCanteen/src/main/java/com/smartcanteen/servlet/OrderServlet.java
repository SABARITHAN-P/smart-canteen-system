package com.smartcanteen.servlet;

import java.io.BufferedReader;
import java.io.IOException;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.smartcanteen.dto.PlaceOrderRequest;
import com.smartcanteen.model.Order;
import com.smartcanteen.model.OrderStatus;
import com.smartcanteen.service.OrderService;
import com.smartcanteen.service.PaymentService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/orders/*")
public class OrderServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private OrderService orderService = new OrderService();
	private PaymentService paymentService = new PaymentService();
	private Gson gson = new Gson();

	

	private String readRequestBody(HttpServletRequest request) throws IOException {

		StringBuilder sb = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null) {
			sb.append(line);
		}
		return sb.toString();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		
		response.setContentType("application/json");

		String path = request.getPathInfo();

		if (path == null) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return;
		}

		String[] parts = path.split("/");

		try {

			// GET /api/orders/all
			if (parts.length >= 2 && "all".equals(parts[1])) {

				var orders = orderService.getAllOrders();
				response.getWriter().write(gson.toJson(orders));
				return;
			}

			// GET /api/orders/user/{userId}
			if (parts.length >= 3 && "user".equals(parts[1])) {

				int userId = Integer.parseInt(parts[2]);
				var orders = orderService.getOrdersByUser(userId);
				response.getWriter().write(gson.toJson(orders));
				return;
			}

			// GET /api/orders/shop/{shopId}
			if (parts.length >= 3 && "shop".equals(parts[1])) {

				int shopId = Integer.parseInt(parts[2]);
				var orders = orderService.getOrdersByShop(shopId);
				response.getWriter().write(gson.toJson(orders));
				return;
			}
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

		} catch (Exception e) {

			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().write("{\"error\":\"Failed to fetch orders\"}");
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		
		response.setContentType("application/json");

		try {

			String body = readRequestBody(request);
			PlaceOrderRequest req = gson.fromJson(body, PlaceOrderRequest.class);

			// Create order object
			Order order = new Order();
			order.setUserId(req.getUserId());
			order.setShopId(req.getShopId());

			// Place order
			int orderId = orderService.placeOrder(order, req.getItems());

			// Get order total
			double amount = orderService.getOrderTotal(orderId);

			// Create payment
			int paymentId = paymentService.createPayment(orderId, amount);

			// Build response
			JsonObject res = new JsonObject();
			res.addProperty("orderId", orderId);
			res.addProperty("paymentId", paymentId);
			res.addProperty("amount", amount);

			response.getWriter().write(gson.toJson(res));

		} catch (Exception e) {

			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().write("{\"error\":\"Failed to place order\"}");
		}
	}

	protected void doPut(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		
		response.setContentType("application/json");

		try {

			String body = readRequestBody(request);
			JsonObject json = gson.fromJson(body, JsonObject.class);
			int orderId = json.get("orderId").getAsInt();
			OrderStatus status = OrderStatus.valueOf(json.get("status").getAsString());
			boolean updated = orderService.updateOrderStatus(orderId, status);
			response.getWriter().write("{\"success\":" + updated + "}");
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().write("{\"error\":\"Failed to update status\"}");
		}

	}

	protected void doDelete(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		try {

			String path = request.getPathInfo();

			if (path == null || path.length() <= 1) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().write("{\"error\":\"Invalid order id\"}");
				return;
			}

			int orderId = Integer.parseInt(path.substring(1));
			boolean cancelled = orderService.cancelOrder(orderId);

			if (!cancelled) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().write("{\"error\":\"Order cannot be cancelled\"}");
				return;
			}

			response.getWriter().write("{\"success\": true}");

		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().write("{\"error\":\"Failed to cancel order\"}");
		}
	}
}
