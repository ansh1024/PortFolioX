package com.portfolioX.PortFolioX.service;

import com.portfolioX.PortFolioX.dto.RiskAssessmentResult;
import com.portfolioX.PortFolioX.dto.RiskProfileRequestDTO;
import com.portfolioX.PortFolioX.entity.RiskCategory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class RiskAssessmentService {

    private void validateAnswers(RiskProfileRequestDTO request) {
        if (request.getInvestmentHorizon() == null ||
                request.getEmergencySavings() == null ||
                request.getEssentialExpenseDependency() == null ||
                request.getDebtManageability() == null ||
                request.getLossReaction() == null ||
                request.getLossTolerance() == null ||
                request.getInvestmentExperience() == null ||
                request.getInvestmentObjective() == null) {

            throw new IllegalArgumentException("All risk assessment answers are required");
        }

        if (!isValidAnswer(request.getInvestmentHorizon()) ||
                !isValidAnswer(request.getEmergencySavings()) ||
                !isValidAnswer(request.getEssentialExpenseDependency()) ||
                !isValidAnswer(request.getDebtManageability()) ||
                !isValidAnswer(request.getLossReaction()) ||
                !isValidAnswer(request.getLossTolerance()) ||
                !isValidAnswer(request.getInvestmentExperience()) ||
                !isValidAnswer(request.getInvestmentObjective())) {

            throw new IllegalArgumentException("Each answer must be between 0 and 3");
        }
    }

    private boolean isValidAnswer(Integer answer) {
        return answer >= 0 && answer <= 3;
    }


    private int calculateRawScore(RiskProfileRequestDTO request) {
        validateAnswers(request);

        return answerPoints(request.getInvestmentHorizon())
                + answerPoints(request.getEmergencySavings())
                + answerPoints(3 - request.getEssentialExpenseDependency())
                + answerPoints(request.getDebtManageability())
                + answerPoints(request.getLossReaction())
                + answerPoints(request.getLossTolerance())
                + answerPoints(request.getInvestmentExperience())
                + answerPoints(request.getInvestmentObjective());
    }


    private int answerPoints(Integer answer) {
        return switch (answer) {
            case 0 -> 0;
            case 1 -> 3;
            case 2 -> 7;
            case 3 -> 10;
            default -> throw new IllegalArgumentException(
                    "Answer must be between 0 and 3"
            );
        };
    }
        private BigDecimal calculateRiskScore(int rawScore) {
            return BigDecimal.valueOf(rawScore)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(80), 2, RoundingMode.HALF_UP);
        }


    private RiskCategory determineRiskCategory(BigDecimal riskScore) {
        if (riskScore.compareTo(BigDecimal.valueOf(25)) < 0) {
            return RiskCategory.LOW;
        }

        if (riskScore.compareTo(BigDecimal.valueOf(50)) < 0) {
            return RiskCategory.MODERATE;
        }

        if (riskScore.compareTo(BigDecimal.valueOf(75)) < 0) {
            return RiskCategory.HIGH;
        }

        return RiskCategory.VERY_HIGH;
    }


    public RiskAssessmentResult assessRisk(RiskProfileRequestDTO request) {
        int rawScore = calculateRawScore(request);

        BigDecimal riskScore = calculateRiskScore(rawScore);

        RiskCategory riskCategory = determineRiskCategory(riskScore);
        riskCategory = applyCapacitySafeguards(request, riskCategory);

        return new RiskAssessmentResult(riskScore, riskCategory);
    }


    private RiskCategory applyCapacitySafeguards(
            RiskProfileRequestDTO request,
            RiskCategory calculatedCategory) {


        boolean limitedCapacity =
                request.getEmergencySavings() == 0
                        || request.getEssentialExpenseDependency() == 3
                        || request.getDebtManageability() == 0;


        if (limitedCapacity
                && (calculatedCategory == RiskCategory.HIGH
                || calculatedCategory == RiskCategory.VERY_HIGH)) {
            return RiskCategory.MODERATE;
        }

        return calculatedCategory;
    }


}

