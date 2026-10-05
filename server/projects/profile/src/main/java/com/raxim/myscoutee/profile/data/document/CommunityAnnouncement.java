package com.raxim.myscoutee.profile.data.document;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("communityAnnouncements")
@CompoundIndexes({
    @CompoundIndex(name="announcement_group_status_date", def="{'communityId':1,'status':1,'publishedAtIso':-1,'_id':1}"),
    @CompoundIndex(name="announcement_closure", def="{'status':1,'voting':1,'deadlineIso':1,'closureNotifiedAtIso':1}"),
    @CompoundIndex(name="announcement_attachment", def="{'attachments.url':1}")
})
public record CommunityAnnouncement(@Id String id, String communityId, String authorAccountId,
        String title, String body, List<DocumentAttachment> attachments, String status, boolean voting,
        String deadlineIso, String closedAtIso, String closureNotifiedAtIso,
        List<Ballot> ballots,
        String publishedAtIso, String createdAtIso, String updatedAtIso, @Version Long version) {
    public record Ballot(String voterAccountId, String choice, String castAtIso) {}
}
