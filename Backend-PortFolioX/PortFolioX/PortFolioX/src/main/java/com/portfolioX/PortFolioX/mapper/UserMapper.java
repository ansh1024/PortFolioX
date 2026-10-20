package com.portfolioX.PortFolioX.mapper;

import com.portfolioX.PortFolioX.dto.UserResponseDTO;
import com.portfolioX.PortFolioX.entity.Role;
import com.portfolioX.PortFolioX.entity.User;

public final class UserMapper {
    private UserMapper() {};
    public static UserResponseDTO toDTO(User user){

        if(user==null){
            return null;
        }

        UserResponseDTO response = new UserResponseDTO();

        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRole(user.getRole());
        response.setCreationTime(user.getCreationTime());
        response.setLastLogin(user.getLastLogin());
        return response;
    }
}
