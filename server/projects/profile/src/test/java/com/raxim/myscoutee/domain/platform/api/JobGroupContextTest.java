package com.raxim.myscoutee.domain.platform.api;

import static org.assertj.core.api.Assertions.*;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

@Tag("standard")
class JobGroupContextTest {
    @Test void nestedFailureRestoresOuterScopeAndDoesNotLeakMemoizedData() {
        var reads = new AtomicInteger();
        assertThat(JobGroupContext.isActive()).isFalse();
        JobGroupContext.run("outer", () -> {
            assertThat(JobGroupContext.memo("same-key", reads::incrementAndGet)).isEqualTo(1);
            assertThatThrownBy(() -> JobGroupContext.run("inner", () -> {
                assertThat(JobGroupContext.groupId()).isEqualTo("inner");
                assertThat(JobGroupContext.memo("same-key", reads::incrementAndGet)).isEqualTo(2);
                throw new IllegalStateException("nested failure");
            })).isInstanceOf(IllegalStateException.class).hasMessage("nested failure");
            assertThat(JobGroupContext.groupId()).isEqualTo("outer");
            assertThat(JobGroupContext.memo("same-key", reads::incrementAndGet)).isEqualTo(1);
        });
        assertThat(JobGroupContext.isActive()).isFalse();
        assertThat(JobGroupContext.groupId()).isNull();
        assertThat(JobGroupContext.memo("same-key", reads::incrementAndGet)).isEqualTo(3);
    }
}
