package com.raxim.myscoutee.profile.service.email;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.data.document.EmailCampaignRule;
import com.raxim.myscoutee.profile.data.document.Users;

class PromotionalEmailRuleEvaluatorTest {
    private final PromotionalEmailRuleEvaluator evaluator = new PromotionalEmailRuleEvaluator();

    @Test
    void qualifiesFallbackEmailForActiveUserWithoutRegisteredDevice() {
        Users user = activeUser();
        user.setDevices(List.of());

        EmailCampaignRule rule = new EmailCampaignRule();
        rule.setRequireMissingRegisteredDevice(true);
        rule.setMaxProfileCompletion(80);

        assertThat(evaluator.qualifies(user, rule)).isTrue();
    }

    @Test
    void rejectsFallbackEmailWhenDeviceIsRegistered() {
        Users user = activeUser();
        Users.UserDeviceRecord device = new Users.UserDeviceRecord();
        device.setFirebaseToken("token-1");
        user.setDevices(List.of(device));

        EmailCampaignRule rule = new EmailCampaignRule();
        rule.setRequireMissingRegisteredDevice(true);

        assertThat(evaluator.qualifies(user, rule)).isFalse();
    }

    @Test
    void buildsSnakeCaseTemplateVariablesForStaticMongoTemplates() {
        Users user = activeUser();
        user.setName("Alex Carter");
        user.setCity("Budapest");
        user.setPartitionKey("country:hu");
        user.setCompletion(72);

        EmailCampaignRule rule = new EmailCampaignRule();
        rule.setRuleKey("country-global-promo-hu");
        rule.setCtaPath("/game");
        rule.setTemplateVariables(Map.of(
                "promo_headline", "See what's new",
                "@cta_label", "Open now"));

        Map<String, String> variables = evaluator.buildTemplateVariables(user, rule, "https://app.myscoutee.com");

        assertThat(variables.get("user_name")).isEqualTo("Alex Carter");
        assertThat(variables.get("user_first_name")).isEqualTo("Alex");
        assertThat(variables.get("user_country_name")).isEqualTo("Hungary");
        assertThat(variables.get("completion_percent")).isEqualTo("72");
        assertThat(variables.get("promo_headline")).isEqualTo("See what's new");
        assertThat(variables.get("cta_label")).isEqualTo("Open now");
        assertThat(variables.get("cta_url")).contains("https://app.myscoutee.com/game");
    }

    private Users activeUser() {
        Users user = new Users();
        user.setId("user-1");
        user.setName("Alex");
        user.setEmail("alex@example.com");
        user.setProfileStatus("public");
        user.setStatus("A");
        user.setCompletion(65);
        user.setActivities(new Users.UserActivitiesRecord(0, 0, 0, 0, 0, 0, 0, 0, 0));
        return user;
    }
}
