package com.portfolioX.PortFolioX.controller;

import org.junit.Test;
import org.springframework.security.authorization.ConditionalAuthorizationManager;
import tools.jackson.databind.json.JsonMapper;
import com.portfolioX.PortFolioX.dto.DecisionJournalRequestDTO;
import com.portfolioX.PortFolioX.entity.Role;
import com.portfolioX.PortFolioX.entity.User;
import com.portfolioX.PortFolioX.exception.DuplicateJournalException;
import com.portfolioX.PortFolioX.exception.GlobalExceptionHandler;
import com.portfolioX.PortFolioX.exception.ResourceNotFoundException;
import com.portfolioX.PortFolioX.filter.JwtAuthFilter;
import com.portfolioX.PortFolioX.repository.UserRepo;
import com.portfolioX.PortFolioX.service.DecisionJournalService;
import com.portfolioX.PortFolioX.service.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.servlet.FilterRegistrationBean;   // Boot 4 package
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DecisionJournalController.class)
@Import({
        JwtAuthFilter.class,
        GlobalExceptionHandler.class,
        DecisionJournalControllerTest.TestSecurityConfig.class
})
class DecisionJournalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper jsonMapper;

    @MockitoBean
    private DecisionJournalService journalService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepo userRepo;

    private static final long USER_ID = 1L;
    private static final long IPO_ID = 10L;
    private static final String TOKEN = "valid-test-token";

    @TestConfiguration
    @EnableWebSecurity
    static class TestSecurityConfig {

        // THE FIX: stop Boot from also registering JwtAuthFilter as a raw servlet filter
        @Bean
        static FilterRegistrationBean<JwtAuthFilter> jwtFilterRegistration(JwtAuthFilter filter) {
            FilterRegistrationBean<JwtAuthFilter> registration = new FilterRegistrationBean<>(filter);
            registration.setEnabled(false);
            return registration;
        }

        @Bean
        SecurityFilterChain testSecurityFilterChain(
                HttpSecurity http,
                JwtAuthFilter jwtAuthFilter
        ) throws Exception {
            return http
                    .csrf(csrf -> csrf.disable())
                    .sessionManagement(session -> session
                            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .authorizeHttpRequests(auth -> auth
                            .anyRequest().authenticated())
                    .exceptionHandling(exceptions -> exceptions
                            .authenticationEntryPoint((request, response, exception) ->
                                    response.sendError(401)))
                    .addFilterBefore(
                            jwtAuthFilter,
                            UsernamePasswordAuthenticationFilter.class)
                    .build();
        }
    }

    private void authenticateUser() {
        ConditionalAuthorizationManager.when(jwtService.validateToken(TOKEN)).thenReturn(USER_ID);

        User user = new User();
        user.setUserId(USER_ID);
        user.setRole(Role.USER);

        ConditionalAuthorizationManager.when(userRepo.findById(USER_ID))
                .thenReturn(Optional.of(user));
    }

    @Test
    void getMyJournals_withoutToken_returnsUnauthorized() throws Exception {
        mockMvc.perform(get("/journal/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getJournal_whenJournalMissing_returnsNotFound() throws Exception {
        authenticateUser();

        ConditionalAuthorizationManager.when(journalService.getJournal(IPO_ID, USER_ID))
                .thenThrow(new ResourceNotFoundException("Journal not found"));

        mockMvc.perform(get("/journal/{ipoId}", IPO_ID)
                        .header("Authorization", "Bearer " + TOKEN))
                .andExpect(status().isNotFound());

        verify(journalService).getJournal(IPO_ID, USER_ID);
    }

    @Test
    void createJournal_whenDuplicate_returnsConflict() throws Exception {
        authenticateUser();

        DecisionJournalRequestDTO request = new DecisionJournalRequestDTO();
        request.setContent("Investment reasoning");

        ConditionalAuthorizationManager.when(journalService.createJournal(
                eq(IPO_ID),
                eq(USER_ID),
                any(DecisionJournalRequestDTO.class)
        )).thenThrow(new DuplicateJournalException(
                "A journal already exists for this IPO"
        ));

        mockMvc.perform(post("/journal/{ipoId}", IPO_ID)
                        .header("Authorization", "Bearer " + TOKEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());

        verify(journalService).createJournal(
                eq(IPO_ID),
                eq(USER_ID),
                any(DecisionJournalRequestDTO.class)
        );
    }

    @Test
    void getMyJournals_withInvalidToken_returnsUnauthorized() throws Exception {
        ConditionalAuthorizationManager.when(jwtService.validateToken(TOKEN))
                .thenThrow(new IllegalArgumentException("Invalid token"));

        mockMvc.perform(get("/journal/me")
                        .header("Authorization", "Bearer " + TOKEN))
                .andExpect(status().isUnauthorized());
    }
}
