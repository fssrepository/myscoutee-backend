package com.raxim.myscoutee.domain.community.api;
import java.util.*;
import com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.*;
public interface ScheduledCases {
    String actor(String id);
    Page<TaskItem> page(String actor, int size, String cursor, String status);
    TaskItem save(String actor, SaveTask r);
    TaskItem action(String actor, String id, TaskCommand command);
}
