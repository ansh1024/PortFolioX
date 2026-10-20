package com.portfolioX.PortFolioX.controller;

import com.portfolioX.PortFolioX.dto.IpoApplicationResponseDTO;
import com.portfolioX.PortFolioX.entity.IpoApplication;
import com.portfolioX.PortFolioX.mapper.IpoApplicationMapper;
import com.portfolioX.PortFolioX.service.IpoApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ipo-applications")
public class IpoApplicationController {
    private final IpoApplicationService ipoApplicationService;

    public IpoApplicationController(IpoApplicationService ipoApplicationService) {
        this.ipoApplicationService = ipoApplicationService;
    }

    @PostMapping
    public ResponseEntity<IpoApplicationResponseDTO> createApplication(
            @RequestParam long ipoId,
            @RequestParam int lotsApplied) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        long userId = Long.parseLong(authentication.getPrincipal().toString());
        IpoApplication application = ipoApplicationService.createApplication(
                userId, ipoId, lotsApplied);

        return ResponseEntity.status(HttpStatus.CREATED).body(IpoApplicationMapper.toDTO(application));

    }
    @GetMapping
    public ResponseEntity<List<IpoApplicationResponseDTO>> getAllApplications(){
        Authentication authentication=
                SecurityContextHolder.getContext().getAuthentication();
        long userId = Long.parseLong(
                authentication.getPrincipal().toString());

        return ResponseEntity.ok(ipoApplicationService.getAllApplications(userId));
    }



    @GetMapping("/{applicationId}")
    public ResponseEntity<IpoApplicationResponseDTO> getApplicationById(
            @PathVariable String applicationId){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        long userId = Long.parseLong(
                authentication.getPrincipal().toString()
        );
        IpoApplicationResponseDTO application = ipoApplicationService.getApplicationById(applicationId,userId);

        if(application==null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(application);
    }



    @DeleteMapping("/{applicationId}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable  String applicationId){
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            long userId = Long.parseLong(
                    authentication.getPrincipal().toString()
            );
            boolean deleted = ipoApplicationService.deleteApplication(applicationId,userId);
            if(!deleted){
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.noContent().build();
    }
}


