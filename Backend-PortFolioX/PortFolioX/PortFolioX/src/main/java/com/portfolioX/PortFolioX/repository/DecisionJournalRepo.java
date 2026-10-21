package com.portfolioX.PortFolioX.repository;

import com.portfolioX.PortFolioX.entity.DecisionJournal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DecisionJournalRepo
        extends JpaRepository<DecisionJournal, String> {

    List<DecisionJournal> findAllByUser_UserIdOrderByUpdatedAtDesc(
            Long userId
    );

    Optional<DecisionJournal> findByUser_UserIdAndIpoMaster_IpoId(
            Long userId,
            long ipoId
    );

    @Query("""
            SELECT MAX(CAST(j.journalId AS long))
            FROM DecisionJournal j
            """)
    Long findMaxNumericJournalId();
}
