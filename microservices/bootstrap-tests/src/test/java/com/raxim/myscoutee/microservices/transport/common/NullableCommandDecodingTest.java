package com.raxim.myscoutee.microservices.transport.common;

import static org.assertj.core.api.Assertions.*;
import java.util.List;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.domain.accounts.api.FriendshipProjections.Meeting;
import com.raxim.myscoutee.microservices.transport.accounts.ActivityCountersProtocol;
import com.raxim.myscoutee.microservices.transport.accounts.FriendshipProjectionsProtocol;
import com.raxim.myscoutee.microservices.transport.administration.OperationalTelemetryProtocol;
import com.raxim.myscoutee.microservices.transport.platform.ModelStatusChangesProtocol;
import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.ObjectMapper;

/** Regression for the production mapper's NON_NULL setting and required mutation fields. */
class NullableCommandDecodingTest {
    private final ObjectMapper mapper = new JsonConfig().objectMapper();

    @Test void activeDefaultWorkspaceAndAbsentTelemetryTagsSurviveCanonicalSerialization() {
        var counters = new ActivityCountersProtocol.FeedbackQuery(new ActivityCountersProtocol.Scope(true, null),
                null, "viewer", false, false, true, false);
        String json = mapper.writeValueAsString(counters);
        assertThat(json).doesNotContain("groupId", "owners");
        var decoded = read(json, ActivityCountersProtocol.FeedbackQuery.class);
        assertThat(ActivityCountersProtocol.valid(decoded)).isTrue();
        assertThat(decoded.scope().active()).isTrue();
        assertThat(decoded.scope().groupId()).isNull();

        var telemetry = new OperationalTelemetryProtocol.Command(new OperationalTelemetryProtocol.Scope(false, null),
                "rating.saved", "affinity", "row", "viewer", 1L, null);
        assertThat(OperationalTelemetryProtocol.valid(read(mapper.writeValueAsString(telemetry),
                OperationalTelemetryProtocol.Command.class))).isTrue();
        var status = new ModelStatusChangesProtocol.Command(new ModelStatusChangesProtocol.Scope(true, null), "viewer");
        assertThat(ModelStatusChangesProtocol.valid(read(mapper.writeValueAsString(status),
                ModelStatusChangesProtocol.Command.class))).isTrue();
    }

    @Test void optionalMeetingLabelsRemainOptionalButProjectionTimeCannotDefaultToZero() {
        var command = new FriendshipProjectionsProtocol.Command(List.of(new Meeting("a", "b", 42L, null, null)));
        String json = mapper.writeValueAsString(command);
        assertThat(json).doesNotContain("eventId", "eventName");
        assertThat(read(json, FriendshipProjectionsProtocol.Command.class).meetings().getFirst().projectedAtMs()).isEqualTo(42L);
        assertThatThrownBy(() -> read("{\"meetings\":[{\"left\":\"a\",\"right\":\"b\"}]}",
                FriendshipProjectionsProtocol.Command.class)).isInstanceOf(RuntimeException.class);
        assertThatThrownBy(() -> read("{\"meetings\":[{\"left\":\"a\",\"right\":\"b\",\"projectedAtMs\":null}]}",
                FriendshipProjectionsProtocol.Command.class)).isInstanceOf(RuntimeException.class);
    }

    @Test void missingCounterTransitionFlagIsRejectedInsteadOfBecomingFalse() {
        var query = read("{\"scope\":{\"active\":true},\"userId\":\"viewer\",\"wasSubmitted\":false,\"wasRemoved\":false,\"isRemoved\":false}",
                ActivityCountersProtocol.FeedbackQuery.class);
        assertThat(ActivityCountersProtocol.valid(query)).isFalse();
    }

    private <T> T read(String json, Class<T> type) {
        return mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS)
                .with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(json);
    }
}
