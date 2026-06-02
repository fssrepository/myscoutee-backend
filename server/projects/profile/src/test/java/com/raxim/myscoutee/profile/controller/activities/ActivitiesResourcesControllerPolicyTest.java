package com.raxim.myscoutee.profile.controller.activities;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Method;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.profile.security.AccessPolicyKeys;
import com.raxim.myscoutee.profile.security.RequiresPolicy;

class ActivitiesResourcesControllerPolicyTest {
    @Test
    void replaceDeclaresEventResourceAssignmentPolicy() throws Exception {
        Method method = ActivitiesResourcesController.class.getDeclaredMethod("replace", ActivitySubEventResourceStateDto.class);

        RequiresPolicy policy = method.getAnnotation(RequiresPolicy.class);

        assertThat(policy).isNotNull();
        assertThat(policy.key()).isEqualTo(AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT);
        assertThat(policy.subject()).isEqualTo("#request.assetOwnerUserId()");
        assertThat(policy.resourceId()).isEqualTo("#request.ownerId()");
        assertThat(policy.skipWhenAuthenticationOptional()).isTrue();
    }
}
