package com.raxim.myscoutee.domain.affinity.api;

import com.raxim.myscoutee.domain.platform.api.SchedulingParameters;

/** MyScoutee configuration source, including explicit affinity configuration lookup. */
public interface ConfigurationCatalog extends SchedulingParameters {
    Settings find(String id);
}
