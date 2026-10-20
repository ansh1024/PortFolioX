package com.portfolioX.PortFolioX.mapper;

import com.portfolioX.PortFolioX.dto.MutualFundRequestDTO;
import com.portfolioX.PortFolioX.dto.MutualFundResponseDTO;
import com.portfolioX.PortFolioX.entity.MutualFund;

public class MutualFundMapper {
    private  MutualFundMapper(){};
    public static MutualFundResponseDTO toDTO(MutualFund fund){
        MutualFundResponseDTO dto = new MutualFundResponseDTO();

        dto.setFundId(fund.getFundId());
        dto.setFundName(fund.getFundName());
        dto.setAmc(fund.getAmc());
        dto.setCategory(fund.getCategory());
        dto.setNav(fund.getNav());
        dto.setAum(fund.getAum());
        dto.setReturn1Day(fund.getReturn1Day());
        dto.setReturn1Month(fund.getReturn1Month());
        dto.setReturn6Month(fund.getReturn6Month());
        dto.setReturn1Year(fund.getReturn1Year());
        dto.setReturn3Year(fund.getReturn3Year());
        dto.setReturn5Year(fund.getReturn5Year());

        return dto;
    }
    public static MutualFund toEntity(MutualFundRequestDTO dto) {
        MutualFund fund = new MutualFund();

        fund.setFundId(dto.getFundId());
        fund.setFundName(dto.getFundName());
        fund.setAmc(dto.getAmc());
        fund.setCategory(dto.getCategory());
        fund.setNav(dto.getNav());
        fund.setAum(dto.getAum());
        fund.setReturn1Day(dto.getReturn1Day());
        fund.setReturn1Month(dto.getReturn1Month());
        fund.setReturn6Month(dto.getReturn6Month());
        fund.setReturn1Year(dto.getReturn1Year());
        fund.setReturn3Year(dto.getReturn3Year());
        fund.setReturn5Year(dto.getReturn5Year());

        return fund;
    }
}
