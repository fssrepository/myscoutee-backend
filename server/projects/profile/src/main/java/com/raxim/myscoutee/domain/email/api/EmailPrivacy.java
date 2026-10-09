package com.raxim.myscoutee.domain.email.api;
public interface EmailPrivacy {
    void purgeDeliveryData(String userId);
    void anonymizeAuthors(String userId);
}
