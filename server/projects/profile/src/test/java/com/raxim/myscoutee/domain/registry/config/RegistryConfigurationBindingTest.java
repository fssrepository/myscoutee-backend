package com.raxim.myscoutee.domain.registry.config;

import static org.assertj.core.api.Assertions.assertThat;
import java.nio.file.Path;
import java.time.Duration;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Configuration;
import com.raxim.myscoutee.domain.registry.api.RegistryConfiguration;
import com.raxim.myscoutee.domain.registry.api.RegistryDemoConfiguration;

@Tag("standard")
class RegistryConfigurationBindingTest {
    @Test void inheritedPropertiesKeepBindingDefaultsValidationAndModeSeparation() {
        new ApplicationContextRunner().withUserConfiguration(Binding.class).withPropertyValues(
                "registry.base-url=https://real.example.test", "registry.outbound-allowed=true",
                "registry.private-key-path=/real/private.pem", "registry.request-timeout=31s",
                "registry.max-response-bytes=1", "registry.demo.base-url=http://registry:8080",
                "registry.demo.private-key-path=/demo/private.pem", "registry.demo.allow-insecure-http=true")
                .run(context -> {
                    assertThat(context).hasNotFailed().hasSingleBean(RegistryConfiguration.class)
                            .hasSingleBean(RegistryDemoConfiguration.class);
                    var real = context.getBean(RegistryConfiguration.class);
                    var demo = context.getBean(RegistryDemoConfiguration.class);
                    assertThat(real.getBaseUrl()).isEqualTo("https://real.example.test");
                    assertThat(real.getPrivateKeyPath()).isEqualTo(Path.of("/real/private.pem"));
                    assertThat(real.getRequestTimeout()).isEqualTo(Duration.ofSeconds(31));
                    assertThat(real.getMaxResponseBytes()).isEqualTo(1024);
                    assertThat(real.isActive()).isFalse();
                    assertThat(real.isAllowInsecureHttp()).isFalse();
                    assertThat(demo.getBaseUrl()).isEqualTo("http://registry:8080");
                    assertThat(demo.getPrivateKeyPath()).isEqualTo(Path.of("/demo/private.pem"));
                    assertThat(demo.isAllowInsecureHttp()).isTrue();
                    assertThat(real.getStateDir()).isNotEqualTo(demo.getStateDir());
                });
    }
    @Configuration(proxyBeanMethods = false)
    @EnableConfigurationProperties({RegistryProperties.class, RegistryDemoProperties.class})
    static class Binding {}
}
