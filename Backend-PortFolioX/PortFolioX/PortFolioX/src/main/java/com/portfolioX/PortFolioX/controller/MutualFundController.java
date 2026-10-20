package com.portfolioX.PortFolioX.controller;

import com.portfolioX.PortFolioX.dto.MutualFundRequestDTO;
import com.portfolioX.PortFolioX.dto.MutualFundResponseDTO;
import com.portfolioX.PortFolioX.entity.MutualFund;
import com.portfolioX.PortFolioX.service.MutualFundService;
import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/mutual-funds")
public class MutualFundController {
    private final MutualFundService mutualFundService;

    public MutualFundController(MutualFundService mutualFundService){
        this.mutualFundService=mutualFundService;
    }
    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<MutualFundResponseDTO>> getAllFunds(){
        return ResponseEntity.ok(mutualFundService.getAllFunds());
    }
    @GetMapping("/{fundId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<MutualFundResponseDTO> getFundById(
            @PathVariable String fundId){
        Optional<MutualFundResponseDTO> fund =
                mutualFundService.getFundById(fundId);

        return fund.map(ResponseEntity::ok)
                .orElseGet(()->ResponseEntity.notFound().build());

    }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MutualFundResponseDTO> createFund(
            @RequestBody MutualFundRequestDTO dto){
        MutualFundResponseDTO createdFund = mutualFundService.createFund(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(createdFund);
    }
    @PutMapping("/{fundId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MutualFundResponseDTO> updateFund(
            @PathVariable String fundId,
            @RequestBody MutualFundRequestDTO dto){
        Optional<MutualFundResponseDTO> updatedFund =
                mutualFundService.updateFund(fundId,dto);
        return updatedFund.map(ResponseEntity::ok)
                .orElseGet(()->ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{fundId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFund(
            @PathVariable String fundId){
        boolean deleted = mutualFundService.deleteFund(fundId);
        if(!deleted){
            return  ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }


}
