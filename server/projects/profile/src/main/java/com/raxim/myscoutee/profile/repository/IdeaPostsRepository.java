package com.raxim.myscoutee.profile.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.IdeaPost;

public interface IdeaPostsRepository extends MongoRepository<IdeaPost, String> {
    List<IdeaPost> findAllByOrderBySubmittedAtIsoDesc();

    List<IdeaPost> findByPublishedTrueOrderBySubmittedAtIsoDesc();
}
