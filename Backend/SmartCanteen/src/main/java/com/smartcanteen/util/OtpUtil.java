package com.smartcanteen.util;

import java.security.SecureRandom;
import java.time.LocalDateTime;

public final class OtpUtil {

	private static final int OTP_EXPIRY_MINUTES = 5;

	// prevent inheritance because util classes are not meant to extended
	private OtpUtil() {

	}

	// static is used so n0 need to create a object for access
	public static String generateOtp() {
		SecureRandom secureRandom = new SecureRandom();
		// the OTP can be 0,12,0234,and so on so we add 100000 to make it as 6 digit
		int otp = secureRandom.nextInt(900000) + 100000;
		return String.valueOf(otp);
	}

	public static LocalDateTime generateExpiryTime() {
		return LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);
	}
}