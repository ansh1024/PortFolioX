package com.portfolioX.PortFolioX.mapper;

import com.portfolioX.PortFolioX.dto.SipHoldingRequestDTO;
import com.portfolioX.PortFolioX.dto.SipHoldingResponseDTO;
import com.portfolioX.PortFolioX.entity.MutualFund;
import com.portfolioX.PortFolioX.entity.SipHolding;

public class SipHoldingMapper {
    private SipHoldingMapper(){};
    public static SipHoldingResponseDTO toResponseDTO(SipHolding holding){
        SipHoldingResponseDTO dto = new SipHoldingResponseDTO();
        dto.setHoldingId(holding.getHoldingId());
        dto.setMutualFundId(
                holding.getMutualFund().getFundId());
        dto.setMutualFundName(
                holding.getMutualFund().getFundName());
        dto.setUnits(holding.getUnits());
        dto.setInvestedAmount(holding.getInvestedAmount());
        dto.setCurrentValue(holding.getCurrentValue());
        dto.setStartDate(holding.getStartDate());
        dto.setSipAmount(holding.getSipAmount());
        dto.setFrequency(holding.getFrequency());
        dto.setXirr(holding.getXirr());

        return dto;
    }
    public static SipHolding toEntity(
            SipHoldingRequestDTO dto,
            MutualFund mutualFund) {

        SipHolding holding = new SipHolding();

        holding.setMutualFund(mutualFund);
        holding.setUnits(dto.getUnits());
        holding.setInvestedAmount(dto.getInvestedAmount());
        holding.setStartDate(dto.getStartDate());
        holding.setSipAmount(dto.getSipAmount());
        holding.setFrequency(dto.getFrequency());

        return holding;
    }
}
