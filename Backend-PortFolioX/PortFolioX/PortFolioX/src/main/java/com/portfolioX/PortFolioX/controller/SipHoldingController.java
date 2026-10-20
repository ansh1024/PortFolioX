package com.portfolioX.PortFolioX.controller;

import com.portfolioX.PortFolioX.dto.SipHoldingRequestDTO;
import com.portfolioX.PortFolioX.dto.SipHoldingResponseDTO;
import com.portfolioX.PortFolioX.service.SipHoldingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sip-holdings")
public class SipHoldingController {
    private final SipHoldingService sipHoldingService;
    public SipHoldingController (SipHoldingService sipHoldingService){
        this.sipHoldingService=sipHoldingService;
    }
    @PostMapping
    public ResponseEntity<SipHoldingResponseDTO> createHolding(
            @RequestBody SipHoldingRequestDTO dto){
        SipHoldingResponseDTO response= sipHoldingService.createHolding(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }
    @GetMapping
    public ResponseEntity<List<SipHoldingResponseDTO>> getAllHolding(){
        return ResponseEntity.ok(sipHoldingService.getAllMyHolding());
    }
    @GetMapping("/{holdingId}")
    public ResponseEntity<SipHoldingResponseDTO> getHoldingById(
            @PathVariable String holdingId){
        return ResponseEntity.ok(sipHoldingService.getHoldingbyId(holdingId));
    }
    @PutMapping("/{holdingId}")
    public ResponseEntity<SipHoldingResponseDTO> updateHolding(
            @PathVariable String holdingId,
            @RequestBody SipHoldingRequestDTO dto){
        return ResponseEntity.ok(sipHoldingService.updateHolding(holdingId,dto));
    }
    @DeleteMapping("/{holdingId}")
    public ResponseEntity<Void>deleteHolding(
            @PathVariable String holdingId){
        sipHoldingService.deleteHolding(holdingId);
        return ResponseEntity.noContent().build();
    }
}
