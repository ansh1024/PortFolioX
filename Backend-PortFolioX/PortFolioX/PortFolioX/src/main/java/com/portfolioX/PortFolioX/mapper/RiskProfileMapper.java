package com.portfolioX.PortFolioX.mapper;

import com.portfolioX.PortFolioX.dto.RiskProfileResponseDTO;
import com.portfolioX.PortFolioX.entity.RiskProfile;

public class RiskProfileMapper {
    private RiskProfileMapper(){};
    public static RiskProfileResponseDTO toResponseDTO(RiskProfile riskProfile){
        RiskProfileResponseDTO dto = new RiskProfileResponseDTO();

        dto.setRiskProfileId(riskProfile.getRiskProfileId());
        dto.setRiskScore(riskProfile.getRiskScore());
        dto.setRiskCategory(riskProfile.getRiskCategory());
        dto.setCalculatedAt(riskProfile.getCalculatedAt());

        return dto;
    }
}
