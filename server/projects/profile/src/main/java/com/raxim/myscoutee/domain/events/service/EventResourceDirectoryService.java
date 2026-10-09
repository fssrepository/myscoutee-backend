package com.raxim.myscoutee.domain.events.service;
import java.util.*;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.events.api.EventResourceDirectory;
import com.raxim.myscoutee.domain.events.document.*;
import com.raxim.myscoutee.domain.events.repository.*;
@Service
public class EventResourceDirectoryService implements EventResourceDirectory {
    private final ActivitySubEventResourcesRepository resources;
    private final ActivitySubEventStageRuntimeRepository runtimes;
    public EventResourceDirectoryService(ActivitySubEventResourcesRepository resources, ActivitySubEventStageRuntimeRepository runtimes) { this.resources = resources; this.runtimes = runtimes; }
    public List<ActivitySubEventResource> findByOwnerIdInAndAssetOwnerUserIdInAndStatusNot(Collection<String> owners, Collection<String> assetOwners, String status) { return resources.findByOwnerIdInAndAssetOwnerUserIdInAndStatusNot(owners, assetOwners, status); }
    public List<ActivitySubEventStageRuntime> findByOwnerIdInAndStatusNot(Collection<String> owners, String status) { return runtimes.findByOwnerIdInAndStatusNot(owners, status); }
}