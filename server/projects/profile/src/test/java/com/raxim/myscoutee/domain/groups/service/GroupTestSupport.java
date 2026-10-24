package com.raxim.myscoutee.domain.groups.service;

import java.util.Optional;
import org.mockito.Answers;
import org.mockito.Mockito;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.util.ReflectionTestUtils;
import com.raxim.myscoutee.domain.groups.document.CommunityGroup;
import com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository;

/** Use the owning service while retaining existing Mongo query fixtures. */
public final class GroupTestSupport {
    private GroupTestSupport() {}
    public static com.raxim.myscoutee.domain.platform.service.JobGroupScopeService jobScope(MongoTemplate mongo) {
        var users = Mockito.mock(com.raxim.myscoutee.domain.accounts.repository.UsersRepository.class, call ->
                "findByUserIdIn".equals(call.getMethod().getName())
                        ? mongo.find(org.springframework.data.mongodb.core.query.Query.query(
                            org.springframework.data.mongodb.core.query.Criteria.where("userId").in(call.getArgument(0, java.util.Collection.class))),
                            com.raxim.myscoutee.domain.accounts.document.Users.class)
                        : Answers.RETURNS_DEFAULTS.answer(call));
        var profiles = new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(users, null);
        ReflectionTestUtils.setField(profiles, "mongo", mongo);
        return new com.raxim.myscoutee.domain.platform.service.JobGroupScopeService(profiles,
                Optional.of(directory(mongo)), java.util.List.of(
                        com.raxim.myscoutee.domain.assets.service.AssetTestSupport.ownership(null, mongo),
                        com.raxim.myscoutee.domain.events.service.EventTestSupport.ownership(null, mongo)));
    }
    public static GroupDirectoryService directory(MongoTemplate mongo) {
        var repository = Mockito.mock(CommunityGroupsRepository.class, call ->
                "findById".equals(call.getMethod().getName())
                        ? Optional.ofNullable(mongo.findById(call.getArgument(0), CommunityGroup.class))
                        : Answers.RETURNS_DEFAULTS.answer(call));
        var service = new GroupDirectoryService(repository, null);
        ReflectionTestUtils.setField(service, "mongo", mongo);
        return service;
    }
}
