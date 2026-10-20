package com.portfolioX.PortFolioX.service;

import com.portfolioX.PortFolioX.dto.RiskAssessmentResult;
import com.portfolioX.PortFolioX.dto.RiskProfileRequestDTO;
import com.portfolioX.PortFolioX.dto.RiskProfileResponseDTO;
import com.portfolioX.PortFolioX.entity.RiskProfile;
import com.portfolioX.PortFolioX.entity.User;
import com.portfolioX.PortFolioX.mapper.RiskProfileMapper;
import com.portfolioX.PortFolioX.repository.RiskProfileRepo;
import com.portfolioX.PortFolioX.repository.UserRepo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RiskProfileService {
    private final RiskProfileRepo riskProfileRepo;
    private final UserRepo userRepo;
    private final RiskAssessmentService riskAssessmentService;

    public RiskProfileService(
            RiskProfileRepo riskProfileRepo,
            UserRepo userRepo,
            RiskAssessmentService riskAssessmentService) {

        this.riskProfileRepo = riskProfileRepo;
        this.userRepo = userRepo;
        this.riskAssessmentService = riskAssessmentService;
    }
    private Long getCurrentUserId(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();

        return Long.parseLong(authentication.getPrincipal().toString());
    }
    public List<RiskProfileResponseDTO> getMyRiskProfiles(){
        Long userId=getCurrentUserId();

        List<RiskProfile> profiles =  riskProfileRepo.findAllByUser_UserIdOrderByCalculatedAtDesc(userId);
        return profiles.stream()
                .map(RiskProfileMapper::toResponseDTO)
                .toList();
    }

    public RiskProfileResponseDTO assessAndSaveRiskProfile(
            RiskProfileRequestDTO request) {

        Long userId = getCurrentUserId();

        User user = userRepo.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        RiskAssessmentResult result =
                riskAssessmentService.assessRisk(request);

        Long maxId = riskProfileRepo.findMaxNumericRiskProfileId();

        long nextId = (maxId == null) ? 101L : maxId + 1;

        RiskProfile riskProfile = new RiskProfile();

        riskProfile.setRiskProfileId(String.valueOf(nextId));
        riskProfile.setUser(user);
        riskProfile.setRiskScore(result.getRiskScore());
        riskProfile.setRiskCategory(result.getRiskCategory());
        riskProfile.setCalculatedAt(LocalDateTime.now());

        RiskProfile savedProfile = riskProfileRepo.save(riskProfile);

        return RiskProfileMapper.toResponseDTO(savedProfile);
    }


}
