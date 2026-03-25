package com.raxim.myscoutee.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.raxim.myscoutee.common.config.repository.MongoRepositoryFactoryBean;

@Configuration
@EnableMongoRepositories(repositoryFactoryBeanClass = MongoRepositoryFactoryBean.class, basePackages = {
        "com.raxim.myscoutee.profile.repository.mongo" })
public class RepositoryConfig {
}
