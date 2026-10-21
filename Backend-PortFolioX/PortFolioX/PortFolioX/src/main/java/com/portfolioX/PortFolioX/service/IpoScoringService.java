package com.portfolioX.PortFolioX.service;
import com.portfolioX.PortFolioX.dto.ScoreLogResponseDTO;
import com.portfolioX.PortFolioX.entity.IpoMaster;
import com.portfolioX.PortFolioX.entity.IpoMetrics;
import com.portfolioX.PortFolioX.entity.ScoreLog;
import com.portfolioX.PortFolioX.entity.Verdict;
import com.portfolioX.PortFolioX.repository.IpoMasterRepo;
import com.portfolioX.PortFolioX.repository.IpoMetricsRepo;
import com.portfolioX.PortFolioX.repository.ScoreLogRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class IpoScoringService {
    private final IpoMasterRepo ipoMasterRepo;
    private final IpoMetricsRepo ipoMetricsRepo;
    private final ScoreLogRepo scoreLogRepo;

    public IpoScoringService(IpoMasterRepo ipoMasterRepo, IpoMetricsRepo ipoMetricsRepo, ScoreLogRepo scoreLogRepo) {
        this.ipoMasterRepo = ipoMasterRepo;
        this.ipoMetricsRepo = ipoMetricsRepo;
        this.scoreLogRepo = scoreLogRepo;
    }

    @Transactional
        public ScoreLogResponseDTO scoreIpo(long ipoId) {


            IpoMaster ipo = ipoMasterRepo.findById(ipoId)
                    .orElseThrow(() ->
                            new IllegalArgumentException("IPO not found: " + ipoId));

        IpoMetrics metrics = ipoMetricsRepo.findById(ipoId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "IPO metrics not found for IPO ID: " + ipoId));

            int gmpScore = calculateGmpScore(ipo);
            int subscriptionScore = calculateSubscriptionScore(ipo);

            int fundamentalScore = metrics.getFundamentalScore();
            int sectorScore = metrics.getSectorScore();
            int historicalScore = metrics.getHistoricalScore();

            int totalScore = gmpScore
                    + subscriptionScore
                    + fundamentalScore
                    + sectorScore
                    + historicalScore;

            Verdict verdict = determineVerdict(totalScore);

            ScoreLog scoreLog = new ScoreLog();
            scoreLog.setScoreLogId(generateNextScoreLogId());
            scoreLog.setIpoMaster(ipo);
            scoreLog.setGmpScore(gmpScore);
            scoreLog.setSubscriptionScore(subscriptionScore);
            scoreLog.setFundamentalScore(fundamentalScore);
            scoreLog.setSectorScore(sectorScore);
            scoreLog.setHistoricalScore(historicalScore);
            scoreLog.setTotalScore(totalScore);
            scoreLog.setVerdict(verdict);
            scoreLog.setCalculatedAt(LocalDateTime.now());

        ScoreLog savedScoreLog = scoreLogRepo.save(scoreLog);
        return mapToResponseDTO(savedScoreLog);
    }
    private ScoreLogResponseDTO mapToResponseDTO(ScoreLog scoreLog) {

        ScoreLogResponseDTO dto = new ScoreLogResponseDTO();

        dto.setScoreLogId(scoreLog.getScoreLogId());
        dto.setIpoId(scoreLog.getIpoMaster().getIpoId());
        dto.setCompanyName(scoreLog.getIpoMaster().getCompanyName());

        dto.setGmpScore(scoreLog.getGmpScore());
        dto.setSubscriptionScore(scoreLog.getSubscriptionScore());
        dto.setFundamentalScore(scoreLog.getFundamentalScore());
        dto.setSectorScore(scoreLog.getSectorScore());
        dto.setHistoricalScore(scoreLog.getHistoricalScore());

        dto.setTotalScore(scoreLog.getTotalScore());
        dto.setVerdict(scoreLog.getVerdict());
        dto.setCalculatedAt(scoreLog.getCalculatedAt());

        return dto;
    }
//    private void validateRequest(IpoScoringRequestDTO request) {
//
//        if (request == null) {
//            throw new IllegalArgumentException(
//                    "Scoring request must not be null");
//        }
//
//        validateComponentScore(
//                request.getFundamentalScore(), "fundamentalScore");
//        validateComponentScore(
//                request.getSectorScore(), "sectorScore");
//        validateComponentScore(
//                request.getHistoricalScore(), "historicalScore");
//    }
    private void validateComponentScore(int score, String fieldName) {
        if (score < 0 || score > 20) {
            throw new IllegalArgumentException(
                    fieldName + " must be between 0 and 20");
        }
    }
    private int calculateGmpScore(IpoMaster ipo) {

        if (ipo.getPrice() <= 0) {
            throw new IllegalArgumentException(
                    "IPO price must be greater than zero");
        }

        double gmpPercentage =
                ((double) ipo.getGmp() / ipo.getPrice()) * 100.0;

        if (gmpPercentage <= 0) return 0;
        if (gmpPercentage < 10) return 5;
        if (gmpPercentage < 25) return 10;
        if (gmpPercentage < 50) return 15;
        return 20;
    }
    private int calculateSubscriptionScore(IpoMaster ipo) {

        float[] subscriptions = {
                ipo.getSubscriptionQib(),
                ipo.getSubscriptionShni(),
                ipo.getSubscriptionBhni(),
                ipo.getSubscriptionRetail(),
                ipo.getSubscriptionEmployee()
        };

        double total = 0;
        int count = 0;

        for (float subscription : subscriptions) {
            if (Float.isFinite(subscription) && subscription >= 0) {
                total += subscription;
                count++;
            }
        }

        if (count == 0) return 0;

        double averageSubscription = total / count;

        if (averageSubscription < 1) return 0;
        if (averageSubscription < 3) return 5;
        if (averageSubscription < 5) return 10;
        if (averageSubscription < 10) return 15;
        return 20;
    }
    private Verdict determineVerdict(int totalScore) {

        if (totalScore >= 75) {
            return Verdict.APPLY;
        }
        if (totalScore >= 45) {
            return Verdict.WATCH;
        }
        return Verdict.SKIP;
    }
    private String generateNextScoreLogId() {

        Long maxId = scoreLogRepo.findMaxNumericScoreLogId();

        long nextId = (maxId == null) ? 101L : maxId + 1;

        return String.valueOf(nextId);
    }
}

