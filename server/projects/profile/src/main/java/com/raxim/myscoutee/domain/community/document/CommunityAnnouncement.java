package com.raxim.myscoutee.domain.community.document;

import com.raxim.myscoutee.domain.media.dto.DocumentAttachment;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("communityAnnouncements")
@CompoundIndexes({
    @CompoundIndex(name="announcement_group_status_date", def="{'communityId':1,'status':1,'publishedAtIso':-1,'_id':1}"),
    @CompoundIndex(name="announcement_vote_counter_deadline", def="{'voteCounters.expiresAtIso':1}"),
    @CompoundIndex(name="announcement_closure", def="{'status':1,'voting':1,'deadlineIso':1,'closureNotifiedAtIso':1}"),
    @CompoundIndex(name="announcement_attachment", def="{'attachments.url':1}"),
    @CompoundIndex(name="announcement_document_cleanup", def="{'documentCleanupPending':1,'_id':1}", partialFilter="{'documentCleanupPending':true}")
})
public record CommunityAnnouncement(@Id String id, String communityId, String authorAccountId,
        String title, String body, List<DocumentAttachment> attachments, String status, boolean voting,
        String deadlineIso, String closedAtIso, String closureNotifiedAtIso,
        List<Ballot> ballots,
        String publishedAtIso, String createdAtIso, String updatedAtIso, @Version Long version, @com.fasterxml.jackson.annotation.JsonIgnore VoteCounters voteCounters) {
    public record VoteContribution(long revision, boolean eligible, String bucket) {}
    public record VoteCounters(Long sourceVersion, java.util.Map<String, VoteContribution> recipients, String expiresAtIso,
            List<com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates.Change> pending) {}
    public CommunityAnnouncement(String id, String communityId, String authorAccountId,
            String title, String body, List<DocumentAttachment> attachments, String status, boolean voting,
            String deadlineIso, String closedAtIso, String closureNotifiedAtIso, List<Ballot> ballots,
            String publishedAtIso, String createdAtIso, String updatedAtIso, Long version) {
        this(id, communityId, authorAccountId, title, body, attachments, status, voting, deadlineIso, closedAtIso,
                closureNotifiedAtIso, ballots, publishedAtIso, createdAtIso, updatedAtIso, version, null);
    }
    public CommunityAnnouncement withVoteCounters(VoteCounters counters) {
        return new CommunityAnnouncement(id, communityId, authorAccountId, title, body, attachments, status, voting,
                deadlineIso, closedAtIso, closureNotifiedAtIso, ballots, publishedAtIso, createdAtIso, updatedAtIso, version, counters);
    }
    public record Ballot(String voterAccountId, String choice, String castAtIso) {}
}
