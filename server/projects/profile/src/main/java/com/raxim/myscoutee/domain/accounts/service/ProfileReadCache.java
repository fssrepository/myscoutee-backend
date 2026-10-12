package com.raxim.myscoutee.domain.accounts.service;

import java.util.Collection;

/** Local cache owners participate only while their profile feature is installed. */
interface ProfileReadCache {
    void evictUserReadCaches(String userId);
    void evictUserReadCaches(Collection<String> userIds);
}
