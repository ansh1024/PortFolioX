package com.portfolioX.PortFolioX.service;
import com.portfolioX.PortFolioX.dto.UserRequestDTO;
import com.portfolioX.PortFolioX.dto.UserResponseDTO;
import com.portfolioX.PortFolioX.entity.Role;
import com.portfolioX.PortFolioX.entity.User;
import com.portfolioX.PortFolioX.repository.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
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
