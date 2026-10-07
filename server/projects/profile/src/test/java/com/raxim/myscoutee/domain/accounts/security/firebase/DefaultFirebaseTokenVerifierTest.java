package com.raxim.myscoutee.domain.accounts.security.firebase;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;

import com.google.firebase.auth.FirebaseAuth;
import com.raxim.myscoutee.domain.accounts.security.firebase.exception.FirebaseTokenInvalidException;
import com.raxim.myscoutee.domain.platform.service.DeploymentFirebaseRuntime;

@org.junit.jupiter.api.Tag("standard")
class DefaultFirebaseTokenVerifierTest {
    @Test
    void rejectsMissingTokensWithoutResolvingTheFirebaseRuntime() {
        DeploymentFirebaseRuntime runtime =
                mock(DeploymentFirebaseRuntime.class);
        DefaultFirebaseTokenVerifier verifier =
                new DefaultFirebaseTokenVerifier(runtime);

        assertThatThrownBy(() -> verifier.verify("  "))
                .isInstanceOf(FirebaseTokenInvalidException.class)
                .hasMessage(
                        "Invalid Firebase authentication token.");
        verifyNoInteractions(runtime);
    }

    @Test
    void hidesUpstreamFirebaseDiagnosticsFromAuthenticationCallers()
            throws Exception {
        DeploymentFirebaseRuntime runtime =
                mock(DeploymentFirebaseRuntime.class);
        FirebaseAuth authentication = mock(FirebaseAuth.class);
        when(runtime.authentication()).thenReturn(authentication);
        when(authentication.verifyIdToken("invalid-token"))
                .thenThrow(new IllegalStateException(
                        "secret-project upstream diagnostic"));
        DefaultFirebaseTokenVerifier verifier =
                new DefaultFirebaseTokenVerifier(runtime);

        assertThatThrownBy(() -> verifier.verify("invalid-token"))
                .isInstanceOf(FirebaseTokenInvalidException.class)
                .hasMessage(
                        "Invalid Firebase authentication token.")
                .hasMessageNotContaining("secret-project");
    }
}
