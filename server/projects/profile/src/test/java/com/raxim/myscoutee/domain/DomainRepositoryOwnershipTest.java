package com.raxim.myscoutee.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.core.ResolvableType;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.data.mongodb.repository.MongoRepository;

@Tag("standard")
class DomainRepositoryOwnershipTest {
    @Test
    void authoritativeMongoRepositoryAndDocumentShareTheSameDomainOwner() throws Exception {
        var resources = new PathMatchingResourcePatternResolver().getResources(
                "classpath*:com/raxim/myscoutee/domain/**/repository/*.class");
        int checked = 0;
        for (var resource : resources) {
            String location = resource.getURL().toString();
            String relative = location.substring(location.indexOf("com/raxim/myscoutee/domain/"));
            if (relative.contains("$")) {
                continue;
            }
            String className = relative.substring(0, relative.length() - ".class".length()).replace('/', '.');
            Class<?> repository = Class.forName(className, false, getClass().getClassLoader());
            if (!MongoRepository.class.isAssignableFrom(repository)) {
                continue;
            }
            Class<?> document = ResolvableType.forClass(repository).as(MongoRepository.class).getGeneric(0).resolve();
            assertThat(document).as("Authoritative document for %s", className).isNotNull();
            assertThat(owner(document)).as("Repository ownership: %s -> %s", className, document.getName())
                    .isEqualTo(owner(repository));
            checked++;
        }
        assertThat(checked).as("Discovered concrete Mongo repository contracts").isGreaterThan(60);
    }

    private String owner(Class<?> type) {
        String prefix = "com.raxim.myscoutee.domain.";
        assertThat(type.getPackageName()).startsWith(prefix);
        return type.getPackageName().substring(prefix.length()).split("\\.")[0];
    }
}
