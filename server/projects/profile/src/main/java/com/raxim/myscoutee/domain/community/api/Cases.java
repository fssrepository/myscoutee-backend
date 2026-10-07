package com.raxim.myscoutee.domain.community.api;
import java.util.*;
import com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.*;
public interface Cases {
    String actor(String id);
    CaseItem detail(String actor, String id);
    CaseItem read(String actor, String id);
    Page<CaseItem> page(String actor, String status, String type, int size, String cursor);
    CaseItem save(String actor, SaveCase r);
    CaseItem action(String actor, String id, Command r);
}
