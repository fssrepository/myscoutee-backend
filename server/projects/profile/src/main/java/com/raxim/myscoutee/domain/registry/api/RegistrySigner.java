package com.raxim.myscoutee.domain.registry.api;
/** Local signing capability. The private key remains inside the registry owner. */
public interface RegistrySigner {
    String deploymentPublicKeyBase64(); String deploymentPublicKeyFingerprint(); byte[] deploymentPublicKeyDer();
    String signBase64(byte[] canonicalMessage); byte[] sign(byte[] canonicalMessage);
}
