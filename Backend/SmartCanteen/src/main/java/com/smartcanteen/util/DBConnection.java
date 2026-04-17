package com.smartcanteen.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

	private static final String URL = "jdbc:mysql://nozomi.proxy.rlwy.net:55084/smartcanteen?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
	private static final String USER = "root";
	private static final String PASSWORD = "BOclAIOOQxZwiixVRXpLcdmHgCNhysgr";

	private DBConnection() {
		// prevent instantiation
	}

	public static Connection getConnection() {
		try {
			return DriverManager.getConnection(URL, USER, PASSWORD);
		} catch (SQLException e) {
    e.printStackTrace();  
    throw new RuntimeException("Database connection failed", e);
}
	}
}