package com.raxim.myscoutee.domain.administration.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;

import org.junit.jupiter.api.Test;

@org.junit.jupiter.api.Tag("standard")
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
