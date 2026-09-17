package com.portfolioX.PortFolioX.controller;

import com.portfolioX.PortFolioX.dto.UserRequestDTO;
import com.portfolioX.PortFolioX.dto.UserResponseDTO;
import com.portfolioX.PortFolioX.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/users")
public class UserController {

    private UserService userService;

    UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
        public ResponseEntity<List<UserResponseDTO>> getAllUsers(){
            return new ResponseEntity<>(userService.getAllUsers(),HttpStatus.OK);
        }


    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable long userId) {
        UserResponseDTO user = userService.getUserById(userId);
        if (user != null) {
            return new ResponseEntity<UserResponseDTO>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<UserResponseDTO>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/")
    public ResponseEntity<?>addUser(@RequestBody UserRequestDTO user){
        UserResponseDTO user1 = userService.addUser(user);
        return new ResponseEntity<>(user1,HttpStatus.CREATED);
    }

}
