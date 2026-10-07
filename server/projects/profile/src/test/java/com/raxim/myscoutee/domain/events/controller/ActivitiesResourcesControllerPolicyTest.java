package com.raxim.myscoutee.domain.events.controller;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.common.dto.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.domain.access.security.AccessPolicyKeys;
import com.raxim.myscoutee.domain.access.security.RequiresPolicies;
import com.raxim.myscoutee.domain.access.security.RequiresPolicy;

@org.junit.jupiter.api.Tag("standard")
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
