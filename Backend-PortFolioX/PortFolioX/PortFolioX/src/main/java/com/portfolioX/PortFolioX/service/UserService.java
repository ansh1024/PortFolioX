package com.portfolioX.PortFolioX.service;
import com.portfolioX.PortFolioX.dto.UserRequestDTO;
import com.portfolioX.PortFolioX.dto.UserResponseDTO;
import com.portfolioX.PortFolioX.entity.Role;
import com.portfolioX.PortFolioX.entity.User;
import com.portfolioX.PortFolioX.exception.DuplicateEmailException;
import com.portfolioX.PortFolioX.mapper.UserMapper;
import com.portfolioX.PortFolioX.repository.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final UserRepo userRepo;

    private final PasswordEncoder passwordEncoder;

    private Role role;

    UserService (UserRepo userRepo,PasswordEncoder passwordEncoder){
        this.userRepo= userRepo ;
        this.passwordEncoder=passwordEncoder;
    }

    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepo.findAll();
        List<UserResponseDTO> responses = new ArrayList<>();
        for (User user : users) {
            UserResponseDTO response  = UserMapper.toDTO(user);
            responses.add(response);
        }
        return responses;
    }

    public UserResponseDTO getUserById(long userId) {
        User user = userRepo.findById(userId).orElse(null);

        UserResponseDTO response = UserMapper.toDTO(user);
        return response;

    }

//    public User addUser(User user){
//        return userRepo.save(user);
//    }
    //public User addUser(UserRequestDTO dto)

    public UserResponseDTO addUser(UserRequestDTO dto) {
        if(userRepo.existsByEmail(dto.getEmail())){
            throw new DuplicateEmailException("Email already exists");
        }
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setName(dto.getName());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.USER);

        User saveduser = userRepo.save(user);

        UserResponseDTO response = UserMapper.toDTO(saveduser);
        return response;
    }
}
