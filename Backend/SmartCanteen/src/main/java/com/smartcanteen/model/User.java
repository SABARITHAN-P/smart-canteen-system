package com.smartcanteen.model;

import java.time.LocalDateTime;

public class User {
	private int userId;
	private String name;
	private String email;
	private String password;
	private String mobileNumber;
	private Role role;
	private Status status;
	private transient LocalDateTime createdAt;

	public User() {

	}

	public User(String name, String email, String password, String mobileNumber, Role role, Status status) {
		this.name = name;
		this.email = email;
		this.password = password;
		this.mobileNumber = mobileNumber;
		this.role = role;
		this.status = status;
	}

	public User(int userId, String name, String email, String password, String mobileNumber, Role role, Status status,
			LocalDateTime createdAt) {
		this.userId = userId;
		this.name = name;
		this.email = email;
		this.password = password;
		this.mobileNumber = mobileNumber;
		this.role = role;
		this.status = status;
		this.createdAt = createdAt;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}
