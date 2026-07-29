package com.raxim.myscoutee.profile.controller.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorClaimMutationResultDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorClaimOverviewDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorClaimRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorClaimStatusDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorLeaderboardPageDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorLeaderboardRowDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorLeaderboardSnapshotDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorRedeemClientTokenRequestDto;
import com.raxim.myscoutee.profile.service.operator.OperatorNetworkService;

class OperatorNetworkControllerTest {
    @Test
    void leaderboardRouteForwardsOpaqueCursorParameters() throws Exception {
        OperatorNetworkService service = mock(OperatorNetworkService.class);
        OperatorLeaderboardSnapshotDto snapshot = new OperatorLeaderboardSnapshotDto(
                "snap_0123456789abcdef0123456789abcdef",
                "formula",
                "ruleset",
                "2026-06",
                1L,
                2L,
                "ledger",
                "audit",
                "100000",
                "1",
                "1",
                "2",
                "10",
                "1",
                "10",
                "1",
                "2026-07-28T00:00:00Z",
                "hash");
        when(service.leaderboard("claimed", "2026-06", 25, "opaque.cursor"))
                .thenReturn(new OperatorLeaderboardPageDto(
                        snapshot,
                        "claimed",
                        List.of(),
                        null));
        var mockMvc = MockMvcBuilders
                .standaloneSetup(new OperatorNetworkController(service))
                .build();

        mockMvc.perform(get("/operator/leaderboard")
                        .param("view", "claimed")
                        .param("throughPeriod", "2026-06")
                        .param("limit", "25")
                        .param("cursor", "opaque.cursor"))
                .andExpect(status().isOk());

        verify(service).leaderboard("claimed", "2026-06", 25, "opaque.cursor");
    }

    @Test
    void claimStatusUsesAuthenticatedOperatorIdentity() {
        OperatorNetworkService service = mock(OperatorNetworkService.class);
        OperatorNetworkController controller = new OperatorNetworkController(service);
        OperatorClaimStatusDto expectedStatus = new OperatorClaimStatusDto(
                true,
                "2026-07-28T00:00:00Z",
                "operator-1",
                "Operator",
                null,
                "opg_0123456789abcdef0123456789abcdef",
                null,
                25D,
                "1",
                "4",
                "AVAILABLE",
                null,
                "APPROVED",
                "2026-07-28T00:00:00Z",
                "Operator");
        OperatorClaimRequestDto submission = new OperatorClaimRequestDto(
                "Operator",
                "REG-42",
                "Slovakia",
                "Main Street 1",
                "https://example.test",
                "Alex Reviewer",
                "Director",
                "alex@example.test",
                true);
        OperatorClaimOverviewDto expected =
                new OperatorClaimOverviewDto(expectedStatus, submission);
        var authentication = new UsernamePasswordAuthenticationToken(
                "operator-1",
                null,
                List.of(new SimpleGrantedAuthority("O")));
        when(service.claimStatus("operator-1")).thenReturn(expected);

        assertThat(controller.claimStatus(authentication)).isSameAs(expected);
        verify(service).claimStatus("operator-1");
    }

    @Test
    void structuredClaimReturnsStatusAndCanonicalLeaderboardMutation() {
        OperatorNetworkService service = mock(OperatorNetworkService.class);
        OperatorNetworkController controller = new OperatorNetworkController(service);
        OperatorClaimRequestDto request = new OperatorClaimRequestDto(
                "Example Cooperative",
                "REG-42",
                "Slovakia",
                "Main Street 1",
                "https://example.test",
                "Alex Reviewer",
                "Director",
                "alex@example.test",
                true);
        OperatorClaimStatusDto expectedStatus = new OperatorClaimStatusDto(
                true,
                "2026-07-28T00:00:00Z",
                "operator-1",
                "Example Cooperative",
                null,
                "opg_0123456789abcdef0123456789abcdef",
                null,
                0D,
                "0",
                "1",
                "AVAILABLE",
                null,
                "PENDING_REVIEW",
                "2026-07-28T00:00:00Z",
                "Example Cooperative");
        OperatorLeaderboardRowDto leaderboardEntry =
                new OperatorLeaderboardRowDto(
                        "opg_0123456789abcdef0123456789abcdef",
                        "claimed",
                        "opg_0123456789abcdef0123456789abcdef",
                        "Example Cooperative",
                        "",
                        "pending-review",
                        1L,
                        "0",
                        "1",
                        "0",
                        "1");
        OperatorClaimMutationResultDto expected = new OperatorClaimMutationResultDto(
                expectedStatus,
                request,
                leaderboardEntry,
                List.of(leaderboardEntry),
                List.of("dep_0123456789abcdef0123456789abcdef"),
                0);
        var authentication = new UsernamePasswordAuthenticationToken(
                "operator-1",
                null,
                List.of(new SimpleGrantedAuthority("O")));
        when(service.submitClaim(request, "operator-1", "claim-request-12345678"))
                .thenReturn(expected);

        assertThat(controller.claim(
                request,
                "claim-request-12345678",
                authentication)).isSameAs(expected);
        verify(service).submitClaim(request, "operator-1", "claim-request-12345678");
    }

    @Test
    void clientTokenRedemptionReturnsCanonicalLeaderboardMutation() {
        OperatorNetworkService service = mock(OperatorNetworkService.class);
        OperatorNetworkController controller = new OperatorNetworkController(service);
        OperatorRedeemClientTokenRequestDto request =
                new OperatorRedeemClientTokenRequestDto(
                        "client-token",
                        "redeem-request-12345678");
        OperatorClaimMutationResultDto expected =
                new OperatorClaimMutationResultDto(
                        null,
                        null,
                        null,
                        List.of(),
                        List.of("dep_0123456789abcdef0123456789abcdef"),
                        -1);
        var authentication = new UsernamePasswordAuthenticationToken(
                "operator-1",
                null,
                List.of(new SimpleGrantedAuthority("O")));
        when(service.redeemClientToken(request, "operator-1"))
                .thenReturn(expected);

        assertThat(controller.redeemClientToken(request, authentication))
                .isSameAs(expected);
        verify(service).redeemClientToken(request, "operator-1");
    }

    @Test
    void controllerRequiresOperatorAuthorityWithoutAdminFallback() {
        PreAuthorize annotation = OperatorNetworkController.class.getAnnotation(PreAuthorize.class);

        assertThat(annotation).isNotNull();
        assertThat(annotation.value()).isEqualTo("hasAuthority('O')");
        assertThat(annotation.value()).doesNotContain("'A'");
    }
}
