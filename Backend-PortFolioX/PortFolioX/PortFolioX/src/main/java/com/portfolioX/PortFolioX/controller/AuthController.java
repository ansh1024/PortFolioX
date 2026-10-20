package com.portfolioX.PortFolioX.controller;

import com.portfolioX.PortFolioX.dto.AuthResponseDTO;
import com.portfolioX.PortFolioX.dto.LoginRequestDTO;
import com.portfolioX.PortFolioX.dto.UserResponseDTO;
import com.portfolioX.PortFolioX.entity.User;
import com.portfolioX.PortFolioX.mapper.UserMapper;
import com.portfolioX.PortFolioX.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private AuthService authService;

    AuthController(AuthService authService){
        this.authService=authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> userLogin(@Valid @RequestBody LoginRequestDTO dto){
        AuthResponseDTO response = authService.login(dto);
        //UserResponseDTO response = UserMapper.toDTO(user);
        //AuthResponseDTO response = UserMapper.toDTO(user);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }
}
