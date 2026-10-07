package com.raxim.myscoutee.domain.assets.service;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.util.ReflectionTestUtils;
import com.raxim.myscoutee.domain.assets.repository.AssetsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.events.service.AssetMembershipService;
import com.raxim.myscoutee.domain.events.service.EventOwnershipService;

/** Wire real owner adapters into existing repository and Mongo fixtures. */
public final class AssetTestSupport {
    private AssetTestSupport() {}
    public static AssetOwnershipService ownership(AssetsRepository repository, MongoTemplate mongo) {
        var service = new AssetOwnershipService(repository);
        ReflectionTestUtils.setField(service, "mongo", mongo);
        return service;
    }
    public static AssetsService wire(AssetsService service) {
        var mongo = (MongoTemplate) ReflectionTestUtils.getField(service, "mongoTemplate");
        var members = ReflectionTestUtils.getField(service, "activityMembersRepository");
        if (members != null) {
            var repository = (ActivityMembersRepository) ReflectionTestUtils.getField(members, "members");
            ReflectionTestUtils.setField(service, "assetMemberships", new AssetMembershipService(repository, mongo));
        }
        var events = new EventOwnershipService(null);
        ReflectionTestUtils.setField(events, "mongo", mongo);
        ReflectionTestUtils.setField(service, "eventOwnership", events);
        return service;
    }
}
