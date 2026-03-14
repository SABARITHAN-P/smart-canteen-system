package com.smartcanteen.util;

import java.util.Properties;

import jakarta.mail.*;
import jakarta.mail.internet.*;

public class EmailUtil {

    private static final String FROM_EMAIL = "smartcanteenadmin@gmail.com";
    private static final String APP_PASSWORD = "fapu oatp ixxc vtki";

    public static void sendOtp(String toEmail, String otp) {

        Properties props = new Properties();

        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        Session session = Session.getInstance(props,
                new Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(FROM_EMAIL, APP_PASSWORD);
                    }
                });

        try {

            Message message = new MimeMessage(session);

            message.setFrom(new InternetAddress(FROM_EMAIL));

            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(toEmail)
            );

            message.setSubject("Smart Canteen Password Reset OTP");

            message.setText(
                    "Your OTP is: " + otp +
                    "\nThis OTP is valid for 5 minutes."
            );

            Transport.send(message);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}