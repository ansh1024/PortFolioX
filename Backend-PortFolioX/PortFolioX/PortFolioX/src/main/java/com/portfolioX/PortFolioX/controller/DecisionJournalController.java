package com.portfolioX.PortFolioX.controller;

import com.portfolioX.PortFolioX.dto.DecisionJournalRequestDTO;
import com.portfolioX.PortFolioX.dto.DecisionJournalResponseDTO;
import com.portfolioX.PortFolioX.service.DecisionJournalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/journal")
public class DecisionJournalController {

    private final DecisionJournalService journalService;

    public DecisionJournalController(
            DecisionJournalService journalService) {
        this.journalService = journalService;
    }

    @PostMapping("/{ipoId:\\d+}")
    public ResponseEntity<DecisionJournalResponseDTO> createJournal(
            @PathVariable long ipoId,
            @RequestBody DecisionJournalRequestDTO requestDTO,
            Authentication authentication) {

        long userId = Long.parseLong(authentication.getName());

        DecisionJournalResponseDTO response =
                journalService.createJournal(ipoId, userId, requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{ipoId:\\d+}")
    public ResponseEntity<DecisionJournalResponseDTO> getJournal(
            @PathVariable long ipoId,
            Authentication authentication) {

        long userId = Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
                journalService.getJournal(ipoId, userId));
    }

    @GetMapping("/me")
    public ResponseEntity<List<DecisionJournalResponseDTO>> getMyJournals(
            Authentication authentication) {

        long userId = Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
                journalService.getMyJournals(userId));
    }

    @PutMapping("/{ipoId:\\d+}")
    public ResponseEntity<DecisionJournalResponseDTO> updateJournal(
            @PathVariable long ipoId,
            @RequestBody DecisionJournalRequestDTO requestDTO,
            Authentication authentication) {

        long userId = Long.parseLong(authentication.getName());

        return ResponseEntity.ok(
                journalService.updateJournal(ipoId, userId, requestDTO));
    }
}
