package com.portfolioX.PortFolioX.service;

import com.portfolioX.PortFolioX.dto.AuthResponseDTO;
import com.portfolioX.PortFolioX.dto.LoginRequestDTO;
import com.portfolioX.PortFolioX.dto.UserResponseDTO;
import com.portfolioX.PortFolioX.entity.User;
import com.portfolioX.PortFolioX.exception.InvalidCredentialsException;
import com.portfolioX.PortFolioX.repository.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepo userRepo,PasswordEncoder passwordEncoder,JwtService jwtService){
        this.userRepo=userRepo;
        this.passwordEncoder=passwordEncoder;
        this.jwtService=jwtService;
    }

    public AuthResponseDTO login(LoginRequestDTO dto){
        Optional<User> user = userRepo.findByEmail(dto.getEmail());
        User foundUser = user.orElseThrow(()-> new InvalidCredentialsException("Invalid email or Password"));

        if(!passwordEncoder.matches(dto.getPassword(), foundUser.getPassword())){
            throw new InvalidCredentialsException("Invalid email or password");
        }
        //successful login
        foundUser.setLastLogin(LocalDateTime.now());
        userRepo.save(foundUser);

        //generate token
        String token = jwtService.generateToken(foundUser);

        //created authresponse and token put inside it
        //returned userresponsedto

        AuthResponseDTO authResponseDTO = new AuthResponseDTO();
        authResponseDTO.setToken(token);
        return authResponseDTO;
    }
}
