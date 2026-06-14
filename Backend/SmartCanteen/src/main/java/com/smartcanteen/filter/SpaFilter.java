package com.smartcanteen.filter;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

@WebFilter("/*")
public class SpaFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        String path = req.getRequestURI().substring(req.getContextPath().length());

        // Do not forward API requests or direct static files
        if (path.startsWith("/api/") || path.contains(".")) {
            chain.doFilter(request, response);
        } else {
            // Forward everything else to index.html for React Router routing
            request.getRequestDispatcher("/index.html").forward(request, response);
        }
    }

    @Override
    public void destroy() {}
}
