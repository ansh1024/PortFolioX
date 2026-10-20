package com.portfolioX.PortFolioX.service;

import com.portfolioX.PortFolioX.dto.MutualFundRequestDTO;
import com.portfolioX.PortFolioX.dto.MutualFundResponseDTO;
import com.portfolioX.PortFolioX.entity.MutualFund;
import com.portfolioX.PortFolioX.mapper.MutualFundMapper;
import com.portfolioX.PortFolioX.repository.MutualFundRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MutualFundService {
    private final MutualFundRepo mutualFundRepo;

    public MutualFundService(MutualFundRepo mutualFundRepo){
        this.mutualFundRepo=mutualFundRepo;
    }
    public List<MutualFundResponseDTO> getAllFunds(){
        return mutualFundRepo.findAll()
                .stream()
                .map(MutualFundMapper::toDTO)
                .toList();
    }
    public Optional<MutualFundResponseDTO> getFundById(String fundId){
        return mutualFundRepo.findById(fundId)
                .map(MutualFundMapper::toDTO);
    }
    public MutualFundResponseDTO createFund(MutualFundRequestDTO dto){
        MutualFund fund =MutualFundMapper.toEntity(dto);
        MutualFund savedFund = mutualFundRepo.save(fund);
        return MutualFundMapper.toDTO(savedFund);
    }

    public Optional<MutualFundResponseDTO> updateFund(String fundId, MutualFundRequestDTO dto){
        return mutualFundRepo.findById(fundId)
                .map(existingFund->{
                    MutualFund updatedFund = MutualFundMapper.toEntity(dto);
                    updatedFund.setFundId(fundId);

                    MutualFund savedFund=mutualFundRepo.save(updatedFund);
                    return MutualFundMapper.toDTO(savedFund);
                });
    }
    public boolean deleteFund(String fundId){
        Optional<MutualFund> fund = mutualFundRepo.findById(fundId);
        if(fund.isEmpty()){
            return false;
        }
        mutualFundRepo.delete(fund.get());
        return true;
    }
}
