package com.raxim.myscoutee.domain.community.api;
import java.util.*;
import com.raxim.myscoutee.domain.community.dto.ServiceOfferingDtos.*;
import com.raxim.myscoutee.domain.community.dto.CommunityAnnouncementDtos.Page;
public interface ServiceOfferings {
    java.util.List<com.raxim.myscoutee.domain.community.dto.ServiceOfferingDto> visibleMetadata(String actor, java.util.Collection<String> ids);
    String actor(String userId);
    Item detail(String actor,String id);
    Page<Item> page(String actor,String scope,String status,String category,String search,Double distance,int pageSize,String cursor);
    Page<Item> page(String actor,String scope,String status,String category,String search,Double distance,int pageSize,String cursor,List<String> serviceIds);
    Item save(String actor,Save r);
    Item action(String actor,String id,Command r);
}
