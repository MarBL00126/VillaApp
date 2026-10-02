package mariano.projects.appVillaSanMartin.config;

import java.io.IOException;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// The SPA shell and service worker must always be revalidated; otherwise browsers keep
// pointing at hashed chunks from a previous deploy that no longer exist (404).
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class StaticCacheControlFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        if (!path.startsWith("/api/") && !path.startsWith("/assets/")) {
            response.setHeader("Cache-Control", "no-cache");
        }
        chain.doFilter(request, response);
    }
}
