
package com.portfolioX.PortFolioX.repository;

import com.portfolioX.PortFolioX.entity.RiskProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RiskProfileRepo extends JpaRepository<RiskProfile, String> {

    List<RiskProfile> findAllByUser_UserIdOrderByCalculatedAtDesc(Long userId);

    @Query("""
    SELECT MAX(CAST(r.riskProfileId AS long))
    FROM RiskProfile r
    """)
    Long findMaxNumericRiskProfileId();
}
