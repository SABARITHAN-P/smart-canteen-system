package com.smartcanteen.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.smartcanteen.dao.PasswordResetDAO;
import com.smartcanteen.dao.UserDAO;
import com.smartcanteen.model.PasswordReset;
import com.smartcanteen.model.Role;
import com.smartcanteen.model.Status;
import com.smartcanteen.model.User;
import com.smartcanteen.util.EmailUtil;
import com.smartcanteen.util.OtpUtil;
import com.smartcanteen.util.PasswordUtil;

public class UserService {

	private UserDAO userDAO = new UserDAO();
	private PasswordResetDAO passwordResetDAO = new PasswordResetDAO();

	// Registration
	public boolean register(User user) {
		if (user == null) {
			return false;
		}

		String name = user.getName();
		String email = user.getEmail();
		String password = user.getPassword();
		String mobile = user.getMobileNumber();

		if (name != null)
			name = name.trim();
		if (email != null)
			email = email.trim().toLowerCase();
		if (password != null)
			password = password.trim();
		if (mobile != null)
			mobile = mobile.trim();

		if (name == null || name.isEmpty())
			return false;
		if (email == null || email.isEmpty())
			return false;
		if (password == null || password.isEmpty() || password.length() < 6)
			return false;
		if (mobile == null || mobile.isEmpty())
			return false;

		if (!mobile.matches("\\d{10}"))
			return false;

		if (userDAO.getUserByEmail(email) != null) {
			return false;
		}

		user.setName(name);
		user.setEmail(email);
		user.setMobileNumber(mobile);
		if (user.getRole() == null) {
			user.setRole(Role.USER);
		}
		user.setStatus(Status.ACTIVE);

		String hashedPassword = PasswordUtil.hashPassword(password);
		user.setPassword(hashedPassword);
		boolean result = userDAO.registerUser(user);
		return result;
	}

	// Login
	public User login(String email, String password) {

		if (email == null || password == null) {
			return null;
		}
		email = email.trim().toLowerCase();
		password = password.trim();
		if (email.isEmpty() || password.isEmpty()) {
			return null;
		}
		User user = userDAO.getUserByEmail(email);
		if (user == null)
			return null;
		if (user.getStatus() == Status.BLOCKED)
			return null;

		String hashedPassword = PasswordUtil.hashPassword(password);
		if (!hashedPassword.equals(user.getPassword()))
			return null;
		return user;

	}

	// Update Profile
	public boolean updateProfile(User user) {

		if (user == null || user.getUserId() <= 0) {
			return false;
		}

		User existingUser = userDAO.getUserById(user.getUserId());

		if (existingUser == null) {
			return false;
		}

		if (user.getName() != null) {
			String name = user.getName().trim();
			if (!name.isEmpty()) {
				existingUser.setName(name);
			}
		}

		if (user.getMobileNumber() != null) {
			String mobile = user.getMobileNumber().trim();
			if (mobile.matches("\\d{10}")) {
				existingUser.setMobileNumber(mobile);
			}
		}

		return userDAO.updateUser(existingUser);
	}

	// Change Password
	public boolean changePassword(int userId, String oldPassword, String newPassword) {
		if (userId <= 0) {
			return false;
		}
		if (oldPassword == null || newPassword == null) {
			return false;
		}
		oldPassword = oldPassword.trim();
		newPassword = newPassword.trim();

		if (oldPassword.isEmpty() || newPassword.isEmpty()) {
			return false;
		}
		if (oldPassword.equals(newPassword)) {
			return false;
		}
		if (newPassword.length() < 6) {
			return false;
		}
		User user = userDAO.getUserById(userId);
		if (user == null) {
			return false;
		}

		String hashedOldPassword = PasswordUtil.hashPassword(oldPassword);
		if (!hashedOldPassword.equals(user.getPassword())) {
			return false;
		}

		String hashedNewPassword = PasswordUtil.hashPassword(newPassword);
		return userDAO.updatePassword(userId, hashedNewPassword);
	}

	// forgot password
	public boolean initiateForgotPassword(String email) {

		if (email == null || email.isBlank()) {
			return false;
		}

		email = email.trim().toLowerCase();

		User user = userDAO.getUserByEmail(email);

		if (user == null) {
			return true; // do not reveal existence
		}

		if (user.getRole() == Role.MAIN_ADMIN) {
			return false;
		}

		String otp = OtpUtil.generateOtp();
		LocalDateTime expiryTime = OtpUtil.generateExpiryTime();

		boolean saved = passwordResetDAO.saveOtp(user.getUserId(), otp, expiryTime);

		if (!saved) {
			return false;
		}

		EmailUtil.sendOtp(user.getEmail(), otp);

		return true;
	}

	// Reset password
	public boolean resetPassword(String email, String otp, String newPassword) {

		if (email == null || otp == null || newPassword == null) {
			return false;
		}

		email = email.trim().toLowerCase();

		User user = userDAO.getUserByEmail(email);

		if (user == null) {
			return false;
		}

		PasswordReset reset = passwordResetDAO.getLatestValidOtp(user.getUserId());

		if (reset == null) {
			return false;
		}

		if (!reset.getOtpCode().equals(otp)) {
			return false;
		}

		boolean marked = passwordResetDAO.markOtpAsUsed(reset.getId());

		if (!marked) {
			return false;
		}

		String hashedNewPassword = PasswordUtil.hashPassword(newPassword);

		return userDAO.updatePassword(user.getUserId(), hashedNewPassword);
	}

	// Block User
	public boolean blockUser(int userId) {
		if (userId <= 0) {
			return false;
		}
		User user = userDAO.getUserById(userId);
		if (user == null) {
			return false;
		}
		if (user.getStatus() == Status.BLOCKED) {
			return false;
		}
		return userDAO.blockUser(userId);
	}

	// Unblock User
	public boolean unblockUser(int userId) {
		if (userId <= 0) {
			return false;
		}
		User user = userDAO.getUserById(userId);
		if (user == null) {
			return false;
		}
		if (user.getStatus() == Status.ACTIVE) {
			return false;
		}
		return userDAO.unblockUser(userId);
	}

	public List<User> getUsersByRole(Role shopAdmin) {
		if (shopAdmin == null) {
			return new ArrayList<>();
		}
		return userDAO.getUsersByRole(shopAdmin);
	}

	public User getUserById(int userId) {
		if (userId <= 0) {
			return null;
		}
		return userDAO.getUserById(userId);
	}
}