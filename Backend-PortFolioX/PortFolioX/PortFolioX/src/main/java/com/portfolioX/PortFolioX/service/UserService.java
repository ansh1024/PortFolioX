package com.portfolioX.PortFolioX.service;
import com.portfolioX.PortFolioX.dto.UserRequestDTO;
import com.portfolioX.PortFolioX.dto.UserResponseDTO;
import com.portfolioX.PortFolioX.entity.Role;
import com.portfolioX.PortFolioX.entity.User;
import com.portfolioX.PortFolioX.repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private UserRepo userRepo;

    private PasswordEncoder passwordEncoder;

    private Role role;

    UserService (UserRepo userRepo,PasswordEncoder passwordEncoder){
        this.userRepo= userRepo ;
        this.passwordEncoder=passwordEncoder;
    }

    public List<UserResponseDTO> getAllUsers() {

        List<User> users = userRepo.findAll();

        List<UserResponseDTO> responses = new ArrayList<>();

        for (User user : users) {

            UserResponseDTO response = new UserResponseDTO();

            response.setUserId(user.getUserId());
            response.setEmail(user.getEmail());
            response.setName(user.getName());
            response.setRole(user.getRole());
            response.setCreationTime(user.getCreationTime());
            response.setLastLogin(user.getLastLogin());

            responses.add(response);
        }

        return responses;
    }

    public UserResponseDTO getUserById(long userId){
        User user = userRepo.findById(userId).orElse(null);
        if (user == null) {
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

//    public User addUser(User user){
//        return userRepo.save(user);
//    }
    //public User addUser(UserRequestDTO dto)
    public UserResponseDTO addUser(UserRequestDTO dto) {
        User user = new User();

        user.setEmail(dto.getEmail());
        user.setName(dto.getName());
        user.setRole(Role.USER);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        User saveduser = userRepo.save(user);


        UserResponseDTO response = new UserResponseDTO();

        response.setUserId(saveduser.getUserId());
        response.setName(saveduser.getName());
        response.setRole(saveduser.getRole());
        response.setCreationTime(saveduser.getCreationTime());
        response.setLastLogin(saveduser.getLastLogin());
        response.setEmail(saveduser.getEmail());

        return response;

    }

}
