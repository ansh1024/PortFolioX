
package com.portfolioX.PortFolioX.dto;

import com.portfolioX.PortFolioX.entity.RiskCategory;
import java.math.BigDecimal;

public class RiskAssessmentResult {

    private BigDecimal riskScore;
    private RiskCategory riskCategory;

    public RiskAssessmentResult(
            BigDecimal riskScore,
            RiskCategory riskCategory) {
        this.riskScore = riskScore;
        this.riskCategory = riskCategory;
    }

    public BigDecimal getRiskScore() {
        return riskScore;
    }

    public RiskCategory getRiskCategory() {
        return riskCategory;
    }
}
