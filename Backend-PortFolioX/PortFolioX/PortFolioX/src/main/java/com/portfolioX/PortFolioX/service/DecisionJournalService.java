package com.portfolioX.PortFolioX.service;
import com.portfolioX.PortFolioX.exception.DuplicateJournalException;
import com.portfolioX.PortFolioX.exception.ResourceNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import com.portfolioX.PortFolioX.dto.DecisionJournalRequestDTO;
import com.portfolioX.PortFolioX.dto.DecisionJournalResponseDTO;
import com.portfolioX.PortFolioX.entity.DecisionJournal;
import com.portfolioX.PortFolioX.entity.IpoMaster;
import com.portfolioX.PortFolioX.entity.User;
import com.portfolioX.PortFolioX.repository.DecisionJournalRepo;
import com.portfolioX.PortFolioX.repository.IpoMasterRepo;
import com.portfolioX.PortFolioX.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DecisionJournalService {
    private final DecisionJournalRepo journalRepo;
    private final IpoMasterRepo ipoMasterRepo;
    private final UserRepo userRepo;


    public DecisionJournalService(DecisionJournalRepo journalRepo, IpoMasterRepo ipoMasterRepo, UserRepo userRepo) {
        this.journalRepo = journalRepo;
        this.ipoMasterRepo = ipoMasterRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public DecisionJournalResponseDTO createJournal(
            long ipoId,
            long userId,
            DecisionJournalRequestDTO requestDTO) {

        if (requestDTO.getContent() == null
                || requestDTO.getContent().isBlank()) {
            throw new IllegalArgumentException(
                    "Journal content cannot be empty");
        }

        if (journalRepo
                .findByUser_UserIdAndIpoMaster_IpoId(userId, ipoId)
                .isPresent()) {
            throw new DuplicateJournalException(
                    "A journal already exists for this IPO");
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        IpoMaster ipo = ipoMasterRepo.findById(ipoId)
                .orElseThrow(() ->
                        new RuntimeException("IPO not found"));

        DecisionJournal journal = new DecisionJournal();

        Long maxId = journalRepo.findMaxNumericJournalId();
        journal.setJournalId(
                String.valueOf(maxId == null ? 101 : maxId + 1));

        journal.setUser(user);
        journal.setIpoMaster(ipo);
        journal.setContent(requestDTO.getContent().trim());

        DecisionJournal savedJournal = journalRepo.save(journal);

        return mapToResponseDTO(savedJournal);
    }
    @Transactional(readOnly = true)
    public DecisionJournalResponseDTO getJournal(
            long ipoId,
            long userId) {

        DecisionJournal journal = journalRepo
                .findByUser_UserIdAndIpoMaster_IpoId(userId, ipoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Journal not found"));

        return mapToResponseDTO(journal);
    }
    @Transactional(readOnly = true)
    public List<DecisionJournalResponseDTO> getMyJournals(
            long userId) {

        return journalRepo
                .findAllByUser_UserIdOrderByUpdatedAtDesc(userId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }
    @Transactional
    public DecisionJournalResponseDTO updateJournal(
            long ipoId,
            long userId,
            DecisionJournalRequestDTO requestDTO) {

        if (requestDTO.getContent() == null
                || requestDTO.getContent().isBlank()) {
            throw new IllegalArgumentException(
                    "Journal content cannot be empty");
        }

        DecisionJournal journal = journalRepo
                .findByUser_UserIdAndIpoMaster_IpoId(userId, ipoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Journal not found"));

        journal.setContent(requestDTO.getContent().trim());

        DecisionJournal updatedJournal = journalRepo.save(journal);

        return mapToResponseDTO(updatedJournal);
    }
    private DecisionJournalResponseDTO mapToResponseDTO(
            DecisionJournal journal) {

        DecisionJournalResponseDTO responseDTO =
                new DecisionJournalResponseDTO();

        responseDTO.setJournalId(journal.getJournalId());
        responseDTO.setIpoId(journal.getIpoMaster().getIpoId());
        responseDTO.setCompanyName(
                journal.getIpoMaster().getCompanyName());
        responseDTO.setContent(journal.getContent());
        responseDTO.setCreatedAt(journal.getCreatedAt());
        responseDTO.setUpdatedAt(journal.getUpdatedAt());

        return responseDTO;
    }
}
