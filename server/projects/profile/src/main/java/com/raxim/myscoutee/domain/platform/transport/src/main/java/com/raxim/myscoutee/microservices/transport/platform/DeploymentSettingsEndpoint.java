package com.raxim.myscoutee.microservices.transport.platform;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.platform.api.DeploymentSettings;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class DeploymentSettingsEndpoint {
    private final DeploymentSettings owner;
    private final ObjectMapper mapper;
    public DeploymentSettingsEndpoint(DeploymentSettings owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = DeploymentSettingsProtocol.FIND, produces = "application/json")
    public ResponseEntity<?> find(HttpServletRequest request) throws java.io.IOException {
        return read(request, DeploymentSettingsProtocol.Query.class, DeploymentSettingsProtocol::valid, command -> new DeploymentSettingsProtocol.Result(true, owner.findById(command.id()).map(com.raxim.myscoutee.domain.platform.dto.DeploymentSettingsDto::from).orElse(null)));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, DeploymentSettingsProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new DeploymentSettingsProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new DeploymentSettingsProtocol.Error("DEPLOYMENT_SETTINGS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}
