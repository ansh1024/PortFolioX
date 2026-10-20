package com.portfolioX.PortFolioX.repository;

import com.portfolioX.PortFolioX.entity.SipHolding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SipHoldingRepo extends JpaRepository<SipHolding,String> {
    @Query(value = """
            SELECT MAX(CAST(holding_id AS UNSIGNED))
            FROM sip_holding
            WHERE holding_id REGEXP '^[0-9]+$'
            """, nativeQuery = true)
    Long findMaxNumericHoldingId();

    List<SipHolding> findAllByUser_UserId(Long userId);

    Optional<SipHolding> findByHoldingIdAndUser_UserId(
            String holdingId, Long userId);

    boolean existsByUser_UserIdAndMutualFund_FundId(
            Long userId, String fundId);
}
