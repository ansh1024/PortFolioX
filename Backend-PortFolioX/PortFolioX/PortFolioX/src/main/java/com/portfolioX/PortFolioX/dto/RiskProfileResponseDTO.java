package com.portfolioX.PortFolioX.dto;

import com.portfolioX.PortFolioX.entity.RiskCategory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RiskProfileResponseDTO {
    private String riskProfileId;
    private BigDecimal riskScore;
    private RiskCategory riskCategory;
    private LocalDateTime calculatedAt;

    public String getRiskProfileId() {
        return riskProfileId;
    }

    public void setRiskProfileId(String riskProfileId) {
        this.riskProfileId = riskProfileId;
    }

    public BigDecimal getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(BigDecimal riskScore) {
        this.riskScore = riskScore;
    }

    public RiskCategory getRiskCategory() {
        return riskCategory;
    }

    public void setRiskCategory(RiskCategory riskCategory) {
        this.riskCategory = riskCategory;
    }

    public LocalDateTime getCalculatedAt() {
        return calculatedAt;
    }

    public void setCalculatedAt(LocalDateTime calculatedAt) {
        this.calculatedAt = calculatedAt;
    }
}
