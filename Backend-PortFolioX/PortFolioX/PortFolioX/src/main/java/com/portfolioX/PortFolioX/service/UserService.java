package com.portfolioX.PortFolioX.service;
import com.portfolioX.PortFolioX.dto.UserRequestDTO;
import com.portfolioX.PortFolioX.dto.UserResponseDTO;
import com.portfolioX.PortFolioX.entity.Role;
import com.portfolioX.PortFolioX.entity.User;
import com.portfolioX.PortFolioX.repository.UserRepo;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private UserRepo userRepo;

    private PasswordEncoder passwordEncoder;

    UserService (UserRepo userRepo,PasswordEncoder passwordEncoder){
        this.userRepo= userRepo ;
        this.passwordEncoder=passwordEncoder;
    }

    public List<User> getAllUsers(){
        return userRepo.findAll();
    }

    public User getUserById(long userId){
        return userRepo.findById(userId).orElse(null);
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

        UserRequestDTO response = new UserResponseDTO();

        return userRepo.save(user);

        user.getUserId(dto.getUserId());
        user.getEmail(dto.getEmail());
        user.getName(dto.getName());
        user.getRole(Role.USER);
        user.getCreationTime(LocalDateTime.now());
        user.getLastLogin(LocalDateTime.now());

    }

}
