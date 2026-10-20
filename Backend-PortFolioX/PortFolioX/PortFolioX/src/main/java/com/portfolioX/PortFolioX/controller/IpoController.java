package com.portfolioX.PortFolioX.controller;

import com.portfolioX.PortFolioX.entity.IpoMaster;
import com.portfolioX.PortFolioX.service.IpoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ipos")
public class IpoController {
    private final IpoService ipoService;

    public IpoController(IpoService ipoService) {
        this.ipoService = ipoService;
    }
    @GetMapping
    public ResponseEntity<List<IpoMaster>> getAllIpos(){
        return ResponseEntity.ok(ipoService.getAllIpos());
    }
    @GetMapping("/{ipoId}")
    public ResponseEntity<IpoMaster> getIpoById(
            @Valid @PathVariable long ipoId){
        return ipoService.getIpoById(ipoId)
                .map(ResponseEntity::ok)
                .orElseGet(()->ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<IpoMaster> createIpo(
            @Valid @RequestBody IpoMaster ipo){
        IpoMaster savedIpo = ipoService.createIpo(ipo);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedIpo);
    }
    @PutMapping("/{ipoId}")
    public ResponseEntity<IpoMaster> updateIpo(
            @PathVariable long ipoId,
            @Valid@RequestBody IpoMaster ipo){
        IpoMaster updateIpo = ipoService.updateIpo(ipoId,ipo);
        if(updateIpo==null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updateIpo);
    }
    @DeleteMapping("/{ipoId}")
    public ResponseEntity<Void> deleteIpo(
            @PathVariable long ipoId){
        boolean deleted = ipoService.deleteIpo(ipoId);
        if(!deleted){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
