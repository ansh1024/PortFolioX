package com.portfolioX.PortFolioX.service;

import com.portfolioX.PortFolioX.dto.SipHoldingRequestDTO;
import com.portfolioX.PortFolioX.dto.SipHoldingResponseDTO;
import com.portfolioX.PortFolioX.entity.MutualFund;
import com.portfolioX.PortFolioX.entity.SipHolding;
import com.portfolioX.PortFolioX.entity.User;
import com.portfolioX.PortFolioX.mapper.SipHoldingMapper;
import com.portfolioX.PortFolioX.repository.MutualFundRepo;
import com.portfolioX.PortFolioX.repository.SipHoldingRepo;
import com.portfolioX.PortFolioX.repository.UserRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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
}
