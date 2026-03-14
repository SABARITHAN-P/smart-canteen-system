package com.smartcanteen.service;

import com.smartcanteen.dao.AdminDashboardDAO;
import java.util.Map;

public class AdminDashboardService {

    private AdminDashboardDAO dao = new AdminDashboardDAO();

    public Map<String, Object> getDashboardStats(int shopId) {
        return dao.getStats(shopId);
    }
}