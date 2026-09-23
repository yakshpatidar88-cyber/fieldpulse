package com.fieldpulse.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fieldpulse.dto.auth.LoginRequestDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
public class DispatchWorkflowIntegrationTest extends FieldPulseContainerBaseTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String obtainDispatcherJwtToken() throws Exception {
        LoginRequestDto loginRequest = new LoginRequestDto("dispatcher.sarah@fieldpulse.io", "password123");

        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        // Extract accessToken from ApiResponse envelope
        var jsonNode = objectMapper.readTree(responseBody);
        return jsonNode.get("data").get("accessToken").asText();
    }

    @Test
    @DisplayName("IT-01: Health check endpoint should return UP status without authentication")
    void testPublicHealthEndpoint() throws Exception {
        mockMvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("FieldPulse-backend"));
    }

    @Test
    @DisplayName("IT-02: Authentication flow should return valid JWT and user details for dispatcher")
    void testDispatcherAuthenticationFlow() throws Exception {
        LoginRequestDto loginRequest = new LoginRequestDto("dispatcher.sarah@fieldpulse.io", "password123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").isString())
                .andExpect(jsonPath("$.data.email").value("dispatcher.sarah@fieldpulse.io"))
                .andExpect(jsonPath("$.data.role").value("ROLE_DISPATCHER"));
    }

    @Test
    @DisplayName("IT-03: Protected SLA dashboard endpoint should reject unauthenticated requests")
    void testProtectedEndpointRejectsAnonymous() throws Exception {
        mockMvc.perform(get("/sla/dashboard"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("IT-04: Authenticated dispatcher can query jobs and SLA dashboard metrics")
    void testDispatcherAuthorizedQueries() throws Exception {
        String token = obtainDispatcherJwtToken();
        assertNotNull(token);

        mockMvc.perform(get("/sla/dashboard")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.complianceRatePercent").isNumber());

        mockMvc.perform(get("/jobs")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
