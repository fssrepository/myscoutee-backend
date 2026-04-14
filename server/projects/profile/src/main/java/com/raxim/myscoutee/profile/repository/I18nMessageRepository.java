package com.raxim.myscoutee.profile.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.I18nMessage;

public interface I18nMessageRepository extends MongoRepository<I18nMessage, String> {
    List<I18nMessage> findByLang(String lang);
}
