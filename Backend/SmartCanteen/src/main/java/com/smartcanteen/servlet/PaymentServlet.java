package com.smartcanteen.servlet;

import java.io.BufferedReader;
import java.io.IOException;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.smartcanteen.model.OrderStatus;
import com.smartcanteen.service.OrderService;
import com.smartcanteen.service.PaymentService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/payment/*")
public class PaymentServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private OrderService orderService = new OrderService();
	private PaymentService paymentService = new PaymentService();
	private Gson gson = new Gson();

	/*
	 * ========================= CORS CONFIGURATION =========================
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

	@Override
	protected void doOptions(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setStatus(HttpServletResponse.SC_OK);
	}

	/*
	 * ========================= READ REQUEST BODY =========================
	 */

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
	 * ========================= HANDLE PAYMENT ACTIONS =========================
	 */

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		setCorsHeaders(response);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		String path = request.getPathInfo();

		if (path == null) {
			sendError(response, "Invalid payment endpoint");
			return;
		}

		try {

			String body = readRequestBody(request);
			JsonObject json = gson.fromJson(body, JsonObject.class);

			if (json == null || !json.has("paymentId")) {
				sendError(response, "paymentId is required");
				return;
			}

			int paymentId = json.get("paymentId").getAsInt();

			boolean result;

			switch (path) {

			case "/success":

				result = paymentService.completePayment(paymentId);

				if (result) {
					int orderId = paymentService.getOrderIdByPayment(paymentId);

					OrderService orderService = new OrderService();
					orderService.updateOrderStatus(orderId, OrderStatus.PENDING);
				}

				break;

			case "/fail":

				result = paymentService.failPayment(paymentId);

				if (result) {
					int orderId = paymentService.getOrderIdByPayment(paymentId);

					orderService.updateOrderStatus(orderId, OrderStatus.CANCELLED);
				}

				break;
			default:
				sendError(response, "Unknown payment action");
				return;
			}

			JsonObject res = new JsonObject();
			res.addProperty("success", result);

			response.getWriter().write(gson.toJson(res));

		} catch (Exception e) {

			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

			JsonObject error = new JsonObject();
			error.addProperty("error", "Payment processing failed");

			response.getWriter().write(gson.toJson(error));
		}
	}

	/*
	 * ========================= COMMON ERROR RESPONSE =========================
	 */

	private void sendError(HttpServletResponse response, String message) throws IOException {

		response.setStatus(HttpServletResponse.SC_BAD_REQUEST);

		JsonObject error = new JsonObject();
		error.addProperty("error", message);

		response.getWriter().write(gson.toJson(error));
	}
}