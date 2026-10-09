package com.raxim.myscoutee.domain.affinity.service;
import com.raxim.myscoutee.domain.affinity.api.ConfigurationCatalog;
import com.raxim.myscoutee.domain.affinity.document.AffinityConfig;
import com.raxim.myscoutee.domain.affinity.repository.AffinityConfigsRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
@Service
public class ConfigurationCatalogService implements ConfigurationCatalog {
    private final AffinityConfigsRepository configs;
    @org.springframework.beans.factory.annotation.Autowired private MongoTemplate mongo;
    public ConfigurationCatalogService(AffinityConfigsRepository configs) { this.configs = configs; }
    public Settings active(String key) {
        return configs.findFirstByKeyAndActiveTrueOrderByVersionDesc(key)
            .or(() -> configs.findFirstByKeyOrderByVersionDesc(key)).orElseGet(AffinityConfig::defaults);
    }
    public Settings find(String id) { return mongo.findById(id, AffinityConfig.class); }
}
