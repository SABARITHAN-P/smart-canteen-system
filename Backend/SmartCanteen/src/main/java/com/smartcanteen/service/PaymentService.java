package com.smartcanteen.service;

import com.smartcanteen.dao.PaymentDAO;

public class PaymentService {

	private PaymentDAO paymentDAO = new PaymentDAO();

	public int getOrderIdByPayment(int paymentId) {
		return paymentDAO.getOrderIdByPayment(paymentId);
	}

	public int createPayment(int orderId, double amount) {
		if (orderId <= 0 || amount <= 0) {
			throw new IllegalArgumentException("Invalid payment data");
		}
		return paymentDAO.createPayment(orderId, amount);
	}

	public boolean completePayment(int paymentId) {
		return paymentDAO.updatePaymentStatus(paymentId, "SUCCESS");
	}

	public boolean failPayment(int paymentId) {
		return paymentDAO.updatePaymentStatus(paymentId, "FAILED");
	}

	public boolean refundPayment(int orderId) {
		return paymentDAO.refundPaymentByOrderId(orderId);
	}

}