package com.raxim.myscoutee.profile.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.stream.Stream;

import org.junit.jupiter.api.DynamicTest;
import org.junit.jupiter.api.TestFactory;
import org.springframework.test.util.ReflectionTestUtils;

import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.Asset.AssetRequestRecord;
import com.raxim.myscoutee.profile.security.AccessControlService;

class AssetBorrowRejectionPolicyTest {
    private record Case(String name, String status, boolean reject, boolean cancel, boolean fullWrite,
            boolean expected) {}

    @TestFactory
    Stream<DynamicTest> retainedDeletionAuditUsesTheRemovalPermission() {
        return Stream.of(
                new Case("owner rejects pending request", "pending", true, false, true, true),
                new Case("manager rejects pending request", "pending", true, false, false, true),
                new Case("requester cancels pending request", "pending", false, true, false, true),
                new Case("unrelated actor cannot reject", "pending", false, false, false, false),
                new Case("full asset edit alone cannot reject", "pending", false, false, true, false),
                new Case("reject permission cannot cancel accepted borrow", "accepted", true, false, true, false),
                new Case("accepted borrow retains cancellation permission", "accepted", false, true, false, true)
        ).map(item -> DynamicTest.dynamicTest(item.name(), () -> check(item)));
    }

    @SuppressWarnings("unchecked")
    private void check(Case item) {
        AssetsService service = mock(AssetsService.class, CALLS_REAL_METHODS);
        AccessControlService access = mock(AccessControlService.class);
        ReflectionTestUtils.setField(service, "accessControlService", access);
        when(access.canCurrentActorRejectAssetBorrow("riley", "asset")).thenReturn(item.reject());
        when(access.canCurrentActorCancelAssetBorrow("riley", "asset")).thenReturn(item.cancel());
        AssetRequestRecord request = new AssetRequestRecord(
                "request", "riley", "Riley", "", "", item.status(), "", "borrow", "", null);
        Asset existing = new Asset();
        existing.setAssetId("asset");
        existing.setRequests(List.of(request));
        // The UI removes the row; the service retains it as a deleted audit
        // before evaluating policy. Exercise that exact boundary.
        List<AssetRequestRecord> audits = ReflectionTestUtils.invokeMethod(
                service, "preserveRequestAudits", existing.getRequests(), List.of());
        assertEquals(1, audits.size());
        assertEquals("D", audits.get(0).status());
        Asset proposed = new Asset();
        proposed.setAssetId("asset");
        proposed.setRequests(audits);
        Boolean allowed = ReflectionTestUtils.invokeMethod(
                service, "canApplyAssetRequestPolicies", existing, proposed, item.fullWrite());
        assertEquals(item.expected(), allowed);
        verify(access, never()).canCurrentActorRequestAssetBorrow(anyString(), anyString());
        verify(access, never()).canCurrentActorApproveAssetBorrow(anyString(), anyString());
    }
}
