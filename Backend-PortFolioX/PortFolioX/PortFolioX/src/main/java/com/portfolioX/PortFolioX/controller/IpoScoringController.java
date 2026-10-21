package com.portfolioX.PortFolioX.controller;

import com.portfolioX.PortFolioX.dto.ScoreLogResponseDTO;
import com.portfolioX.PortFolioX.service.IpoScoringService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ipos")
public class IpoScoringController {
    private final IpoScoringService ipoScoringService;


    public IpoScoringController(IpoScoringService ipoScoringService) {
        this.ipoScoringService = ipoScoringService;
    }
    @PostMapping("/{ipoId}/score")
    public ResponseEntity<ScoreLogResponseDTO> scoreIpo(
            @PathVariable long ipoId){
        ScoreLogResponseDTO result = ipoScoringService.scoreIpo(ipoId);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

}
