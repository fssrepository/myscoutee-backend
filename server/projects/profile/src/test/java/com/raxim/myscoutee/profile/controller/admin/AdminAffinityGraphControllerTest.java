package com.raxim.myscoutee.profile.controller.admin;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphForestsDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphMetaDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphNeighborhoodDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphTileDto;
import com.raxim.myscoutee.profile.service.AdminAffinityGraphService;
import com.raxim.myscoutee.profile.service.AdminModerationService;
import com.raxim.myscoutee.profile.service.AdminMonitoringService;
import com.raxim.myscoutee.profile.service.AdminParamsService;
import com.raxim.myscoutee.profile.service.AdminStatsService;
import com.raxim.myscoutee.profile.service.AffinityRecomputeMetricsService;
import com.raxim.myscoutee.profile.service.HelpCenterService;
import com.raxim.myscoutee.profile.service.IdeaPostsService;
import com.raxim.myscoutee.profile.service.notifications.AdminNotificationService;

@ExtendWith(MockitoExtension.class)
class AdminAffinityGraphControllerTest {
    @Mock
    private AdminModerationService adminModerationService;
    @Mock
    private HelpCenterService helpCenterService;
    @Mock
    private IdeaPostsService ideaPostsService;
    @Mock
    private AdminNotificationService adminNotificationService;
    @Mock
    private AdminStatsService adminStatsService;
    @Mock
    private AdminParamsService adminParamsService;
    @Mock
    private AdminMonitoringService adminMonitoringService;
    @Mock
    private AdminAffinityGraphService adminAffinityGraphService;
    @Mock
    private AffinityRecomputeMetricsService affinityRecomputeMetricsService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(new AdminController(
                        adminModerationService,
                        helpCenterService,
                        ideaPostsService,
                        adminNotificationService,
                        adminStatsService,
                        adminParamsService,
                        adminMonitoringService,
                        adminAffinityGraphService,
                        affinityRecomputeMetricsService))
                .build();
    }

    @Test
    void graphEndpointsForwardAdminActorAndFilters() throws Exception {
        when(adminAffinityGraphService.full("admin-1", 0.2d, 1d))
                .thenReturn(new AdminAffinityGraphDto("now", "http", "layout-1", List.of(), List.of()));
        when(adminAffinityGraphService.meta("admin-1", 0.2d, 1d))
                .thenReturn(new AdminAffinityGraphMetaDto("now", "http", "layout-1", 3, 2, 1, 0, 6, 256, 1000, 5000, false));
        when(adminAffinityGraphService.forests("admin-1", 0.2d, 1d, 1, 20, 20))
                .thenReturn(new AdminAffinityGraphForestsDto("now", "http", "layout-1", 40, 1, 2, 20, 20, List.of()));
        when(adminAffinityGraphService.tile("admin-1", "layout-1", 2, 1, 0, 0.2d, 1d, "c0"))
                .thenReturn(new AdminAffinityGraphTileDto("now", "http", "layout-1", 2, 1, 0, 0, 0, false, List.of(), List.of()));
        when(adminAffinityGraphService.neighborhood("admin-1", "u1", 2, 0.2d, 1d))
                .thenReturn(new AdminAffinityGraphNeighborhoodDto("now", "http", "layout-1", "u1", 2, List.of(), List.of()));
        when(adminAffinityGraphService.rebuildLayout("admin-1"))
                .thenReturn(new AdminAffinityGraphMetaDto("now", "materialized", "layout-2", 3, 2, 1, 0, 6, 256, 1000, 5000, true));

        mockMvc.perform(get("/admin/affinity-graph/full")
                        .param("adminUserId", "admin-1")
                        .param("minWeight", "0.2")
                        .param("maxWeight", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.layoutVersion").value("layout-1"));
        mockMvc.perform(get("/admin/affinity-graph/meta")
                        .param("adminUserId", "admin-1")
                        .param("minWeight", "0.2")
                        .param("maxWeight", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.memberCount").value(3));
        mockMvc.perform(get("/admin/affinity-graph/forests")
                        .param("adminUserId", "admin-1")
                        .param("minWeight", "0.2")
                        .param("maxWeight", "1")
                        .param("forestLevel", "1")
                        .param("limit", "20")
                        .param("offset", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.layoutVersion").value("layout-1"));
        mockMvc.perform(get("/admin/affinity-graph/tiles")
                        .param("adminUserId", "admin-1")
                        .param("layoutVersion", "layout-1")
                        .param("z", "2")
                        .param("x", "1")
                        .param("y", "0")
                        .param("minWeight", "0.2")
                        .param("maxWeight", "1")
                        .param("componentId", "c0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.z").value(2));
        mockMvc.perform(get("/admin/affinity-graph/members/u1/neighborhood")
                        .param("adminUserId", "admin-1")
                        .param("depth", "2")
                        .param("minWeight", "0.2")
                        .param("maxWeight", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.centerUserId").value("u1"));
        mockMvc.perform(post("/admin/affinity-graph/layout/rebuild")
                        .param("adminUserId", "admin-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.materialized").value(true));

        verify(adminAffinityGraphService).full("admin-1", 0.2d, 1d);
        verify(adminAffinityGraphService).meta("admin-1", 0.2d, 1d);
        verify(adminAffinityGraphService).forests("admin-1", 0.2d, 1d, 1, 20, 20);
        verify(adminAffinityGraphService).tile("admin-1", "layout-1", 2, 1, 0, 0.2d, 1d, "c0");
        verify(adminAffinityGraphService).neighborhood("admin-1", "u1", 2, 0.2d, 1d);
        verify(adminAffinityGraphService).rebuildLayout("admin-1");
    }
}
