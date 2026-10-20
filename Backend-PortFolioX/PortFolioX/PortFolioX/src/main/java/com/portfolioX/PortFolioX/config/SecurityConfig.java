package com.portfolioX.PortFolioX.config;

import com.portfolioX.PortFolioX.filter.JwtAuthFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain securityfilterchain(HttpSecurity http) throws Exception{

        http
                .csrf(customizer->customizer.disable())
                .authorizeHttpRequests(request -> request
                        .requestMatchers(
                                "/users/",
                                "/users",
                                "/auth/login").permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(exception->
                                exception.authenticationEntryPoint(
                                        (request, response, authException)
                                                ->response.setStatus(HttpServletResponse.SC_UNAUTHORIZED)))
                .sessionManagement(sesssion-> sesssion.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();

    }

}
