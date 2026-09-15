package com.portfolioX.PortFolioX.repository;

import com.portfolioX.PortFolioX.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User,Long> {

}
