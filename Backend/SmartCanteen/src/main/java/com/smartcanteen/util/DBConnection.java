package com.smartcanteen.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

	private static final String URL = "jdbc:mysql://localhost:3306/smartcanteen";
	private static final String USER = "root";
	private static final String PASSWORD = "sabari2005";

	private DBConnection() {
		// prevent instantiation
	}

	public static Connection getConnection() {
		try {
			return DriverManager.getConnection(URL, USER, PASSWORD);
		} catch (SQLException e) {
			throw new RuntimeException("Database connection failed", e);
		}
	}
}