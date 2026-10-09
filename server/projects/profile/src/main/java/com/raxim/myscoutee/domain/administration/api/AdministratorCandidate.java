package com.raxim.myscoutee.domain.administration.api;

/** Existing display/profile classification inputs; this is not proof of actor authority. */
public interface AdministratorCandidate {
    String getUserId();
    String getHostTier();
    String getStatusText();
}
