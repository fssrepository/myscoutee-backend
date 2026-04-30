package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.ShareToken;

public interface ShareTokensRepository extends MongoRepository<ShareToken, String> {
    Optional<ShareToken> findByToken(String token);
}
