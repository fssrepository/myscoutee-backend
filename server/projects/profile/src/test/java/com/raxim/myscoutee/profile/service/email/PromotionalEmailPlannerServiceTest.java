package com.raxim.myscoutee.profile.service.email;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.jupiter.api.Test;

class PromotionalEmailPlannerServiceTest {
    @Test
    void preservesCampaignSpecificCtaLabels() {
        assertThat(PromotionalEmailPlannerService.brandedCtaLabel(
                Map.of(
                        "ctaLabel", "Open",
                        "cta_label", "Complete my profile"),
                "Community Hub"))
                .isEqualTo("Complete my profile");
    }

    @Test
    void expandsOnlyTheGenericOpenCtaWithTheDeploymentBrand() {
        assertThat(PromotionalEmailPlannerService.brandedCtaLabel(
                Map.of(
                        "ctaLabel", "Open",
                        "cta_label", "Open"),
                "Community Hub"))
                .isEqualTo("Open Community Hub");
    }
}
