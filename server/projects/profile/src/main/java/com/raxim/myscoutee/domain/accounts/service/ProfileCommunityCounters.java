package com.raxim.myscoutee.domain.accounts.service;

import com.raxim.myscoutee.domain.accounts.document.Users;

/** Optional community-owned count appended to the stored account counter snapshot. */
interface ProfileCommunityCounters {
    int count(Users profile);
}
