package com.portfolioX.PortFolioX.filter;
import com.portfolioX.PortFolioX.entity.User;
import com.portfolioX.PortFolioX.repository.UserRepo;
import com.portfolioX.PortFolioX.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

        private final JwtService jwtService;
        private final UserRepo userRepo;


    public JwtAuthFilter(JwtService jwtService,UserRepo userRepo) {
        this.jwtService = jwtService;
        this.userRepo=userRepo;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader=request.getHeader("Authorization");
        if(authHeader==null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request,response);
            return;
        }
        //takes everything after the token prefix (7->onwards) takes only the imp jwt part
        String token= authHeader.substring(7);
        long userId;
        try{
            userId= jwtService.validateToken(token);
        } catch (Exception e) {
            e.printStackTrace(); // Temporary debugging only
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        User user =userRepo.findById(userId)
                .orElseThrow(()->new ServletException("User not found"));
        var authentication= new UsernamePasswordAuthenticationToken(
                user.getUserId(),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_"+user.getRole().name()
                ))
        );
        SecurityContextHolder.getContext()
                .setAuthentication(authentication);
        filterChain.doFilter(request,response);
    }
}
