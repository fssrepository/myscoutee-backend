package com.raxim.myscoutee.domain.community.service;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.raxim.myscoutee.domain.community.api.AnnouncementDirectory;
import com.raxim.myscoutee.domain.community.document.CommunityAnnouncement;
@Service
public class AnnouncementDirectoryService implements AnnouncementDirectory {
    private final MongoTemplate mongo;
    public AnnouncementDirectoryService(MongoTemplate mongo) { this.mongo = mongo; }
    @Override public Optional<Announcement> find(String id) {
        return Optional.ofNullable(mongo.findById(id, CommunityAnnouncement.class))
                .map(value -> new Announcement(value.id(), value.communityId(), value.status()));
    }
}
