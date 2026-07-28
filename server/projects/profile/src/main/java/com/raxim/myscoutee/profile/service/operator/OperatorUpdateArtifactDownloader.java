package com.raxim.myscoutee.profile.service.operator;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Duration;
import java.util.Locale;
import java.util.Objects;
import java.util.function.LongConsumer;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.properties.OperatorUpdateProperties;

@Component
public class OperatorUpdateArtifactDownloader {
    private final HttpClient httpClient;
    private final Duration requestTimeout;

    public OperatorUpdateArtifactDownloader(OperatorUpdateProperties properties) {
        this(
                HttpClient.newBuilder()
                        .connectTimeout(properties.getDownloadConnectTimeout())
                        .followRedirects(HttpClient.Redirect.NEVER)
                        .build(),
                properties.getDownloadTimeout());
    }

    OperatorUpdateArtifactDownloader(
            HttpClient httpClient,
            Duration requestTimeout) {
        this.httpClient = Objects.requireNonNull(httpClient);
        this.requestTimeout = Objects.requireNonNull(requestTimeout);
    }

    public void download(
            String artifactUrl,
            Path target,
            long expectedSize,
            long maximumSize,
            LongConsumer progress) throws IOException, InterruptedException {
        URI uri = requireHttpsArtifactUri(artifactUrl);
        if (expectedSize < 1L || expectedSize > maximumSize) {
            throw new IllegalArgumentException(
                    "The signed update artifact exceeds the configured download limit.");
        }
        HttpRequest request = HttpRequest.newBuilder(uri)
                .GET()
                .timeout(requestTimeout)
                .header(
                        "Accept",
                        "application/vnd.debian.binary-package, application/octet-stream")
                .build();
        HttpResponse<InputStream> response = httpClient.send(
                request,
                HttpResponse.BodyHandlers.ofInputStream());
        if (response.statusCode() != 200) {
            try (InputStream ignored = response.body()) {
                // Close the bounded response without exposing its untrusted body.
            }
            throw new IOException(
                    "The signed update artifact endpoint returned HTTP "
                            + response.statusCode()
                            + ".");
        }
        long contentLength = response.headers()
                .firstValueAsLong("Content-Length")
                .orElse(-1L);
        if (contentLength >= 0L && contentLength != expectedSize) {
            try (InputStream ignored = response.body()) {
                // Close before rejecting the signed size mismatch.
            }
            throw new IOException(
                    "The update artifact Content-Length differs from the signed manifest.");
        }

        byte[] buffer = new byte[64 * 1024];
        long written = 0L;
        try (InputStream input = response.body();
                FileChannel output = FileChannel.open(
                        target,
                        StandardOpenOption.CREATE_NEW,
                        StandardOpenOption.WRITE)) {
            int read;
            while ((read = input.read(buffer)) >= 0) {
                if (read == 0) {
                    continue;
                }
                written += read;
                if (written > expectedSize || written > maximumSize) {
                    throw new IOException(
                            "The update artifact exceeded its signed size.");
                }
                ByteBuffer bytes = ByteBuffer.wrap(buffer, 0, read);
                while (bytes.hasRemaining()) {
                    output.write(bytes);
                }
                progress.accept(written);
            }
            output.force(true);
        }
        if (written != expectedSize) {
            throw new IOException(
                    "The update artifact size differs from the signed manifest.");
        }
    }

    static URI requireHttpsArtifactUri(String value) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException(
                    "The signed update artifact URL is missing.");
        }
        URI uri;
        try {
            uri = URI.create(value.trim());
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                    "The signed update artifact URL is invalid.",
                    exception);
        }
        if (!"https".equals(uri.getScheme() == null
                        ? ""
                        : uri.getScheme().toLowerCase(Locale.ROOT))
                || !StringUtils.hasText(uri.getHost())
                || uri.getRawUserInfo() != null
                || uri.getRawFragment() != null) {
            throw new IllegalArgumentException(
                    "The signed update artifact URL must be an absolute HTTPS URL.");
        }
        if (uri.getPath() == null
                || !uri.getPath().toLowerCase(Locale.ROOT).endsWith(".deb")) {
            throw new IllegalArgumentException(
                    "The signed update artifact must be a Debian package.");
        }
        return uri;
    }
}
