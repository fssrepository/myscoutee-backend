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
        var scope = new com.raxim.myscoutee.domain.platform.service.JobGroupScopeService();
        ReflectionTestUtils.setField(scope, "groupDirectory", directory(mongo));
        ReflectionTestUtils.setField(scope, "assetOwnership", com.raxim.myscoutee.domain.assets.service.AssetTestSupport.ownership(null, mongo));
        ReflectionTestUtils.setField(scope, "eventOwnership", com.raxim.myscoutee.domain.events.service.EventTestSupport.ownership(null, mongo));
        var users = Mockito.mock(com.raxim.myscoutee.domain.accounts.repository.UsersRepository.class, call ->
                "findByUserIdIn".equals(call.getMethod().getName())
                        ? mongo.find(org.springframework.data.mongodb.core.query.Query.query(
                            org.springframework.data.mongodb.core.query.Criteria.where("userId").in(call.getArgument(0, java.util.Collection.class))),
                            com.raxim.myscoutee.domain.accounts.document.Users.class)
                        : Answers.RETURNS_DEFAULTS.answer(call));
        var profiles = new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(users);
        ReflectionTestUtils.setField(profiles, "mongo", mongo);
        ReflectionTestUtils.setField(scope, "profiles", profiles);
        return scope;
    }
    public static GroupDirectoryService directory(MongoTemplate mongo) {
        var repository = Mockito.mock(CommunityGroupsRepository.class, call ->
                "findById".equals(call.getMethod().getName())
                        ? Optional.ofNullable(mongo.findById(call.getArgument(0), CommunityGroup.class))
                        : Answers.RETURNS_DEFAULTS.answer(call));
        var service = new GroupDirectoryService(repository);
        ReflectionTestUtils.setField(service, "mongo", mongo);
        return service;
    }
}
