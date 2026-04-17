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
import com.smartcanteen.model.Shop;
import com.smartcanteen.model.LoginRequest;
import com.smartcanteen.service.UserService;
import com.smartcanteen.service.ShopService;

@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private UserService userService = new UserService();
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

		LoginRequest loginRequest = gson.fromJson(sb.toString(), LoginRequest.class);

		User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());

		Map<String, Object> responseMap = new HashMap<>();

		if (user != null) {

			/*
			 * ========================= CREATE SESSION =========================
			 */

			HttpSession session = request.getSession(true);
			session.setAttribute("user", user);
			session.setAttribute("userId", user.getUserId());
			session.setAttribute("role", user.getRole());

			responseMap.put("success", true);
			responseMap.put("userId", user.getUserId());
			responseMap.put("name", user.getName());
			responseMap.put("email", user.getEmail());
			responseMap.put("role", user.getRole());

			/*
			 * ========================= SHOP ADMIN SHOP INFO =========================
			 */

			if ("SHOP_ADMIN".equals(user.getRole().toString())) {

				Shop shop = shopService.getShopByAdmin(user.getUserId());

				if (shop != null) {
					responseMap.put("shopId", shop.getShopId());
					responseMap.put("shopName", shop.getShopName());
				}
			}

		} else {

			responseMap.put("success", false);
			responseMap.put("message", "Invalid email or password");
		}

		String json = gson.toJson(responseMap);
		response.getWriter().write(json);
	}
}