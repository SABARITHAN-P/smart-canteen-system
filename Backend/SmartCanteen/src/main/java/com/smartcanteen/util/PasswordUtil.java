package com.smartcanteen.util;

//Java’s hashing tool
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class PasswordUtil {
	public static String hashPassword(String password) {
	    try {
	    	//Give me a hashing machine that uses SHA-256
	        MessageDigest md = MessageDigest.getInstance("SHA-256");
	        
	        //password.getBytes() → converts text to bytes
	        //md.digest(...) → runs SHA-256
	        //Output → array of bytes (raw hash)
	        byte[] hashedBytes = md.digest(password.getBytes());

	        StringBuilder sb = new StringBuilder();
	        for (byte b : hashedBytes) {
	        	
	        	//%02x converts one byte into exactly two hex characters.
	        	//x convert number to hexadecimal 
	        	
	        	//b = 15
	        	//String.format("%02x", 15)
	        	//Result:"0f"
	        	
	            sb.append(String.format("%02x", b));
	        }
	        return sb.toString();

	    } catch (NoSuchAlgorithmException e) {
	        throw new RuntimeException("Hashing failed", e);
	    }
	}
	
//	public static void main(String[] args) {
//        String hash = PasswordUtil.hashPassword("ravi@123");
//        System.out.println(hash);
//    }
}
