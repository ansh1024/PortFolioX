package com.portfolioX.PortFolioX.service;

import com.portfolioX.PortFolioX.dto.IpoApplicationResponseDTO;
import com.portfolioX.PortFolioX.entity.*;
import com.portfolioX.PortFolioX.mapper.IpoApplicationMapper;
import com.portfolioX.PortFolioX.repository.IpoApplicationRepo;
import com.portfolioX.PortFolioX.repository.IpoMasterRepo;
import com.portfolioX.PortFolioX.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IpoApplicationService {
    private final IpoApplicationRepo ipoApplicationRepo;
    private final IpoMasterRepo ipoMasterRepo;
    private final UserRepo userRepo;

    public IpoApplicationService(IpoApplicationRepo ipoApplicationRepo, IpoMasterRepo ipoMasterRepo, UserRepo userRepo){
        this.ipoApplicationRepo=ipoApplicationRepo;
        this.ipoMasterRepo = ipoMasterRepo;
        this.userRepo = userRepo;
    }
    public IpoApplication createApplication(long userId,long ipoId,int lotsApplied){
        User user=userRepo.findById(userId)
                .orElseThrow(()->new RuntimeException("User not Found"));
        IpoMaster ipo=ipoMasterRepo.findById(ipoId)
                .orElseThrow(()->new RuntimeException("Ipo not Found"));

        IpoApplication application = new IpoApplication();
        application.setUser(user);
        application.setIpoMaster(ipo);
        application.setLotsApplied(lotsApplied);

        application.setApplicationStatus(ApplicationStatus.SUBMITTED);
        application.setAllotmentStatus(AllotmentStatus.PENDING);


        long nextId=ipoApplicationRepo.findNextApplicationId();
        application.setApplicationId(String.valueOf(nextId));
        return ipoApplicationRepo.save(application);
    }


    public List<IpoApplicationResponseDTO> getAllApplications(long userId) {
        return ipoApplicationRepo.findByUser_UserId(userId)
                .stream()
                .map(IpoApplicationMapper::toDTO)
                .toList();
    }


    public IpoApplicationResponseDTO getApplicationById(String applicationId,
                                                        long userId){
        IpoApplication application =ipoApplicationRepo
                .findByApplicationIdAndUser_UserId(applicationId,userId)
                .orElse(null);
        if(application==null){
            return null;
        }
        return IpoApplicationMapper.toDTO(application);
    }


    public boolean deleteApplication(String applicationId,long userId){
        boolean belongsToUser= ipoApplicationRepo.existsByApplicationIdAndUser_UserId(applicationId,userId);
        if(!belongsToUser){
            return false;
        }
        ipoApplicationRepo.deleteById(applicationId);
        return true;
    }
}
