package com.raxim.myscoutee.domain.community.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.raxim.myscoutee.domain.community.document.ServiceProviderCalendar;
public interface ServiceProviderCalendarsRepository extends MongoRepository<ServiceProviderCalendar,String> {}
