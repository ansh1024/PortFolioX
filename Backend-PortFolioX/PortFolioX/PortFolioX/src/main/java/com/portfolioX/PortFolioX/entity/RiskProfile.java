package com.portfolioX.PortFolioX.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="risk_profile")
public class RiskProfile {

    @Id
    @Column(name="risk_profile_id")
    private String riskProfileId;

    @JoinColumn(name="user_id")
    @ManyToOne
    User user;

    @Column(name="risk_score")
    private BigDecimal riskScore;

    @Column(name="risk_category")
    @Enumerated(EnumType.STRING)
    private RiskCategory riskCategory;

    @Column(name="calculated_at")
    private LocalDateTime calculatedAt;

    public String getRiskProfileId() {
        return riskProfileId;
    }

    public void setRiskProfileId(String riskProfileId) {
        this.riskProfileId = riskProfileId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
