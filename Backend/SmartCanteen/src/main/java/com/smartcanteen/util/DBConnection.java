package com.smartcanteen.util;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {

	private DBConnection() {
		// prevent instantiation
	}

	public static Connection getConnection() {
		try {
			String url = EnvUtil.get("DB_URL");
			String user = EnvUtil.get("DB_USER");
			String password = EnvUtil.get("DB_PASSWORD");
			
			Class.forName("org.postgresql.Driver");
			return DriverManager.getConnection(url, user, password);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Database connection failed", e);
		}
	}
}