package com.raxim.myscoutee.profile.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.HelpCenterGuideField;

public interface HelpCenterGuideFieldsRepository extends MongoRepository<HelpCenterGuideField, String> {
    boolean existsByScreenKey(String screenKey);
    List<HelpCenterGuideField> findAllByScreenKeyOrderByOrderAsc(String screenKey);
}
