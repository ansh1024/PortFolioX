
package com.portfolioX.PortFolioX.repository;

import com.portfolioX.PortFolioX.entity.ScoreLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ScoreLogRepo extends JpaRepository<ScoreLog, String> {

    @Query("""
            SELECT MAX(CAST(s.scoreLogId AS long))
            FROM ScoreLog s
            """)
    Long findMaxNumericScoreLogId();
}

