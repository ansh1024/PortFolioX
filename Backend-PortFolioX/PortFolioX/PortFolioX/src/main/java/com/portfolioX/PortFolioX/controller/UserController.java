package com.portfolioX.PortFolioX.controller;

import com.portfolioX.PortFolioX.entity.User;
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
        public ResponseEntity<List<User>> getAllUsers(){
            return new ResponseEntity<>(userService.getAllUsers(),HttpStatus.OK);
        }


    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable long userId) {
        User user = userService.getUserById(userId);
        if (user != null) {
            return new ResponseEntity<User>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/")
    public ResponseEntity<?>addUser(@RequestBody User user){
        User user1 = userService.addUser(user);
        return new ResponseEntity<>(user1,HttpStatus.CREATED);
    }

}
