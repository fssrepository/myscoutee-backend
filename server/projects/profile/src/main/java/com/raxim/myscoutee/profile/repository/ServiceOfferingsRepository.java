package com.raxim.myscoutee.profile.repository;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.raxim.myscoutee.profile.data.document.ServiceOffering;
public interface ServiceOfferingsRepository extends MongoRepository<ServiceOffering,String> {
    List<ServiceOffering> findByBaseGroupIdAndStatus(String baseGroupId, String status);
    List<ServiceOffering> findByBaseGroupIdAndOwnerAccountIdAndStatus(String baseGroupId, String ownerAccountId, String status);
}
