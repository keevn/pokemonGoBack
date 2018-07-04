package comp354.team9.service;

import comp354.team9.exception.BadRequestException;
import comp354.team9.model.UserDeck;
import comp354.team9.payload.DeckInfo;
import comp354.team9.payload.PagedResponse;
import comp354.team9.repository.UserDeckRepository;
import comp354.team9.security.UserPrincipal;
import comp354.team9.util.AppConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserDeckService {


    @Autowired
    private UserDeckRepository userDeckRepository;

    private static final Logger logger = LoggerFactory.getLogger(UserDeckService.class);

    public PagedResponse<DeckInfo> getAllDecks(UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        // Retrieve Polls
        Pageable pageable =  PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<UserDeck> userDecks = userDeckRepository.findByUserId(currentUser.getId(),pageable);

        if(userDecks.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), userDecks.getNumber(),
                    userDecks.getSize(), userDecks.getTotalElements(), userDecks.getTotalPages(), userDecks.isLast());
        }

        List<DeckInfo> userDeckResponses =userDecks.map(DeckInfo::new).getContent();

        return new PagedResponse<>(userDeckResponses, userDecks.getNumber(),
                userDecks.getSize(), userDecks.getTotalElements(), userDecks.getTotalPages(), userDecks.isLast());
    }

    private void validatePageNumberAndSize(int page, int size) {
        if(page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if(size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }
}
