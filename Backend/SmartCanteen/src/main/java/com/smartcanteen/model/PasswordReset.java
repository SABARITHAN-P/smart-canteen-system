package com.smartcanteen.model;

import java.time.LocalDateTime;

public class PasswordReset {

	private int id;
	private int userId;
	private String otpCode;
	private LocalDateTime expiryTime;
	private boolean isUsed;
	private LocalDateTime createdAt;

	public PasswordReset() {
	}

	public PasswordReset(int id, int userId, String otpCode, LocalDateTime expiryTime, boolean isUsed,
			LocalDateTime createdAt) {
		this.id = id;
		this.userId = userId;
		this.otpCode = otpCode;
		this.expiryTime = expiryTime;
		this.isUsed = isUsed;
		this.createdAt = createdAt;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getOtpCode() {
		return otpCode;
	}

	public void setOtpCode(String otpCode) {
		this.otpCode = otpCode;
	}

	public LocalDateTime getExpiryTime() {
		return expiryTime;
	}

	public void setExpiryTime(LocalDateTime expiryTime) {
		this.expiryTime = expiryTime;
	}

	public boolean isUsed() {
		return isUsed;
	}

	public void setIsUsed(boolean isUsed) {
		this.isUsed = isUsed;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}