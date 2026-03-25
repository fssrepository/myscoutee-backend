package com.raxim.myscoutee.profile.repository.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.mongo.Users;

public interface UsersRepository extends MongoRepository<Users, String> {
}
