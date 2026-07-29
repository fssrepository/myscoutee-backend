package com.raxim.myscoutee.profile.data.dto.admin;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;

import org.junit.jupiter.api.Test;

class AdminStatsRevenueIsolationTest {
    @Test
    void adminDashboardContractContainsNoRevenueOrMoneyComponent() {
        assertThat(Arrays.stream(
                        AdminDtos.AdminStatsDashboardDto.class
                                .getRecordComponents())
                .map(component -> component.getName().toLowerCase())
                .toList())
                .noneMatch(name ->
                        name.contains("revenue")
                                || name.contains("money")
                                || name.contains("commission"));
    }
}
