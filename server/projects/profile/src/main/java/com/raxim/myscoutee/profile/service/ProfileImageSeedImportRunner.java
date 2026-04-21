package com.raxim.myscoutee.profile.service;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@ConditionalOnProperty(value = "media.profile-seed-import.enabled", havingValue = "true")
public class ProfileImageSeedImportRunner implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(ProfileImageSeedImportRunner.class);

    private final ProfileImageSeedImportService profileImageSeedImportService;

    @Value("${media.profile-seed-import.allowed-hosts:randomuser.me}")
    private String allowedHostsValue;

    @Value("${media.profile-seed-import.max-users:0}")
    private int maxUsers;

    @Value("${media.profile-seed-import.dry-run:false}")
    private boolean dryRun;

    public ProfileImageSeedImportRunner(ProfileImageSeedImportService profileImageSeedImportService) {
        this.profileImageSeedImportService = profileImageSeedImportService;
    }

    @Override
    public void run(ApplicationArguments args) {
        Set<String> allowedHosts = new LinkedHashSet<>();
        Arrays.stream(allowedHostsValue.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .forEach(allowedHosts::add);

        log.info("Starting profile image seed import with allowedHosts={}, maxUsers={}, dryRun={}",
                allowedHosts,
                maxUsers,
                dryRun);

        ProfileImageSeedImportService.ImportSummary summary = profileImageSeedImportService.importExternalProfileImages(
                allowedHosts,
                maxUsers,
                dryRun);

        log.info("Profile image seed import completed: scannedUsers={}, updatedUsers={}, importedImages={}, failedImages={}",
                summary.scannedUsers(),
                summary.updatedUsers(),
                summary.importedImages(),
                summary.failedImages());
    }
}
