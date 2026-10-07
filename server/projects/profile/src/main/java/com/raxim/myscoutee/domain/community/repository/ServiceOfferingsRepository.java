package com.raxim.myscoutee.domain.community.repository;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.raxim.myscoutee.domain.community.document.ServiceOffering;
public interface ServiceOfferingsRepository extends MongoRepository<ServiceOffering,String> {
    List<ServiceOffering> findByBaseGroupIdAndStatus(String baseGroupId, String status);
    List<ServiceOffering> findByBaseGroupIdAndOwnerAccountIdAndStatus(String baseGroupId, String ownerAccountId, String status);
}
