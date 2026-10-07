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
        var scope = new com.raxim.myscoutee.domain.platform.service.JobGroupScopeService(mongo);
        ReflectionTestUtils.setField(scope, "groupDirectory", directory(mongo));
        ReflectionTestUtils.setField(scope, "assetOwnership", com.raxim.myscoutee.domain.assets.service.AssetTestSupport.ownership(null, mongo));
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
