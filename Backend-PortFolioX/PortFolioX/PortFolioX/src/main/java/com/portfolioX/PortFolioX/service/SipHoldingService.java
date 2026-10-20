package com.portfolioX.PortFolioX.service;

import com.portfolioX.PortFolioX.dto.SipHoldingRequestDTO;
import com.portfolioX.PortFolioX.dto.SipHoldingResponseDTO;
import com.portfolioX.PortFolioX.entity.MutualFund;
import com.portfolioX.PortFolioX.entity.SipHolding;
import com.portfolioX.PortFolioX.entity.User;
import com.portfolioX.PortFolioX.exception.ResourceNotFoundException;
import com.portfolioX.PortFolioX.mapper.SipHoldingMapper;
import com.portfolioX.PortFolioX.repository.MutualFundRepo;
import com.portfolioX.PortFolioX.repository.SipHoldingRepo;
import com.portfolioX.PortFolioX.repository.UserRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SipHoldingService {
    private final SipHoldingRepo sipHoldingRepo;
    private final MutualFundRepo mutualFundRepo;
    private final UserRepo userRepo;

    public SipHoldingService(SipHoldingRepo sipHoldingRepo, MutualFundRepo mutualFundRepo, UserRepo userRepo){
        this.sipHoldingRepo=sipHoldingRepo;
        this.mutualFundRepo=mutualFundRepo;
        this.userRepo=userRepo;
    }
    public SipHoldingResponseDTO createHolding(SipHoldingRequestDTO dto){
        //1)get authenticated user id
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Long userId=Long.parseLong(principal.toString());

        //2)load the user
        User user =userRepo.findById(userId)
                .orElseThrow(()->new RuntimeException("User not found"));

        //3)load requested mutual fund hehe
        MutualFund mutualFund = mutualFundRepo
                .findById(dto.getMutualFundId())
                .orElseThrow(()->new RuntimeException("Mutual fund not found"));

        //4) generate the next numeric string id
        Long maxId= sipHoldingRepo.findMaxNumericHoldingId();

        long nextId=(maxId==null)? 101L : maxId+1;

        //5)map dto to entity
        SipHolding holding = SipHoldingMapper.toEntity(dto,mutualFund);
        holding.setHoldingId(String.valueOf(nextId));
        holding.setUser(user);

        //6) save and return the response to the user yayy
        SipHolding savedHolding= sipHoldingRepo.save(holding);
        return SipHoldingMapper.toResponseDTO(savedHolding);
    }
    public List<SipHoldingResponseDTO> getAllMyHolding(){
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Long userId=Long.parseLong(principal.toString());

        List<SipHolding> holdings = sipHoldingRepo.findAllByUser_UserId(userId);
        return holdings.stream()
                .map(SipHoldingMapper::toResponseDTO)
                .toList();
    }

    public SipHoldingResponseDTO getHoldingbyId(String holdingId){
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Long userId=Long.parseLong(principal.toString());
        SipHolding holding =sipHoldingRepo.findByHoldingIdAndUser_UserId(holdingId,userId)
                .orElseThrow(()->new ResourceNotFoundException("Holding not found"));

        return SipHoldingMapper.toResponseDTO(holding);
    }
    public SipHoldingResponseDTO updateHolding(String holdingId,
                                               SipHoldingRequestDTO dto){
        Object principal =SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        Long userId=Long.parseLong(principal.toString());
        SipHolding holding =sipHoldingRepo.findByHoldingIdAndUser_UserId(holdingId,userId)
                .orElseThrow(()->new ResourceNotFoundException("Holding not found"));

        MutualFund mutualFund=mutualFundRepo
                .findById(dto.getMutualFundId())
                .orElseThrow(()->new RuntimeException("Mutual fund not found"));

        holding.setMutualFund(mutualFund);
        holding.setUnits(dto.getUnits());
        holding.setInvestedAmount(dto.getInvestedAmount());
        holding.setStartDate(dto.getStartDate());
        holding.setSipAmount(dto.getSipAmount());
        holding.setFrequency(dto.getFrequency());

        SipHolding updatedHolding = sipHoldingRepo.save(holding);

        return SipHoldingMapper.toResponseDTO(updatedHolding);
    }
    public void deleteHolding(String holdingId){
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Long userId=Long.parseLong(principal.toString());
        SipHolding todeleteHolding=sipHoldingRepo.findByHoldingIdAndUser_UserId(holdingId,userId)
                .orElseThrow(()->new ResourceNotFoundException("Holding not found"));
        sipHoldingRepo.delete(todeleteHolding);
    }
}
