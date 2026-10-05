package com.raxim.myscoutee.profile.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.raxim.myscoutee.profile.data.document.ServiceProviderCalendar;
public interface ServiceProviderCalendarsRepository extends MongoRepository<ServiceProviderCalendar,String> {}
