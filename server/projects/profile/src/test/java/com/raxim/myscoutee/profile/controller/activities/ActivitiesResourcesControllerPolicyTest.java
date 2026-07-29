package com.raxim.myscoutee.profile.controller.activities;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.security.AccessPolicyKeys;
import com.raxim.myscoutee.profile.security.RequiresPolicies;
import com.raxim.myscoutee.profile.security.RequiresPolicy;

class ActivitiesResourcesControllerPolicyTest {
    @Test
    void replaceDeclaresEventResourceAssignmentPolicies() throws Exception {
        Method method = ActivitiesResourcesController.class.getDeclaredMethod("replace", ActivitySubEventResourceStateDto.class);

        RequiresPolicies policies = method.getAnnotation(RequiresPolicies.class);

        assertThat(policies).isNotNull();
        assertThat(policies.mode()).isEqualTo(RequiresPolicies.Mode.ANY);
        assertThat(policies.skipWhenAuthenticationOptional()).isTrue();
        assertThat(policies.value())
                .extracting(RequiresPolicy::key)
                .containsExactly(
                        AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT,
                        AccessPolicyKeys.RESOURCE_ASSIGN_MANAGE);
        assertThat(policies.value()[0].subject()).isEqualTo("#request.assetOwnerUserId()");
        assertThat(policies.value()[0].resourceId()).isEqualTo("#request.authorizationEventId()");
        assertThat(policies.value()[1].subject()).isEqualTo("#actorUserId");
        assertThat(policies.value()[1].resourceId()).isEqualTo("#request.authorizationEventId()");
    }
}
