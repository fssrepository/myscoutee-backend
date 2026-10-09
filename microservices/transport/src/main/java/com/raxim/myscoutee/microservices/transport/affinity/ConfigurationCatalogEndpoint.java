package com.raxim.myscoutee.microservices.transport.affinity;

import java.util.function.Supplier;
import com.raxim.myscoutee.domain.affinity.api.ConfigurationCatalog;
import com.raxim.myscoutee.domain.affinity.dto.ConfigurationSettingsDto;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public final class ConfigurationCatalogEndpoint {
    private final ConfigurationCatalog owner;
    public ConfigurationCatalogEndpoint(ConfigurationCatalog owner) { this.owner = owner; }
    @GetMapping(value = ConfigurationCatalogProtocol.ACTIVE, produces = "application/json")
    public ResponseEntity<?> active(@RequestParam(required = false) String key) {
        return read(key, () -> owner.active(key));
    }
    @GetMapping(value = ConfigurationCatalogProtocol.FIND, produces = "application/json")
    public ResponseEntity<?> find(@RequestParam(required = false) String id) {
        return read(id, () -> owner.find(id));
    }
    private ResponseEntity<?> read(String parameter, Supplier<ConfigurationCatalog.Settings> query) {
        if (parameter != null && parameter.length() > 512) return response(400, new ConfigurationCatalogProtocol.Error("INVALID_REQUEST"));
        try {
            var result = ConfigurationSettingsDto.from(query.get());
            return result == null ? response(404, new ConfigurationCatalogProtocol.Error("NOT_FOUND")) : response(200, result);
        } catch (RuntimeException unavailable) { return response(503, new ConfigurationCatalogProtocol.Error("CONFIGURATION_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}
