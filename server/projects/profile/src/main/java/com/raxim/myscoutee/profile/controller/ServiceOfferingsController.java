package com.raxim.myscoutee.profile.controller;
import org.springframework.web.bind.annotation.*;
import com.raxim.myscoutee.profile.service.ServiceOfferingsService;
import com.raxim.myscoutee.profile.data.dto.community.ServiceOfferingDtos.*;
import com.raxim.myscoutee.profile.data.dto.community.CommunityAnnouncementDtos.Page;
@RestController @RequestMapping("/service-offerings")
public class ServiceOfferingsController {
    private final ServiceOfferingsService service;
    public ServiceOfferingsController(ServiceOfferingsService service){this.service=service;}
    @GetMapping public Page<Item> page(@RequestParam String userId,@RequestParam(defaultValue="own")String scope,@RequestParam(defaultValue="published")String status,
        @RequestParam(required=false)String category,@RequestParam(required=false)String search,@RequestParam(required=false)Double maxDistanceKm,
        @RequestParam(required=false)java.util.List<String> serviceIds,@RequestParam(defaultValue="20")int pageSize,@RequestParam(required=false)String cursor){return service.page(service.actor(userId),scope,status,category,search,maxDistanceKm,pageSize,cursor,serviceIds);}
    @GetMapping("/{id}")public Item detail(@RequestParam String userId,@PathVariable String id){return service.detail(service.actor(userId),id);}
    @PostMapping public Item save(@RequestBody Save r){return service.save(service.actor(r.userId()),r);}
    @PostMapping("/{id}/action")public Item action(@PathVariable String id,@RequestBody Command r){return service.action(service.actor(r.userId()),id,r);}
}
