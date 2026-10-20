package com.portfolioX.PortFolioX.mapper;

import com.portfolioX.PortFolioX.dto.IpoApplicationResponseDTO;
import com.portfolioX.PortFolioX.entity.IpoApplication;
import com.portfolioX.PortFolioX.entity.IpoMaster;

public final class IpoApplicationMapper {
    private IpoApplicationMapper(){};
    public static IpoApplicationResponseDTO toDTO(IpoApplication application){
        IpoApplicationResponseDTO dto = new IpoApplicationResponseDTO();

        dto.setApplicationId(application.getApplicationId());
        dto.setApplicationStatus(application.getApplicationStatus());
        dto.setAllotmentStatus(application.getAllotmentStatus());
        dto.setIpoId(application.getIpoMaster().getIpoId());
        dto.setCompanyName(application.getIpoMaster().getCompanyName());
        dto.setUserId(application.getUser().getUserId());
        dto.setLotsApplied(application.getLotsApplied());
        dto.setLotsAllotted(application.getLotsAllotted());

        return dto;
    }
}
