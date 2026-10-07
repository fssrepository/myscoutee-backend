package com.raxim.myscoutee.domain.platform.api;
import java.util.Optional;
import com.raxim.myscoutee.domain.platform.dto.EncryptedSecret;
/** Read-only deployment configuration; updates remain with the deployment owner. */
public interface DeploymentSettings {
    String SINGLETON_ID = "deployment-configuration";
    Optional<? extends Configuration> findById(String id);
    interface Configuration { Integration getIntegration(); Payment getPayment(); }
    interface Integration { String getPublicBaseUrl(); }
    interface Payment {
        String getProviderId(); String getPublicBaseUrl(); String getMerchantAccount();
        String getExchangeRateUrl(); EncryptedSecret getCredentialEnvelope(); String getCredentialMask();
    }
}
