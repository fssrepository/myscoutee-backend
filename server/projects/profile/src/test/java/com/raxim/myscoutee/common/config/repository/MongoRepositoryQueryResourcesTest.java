package com.raxim.myscoutee.common.config.repository;

import static org.assertj.core.api.Assertions.*;

import java.io.IOException;
import java.net.URI;
import java.net.URLClassLoader;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileSystemNotFoundException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.jar.JarEntry;
import java.util.jar.JarOutputStream;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.data.repository.Repository;
import org.springframework.test.util.ReflectionTestUtils;

@Tag("standard")
class MongoRepositoryQueryResourcesTest {
    private static final String QUERY = "[{\"$match\":{\"name\":\":name\"}},{\"$limit\":5}]";
    @TempDir Path temporary;

    @Test
    void loadsExplodedQueriesWithoutReadingSubdirectories() throws IOException {
        Path directory = temporary.resolve("mongo/queryfixture");
        Files.createDirectories(directory.resolve("ignored"));
        Files.writeString(directory.resolve("find.json"), QUERY);
        Files.writeString(directory.resolve("ignored/invalid.json"), "not a pipeline");

        assertQuery(load(temporary));
    }

    @Test
    void loadsJarQueriesRepeatedlyWithoutLeavingAMountedFileSystem() throws IOException {
        Path archive = archive();

        assertQuery(load(archive));
        assertQuery(load(archive));

        assertThatExceptionOfType(FileSystemNotFoundException.class)
                .isThrownBy(() -> FileSystems.getFileSystem(URI.create("jar:" + archive.toUri())));
    }

    @Test
    void doesNotCloseAFileSystemOwnedByAnotherCaller() throws IOException {
        Path archive = archive();
        try (var borrowed = FileSystems.newFileSystem(archive)) {
            assertQuery(load(archive));
            assertThat(borrowed.isOpen()).isTrue();
            assertThat(Files.readString(borrowed.getPath("/mongo/queryfixture/find.json"))).isEqualTo(QUERY);
        }
    }

    @Test
    void preservesTheEmptyResultWhenNoQueryDirectoryExists() throws IOException {
        assertThat(load(temporary)).isEmpty();
    }

    private Path archive() throws IOException {
        Path archive = temporary.resolve("queries.jar");
        try (var output = new JarOutputStream(Files.newOutputStream(archive))) {
            for (String name : new String[]{"mongo/", "mongo/queryfixture/"}) {
                output.putNextEntry(new JarEntry(name));
                output.closeEntry();
            }
            output.putNextEntry(new JarEntry("mongo/queryfixture/find.json"));
            output.write(QUERY.getBytes(StandardCharsets.UTF_8));
            output.closeEntry();
        }
        return archive;
    }

    @SuppressWarnings("unchecked")
    private Map<String, String[]> load(Path classpath) throws IOException {
        Thread thread = Thread.currentThread();
        ClassLoader previous = thread.getContextClassLoader();
        try (var loader = new URLClassLoader(new java.net.URL[]{classpath.toUri().toURL()}, previous)) {
            thread.setContextClassLoader(loader);
            var factory = new MongoRepositoryFactoryBean<QueryFixtureRepository, Object, String>(QueryFixtureRepository.class);
            Map<String, String[]> result = ReflectionTestUtils.invokeMethod(factory, "loadQueries");
            assertThat(result).isNotNull();
            return result;
        } finally {
            thread.setContextClassLoader(previous);
        }
    }

    private void assertQuery(Map<String, String[]> queries) {
        assertThat(queries).containsOnlyKeys("find");
        assertThat(queries.get("find")).hasSize(2);
        assertThat(queries.get("find")[0]).contains(":name").doesNotContain("\":name\"");
        assertThat(queries.get("find")[1]).contains("$limit", "5");
    }

    interface QueryFixtureRepository extends Repository<Object, String> {}
}
