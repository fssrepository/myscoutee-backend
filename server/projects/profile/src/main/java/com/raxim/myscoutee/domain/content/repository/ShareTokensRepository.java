package com.raxim.myscoutee.domain.content.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.content.document.ShareToken;

public interface ShareTokensRepository extends MongoRepository<ShareToken, String> {
    Optional<ShareToken> findByToken(String token);
}
