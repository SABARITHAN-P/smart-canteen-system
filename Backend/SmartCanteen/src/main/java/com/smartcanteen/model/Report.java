package com.smartcanteen.model;

import java.time.LocalDateTime;

public class Report {

	private int reportId;
	private int userId;
	private Integer orderId;

	private String issueCategory;
	private String issueType;
	private String description;

	private String status;
	private transient LocalDateTime reportTime;

	public Report() {
	}

	public Report(int reportId, int userId, Integer orderId, String issueCategory, String issueType, String description,
			String status) {

		this.reportId = reportId;
		this.userId = userId;
		this.orderId = orderId;
		this.issueCategory = issueCategory;
		this.issueType = issueType;
		this.description = description;
		this.status = status;
	}

	public int getReportId() {
		return reportId;
	}

	public void setReportId(int reportId) {
		this.reportId = reportId;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public Integer getOrderId() {
		return orderId;
	}

	public void setOrderId(Integer orderId) {
		this.orderId = orderId;
	}

	public String getIssueCategory() {
		return issueCategory;
	}

	public void setIssueCategory(String issueCategory) {
		this.issueCategory = issueCategory;
	}

	public String getIssueType() {
		return issueType;
	}

	public void setIssueType(String issueType) {
		this.issueType = issueType;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getReportTime() {
		return reportTime;
	}

	public void setReportTime(LocalDateTime reportTime) {
		this.reportTime = reportTime;
	}
}