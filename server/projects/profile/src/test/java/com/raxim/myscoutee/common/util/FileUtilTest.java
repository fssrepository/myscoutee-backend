package com.raxim.myscoutee.common.util;

import static org.assertj.core.api.Assertions.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockHttpServletResponse;

@Tag("standard")
class FileUtilTest {
    @TempDir Path temporary;

    @Test
    void savesTheWholeStreamWhenAvailableReportsZero() throws IOException {
        byte[] content = new byte[65_539];
        Arrays.fill(content, (byte) 42);
        var input = new ChunkedInput(content, 4096);
        Path file = temporary.resolve("content.bin");

        FileUtil.save(input, file.toString());

        assertThat(Files.readAllBytes(file)).isEqualTo(content);
        assertThat(input.closed).isFalse();
    }

    @Test
    void savesEveryShortReadWithoutConsultingAvailable() throws IOException {
        byte[] content = "content delivered in several short reads".getBytes(java.nio.charset.StandardCharsets.UTF_8);
        var input = new ChunkedInput(content, 3) {
            @Override public int available() { throw new AssertionError("available is not a stream length"); }
        };
        Path file = temporary.resolve("short.txt");

        FileUtil.save(input, file.toString());

        assertThat(Files.readAllBytes(file)).isEqualTo(content);
        assertThat(input.closed).isFalse();
    }

    @Test
    void propagatesAReadFailureWithoutClosingTheCallerInput() throws IOException {
        var input = new ChunkedInput(new byte[]{1, 2, 3}, 3) {
            private boolean read;
            @Override public int read(byte[] bytes, int offset, int length) throws IOException {
                if (read) throw new IOException("interrupted input");
                read = true;
                return super.read(bytes, offset, length);
            }
        };
        Path file = temporary.resolve("failed.bin");

        assertThatIOException().isThrownBy(() -> FileUtil.save(input, file.toString()))
                .withMessage("interrupted input");
        assertThat(input.closed).isFalse();
        assertThat(Files.readAllBytes(file)).containsExactly(1, 2, 3);
    }

    @Test
    void copiesTheFileAndPreservesDownloadHeaders() throws IOException {
        Path file = temporary.resolve("image.png");
        Files.write(file, new byte[]{1, 2, 3});
        var response = new MockHttpServletResponse();

        FileUtil.copyFileToHttp(response, file.toFile());

        assertThat(response.getContentAsByteArray()).containsExactly(1, 2, 3);
        assertThat(response.getContentType()).isEqualTo("image/png");
        assertThat(response.getContentLength()).isEqualTo(3);
        assertThat(response.getHeader("Content-Disposition")).isEqualTo("inline; filename=\"image.png\"");
    }

    @Test
    void doesNotWriteAResponseForAMissingFile() throws IOException {
        var response = new MockHttpServletResponse();

        FileUtil.copyFileToHttp(response, temporary.resolve("missing").toFile());

        assertThat(response.getContentAsByteArray()).isEmpty();
        assertThat(response.getHeaderNames()).isEmpty();
    }

    private static class ChunkedInput extends InputStream {
        private final ByteArrayInputStream source;
        private final int chunkSize;
        boolean closed;

        ChunkedInput(byte[] content, int chunkSize) {
            this.source = new ByteArrayInputStream(content);
            this.chunkSize = chunkSize;
        }

        @Override public int available() { return 0; }
        @Override public int read() { return source.read(); }
        @Override public int read(byte[] bytes, int offset, int length) throws IOException {
            return source.read(bytes, offset, Math.min(length, chunkSize));
        }
        @Override public void close() { closed = true; }
    }
}
