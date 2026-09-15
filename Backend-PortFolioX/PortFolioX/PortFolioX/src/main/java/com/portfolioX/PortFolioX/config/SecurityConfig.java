package com.portfolioX.PortFolioX.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain securityfilterchain(HttpSecurity http) throws Exception{

        http
                .csrf(customizer->customizer.disable())
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/users/**").permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(sesssion-> sesssion.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();

    }

}
