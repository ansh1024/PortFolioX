package com.portfolioX.PortFolioX.repository;

import com.portfolioX.PortFolioX.entity.IpoApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IpoApplicationRepo extends JpaRepository<IpoApplication,String> {
    @Query(value="SELECT COALESCE(MAX(CAST(application_id AS UNSIGNED)), 0) + 1 FROM ipo_application",
    nativeQuery = true)
    long findNextApplicationId();


    boolean existsByApplicationIdAndUser_UserId(
            String applicationId,
            long userId
    );

    List<IpoApplication> findByUser_UserId(long userId);

    Optional<IpoApplication> findByApplicationIdAndUser_UserId(
            String applicationId, long userId
    );
}
