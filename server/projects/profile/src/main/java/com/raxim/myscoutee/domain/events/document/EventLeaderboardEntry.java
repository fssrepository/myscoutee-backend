package com.raxim.myscoutee.domain.events.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "eventLeaderboardEntries")
@CompoundIndexes({
        @CompoundIndex(name = "event_leaderboard_group_lookup", def = "{'eventId': 1, 'subEventId': 1, 'groupId': 1, 'entryType': 1, 'createdAtIso': -1}"),
        @CompoundIndex(name = "event_leaderboard_pair_lookup", def = "{'eventId': 1, 'subEventId': 1, 'groupId': 1, 'entryType': 1, 'pairKey': 1}")
})
@lombok.Getter @lombok.Setter
public class EventLeaderboardEntry {
    @Id
    private String id;

    @Indexed(name = "event_leaderboard_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String eventId;
    private String subEventId;
    private String groupId;
    private String entryType;
    private String memberId;
    private Integer scoreValue;
    private String homeMemberId;
    private String awayMemberId;
    private Integer homeScore;
    private Integer awayScore;
    private String pairKey;
    private String note;
    private String createdAtIso;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

}
