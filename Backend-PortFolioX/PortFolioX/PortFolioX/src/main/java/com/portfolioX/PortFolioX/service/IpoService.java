package com.portfolioX.PortFolioX.service;

import com.portfolioX.PortFolioX.entity.IpoMaster;
import com.portfolioX.PortFolioX.repository.IpoMasterRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IpoService {
    private final IpoMasterRepo ipoMasterRepo;

    public IpoService(IpoMasterRepo ipoMasterRepo){
        this.ipoMasterRepo=ipoMasterRepo;
    }
    public List<IpoMaster> getAllIpos(){
        return ipoMasterRepo.findAll();
    }
    public Optional<IpoMaster> getIpoById(long ipoId){
        return ipoMasterRepo.findById(ipoId);
    }
    public IpoMaster createIpo(IpoMaster ipo){
        return ipoMasterRepo.save(ipo);
    }
    public IpoMaster updateIpo(long ipoId,IpoMaster update){
        IpoMaster existing = ipoMasterRepo.findById(ipoId).orElse(null);
        if(existing==null){
            return null;
        }
        existing.setCompanyName(update.getCompanyName());
        existing.setPrice(update.getPrice());
        existing.setGmp(update.getGmp());
        existing.setSector(update.getSector());
        existing.setOpeningDate(update.getOpeningDate());
        existing.setClosingDate(update.getClosingDate());
        existing.setAllotmentDate(update.getAllotmentDate());

        existing.setSubscriptionQib(update.getSubscriptionQib());
        existing.setSubscriptionShni(update.getSubscriptionShni());
        existing.setSubscriptionBhni(update.getSubscriptionBhni());
        existing.setSubscriptionRetail(update.getSubscriptionRetail());
        existing.setSubscriptionEmployee(update.getSubscriptionEmployee());

        existing.setIpoStatus(update.getIpoStatus());
        return ipoMasterRepo.save(existing);

    }
    public boolean deleteIpo(long ipoId){
        if(!ipoMasterRepo.existsById(ipoId)){
            return false;
        }
        ipoMasterRepo.deleteById(ipoId);
        return true;
    }
}
