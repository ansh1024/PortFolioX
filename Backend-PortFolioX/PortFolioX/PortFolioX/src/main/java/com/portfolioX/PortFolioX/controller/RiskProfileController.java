package com.portfolioX.PortFolioX.controller;

import com.portfolioX.PortFolioX.dto.RiskProfileRequestDTO;
import com.portfolioX.PortFolioX.dto.RiskProfileResponseDTO;
import com.portfolioX.PortFolioX.service.RiskProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/risk-profiles")
public class RiskProfileController {
    private final RiskProfileService riskProfileService;


    public RiskProfileController(RiskProfileService riskProfileService) {
        this.riskProfileService = riskProfileService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<RiskProfileResponseDTO>> getMyRiskProfiles(){
        return ResponseEntity.ok(
                riskProfileService.getMyRiskProfiles()
        );
    }

    @PostMapping("/me")
    public ResponseEntity<RiskProfileResponseDTO> assessMyRiskProfile(
            @RequestBody RiskProfileRequestDTO request) {

        RiskProfileResponseDTO response =
                riskProfileService.assessAndSaveRiskProfile(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
