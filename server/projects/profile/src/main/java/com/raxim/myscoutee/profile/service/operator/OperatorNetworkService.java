package com.raxim.myscoutee.profile.service.operator;

import java.util.EnumMap;
import java.util.List;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.RegistryDemoProperties;
import com.raxim.myscoutee.common.config.properties.RegistryProperties;
import com.raxim.myscoutee.profile.data.document.OperatorRegistrySettings;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorActionResultDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorAnnouncementPageDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorClaimRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorClaimStatusDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorLeaderboardDeploymentPageDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorLeaderboardPageDto;
import com.raxim.myscoutee.profile.repository.OperatorRegistrySettingsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.registry.RegistryHttpClient.RegistryHttpException;
import com.raxim.myscoutee.registry.RegistryOperatorNetworkOperations;
import com.raxim.myscoutee.registry.RegistryOperatorNetworkService.ActionCommand;
import com.raxim.myscoutee.registry.RegistryOperatorNetworkService.ClaimVerification;
import com.raxim.myscoutee.registry.RegistryProtocol;
import com.raxim.myscoutee.registry.RegistryProtocolException;

@Service
public class OperatorNetworkService {
    private final OperatorRegistrySettingsRepository settingsRepository;
    private final UsersRepository usersRepository;
    private final RegistryProperties realProperties;
    private final RegistryDemoProperties demoProperties;
    private final RegistryOperatorNetworkOperations operations;
    private final OperatorNetworkMapper mapper;
    private final EnumMap<MongoSessionMode, Object> modeLocks =
            new EnumMap<>(MongoSessionMode.class);

    public OperatorNetworkService(
            OperatorRegistrySettingsRepository settingsRepository,
            UsersRepository usersRepository,
            RegistryProperties realProperties,
            RegistryDemoProperties demoProperties,
            RegistryOperatorNetworkOperations operations,
            OperatorNetworkMapper mapper) {
        this.settingsRepository = Objects.requireNonNull(settingsRepository);
        this.usersRepository = Objects.requireNonNull(usersRepository);
        this.realProperties = Objects.requireNonNull(realProperties);
        this.demoProperties = Objects.requireNonNull(demoProperties);
        this.operations = Objects.requireNonNull(operations);
        this.mapper = Objects.requireNonNull(mapper);
        for (MongoSessionMode mode : MongoSessionMode.values()) {
            modeLocks.put(mode, new Object());
        }
    }

    public OperatorActionResultDto apply(
            OperatorActionRequestDto request,
            String actorUserId) {
        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Operator action request is required.");
        }
        if (RegistryProtocol.OPERATOR_ACTION_CLAIM.equals(safeText(request.action()))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Submit structured company claims through /operator/claim.");
        }
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            try {
                return mapper.toActionResult(operations.apply(
                        requireRegisteredRuntime(mode),
                        new ActionCommand(
                                request.action(),
                                request.operatorName(),
                                request.operatorAvatarUrl(),
                                request.clientToken(),
                                request.tokenTtlSeconds(),
                                request.tokenId(),
                                request.linkId(),
                                request.idempotencyKey())));
            } catch (RegistryHttpException exception) {
                throw registryHttpFailure(exception);
            } catch (RegistryProtocolException exception) {
                throw registryProtocolFailure(exception);
            } catch (IllegalArgumentException exception) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        safeMessage(exception),
                        exception);
            } catch (IllegalStateException exception) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        safeMessage(exception),
                        exception);
            }
        }
    }

    public OperatorClaimStatusDto submitClaim(
            OperatorClaimRequestDto request,
            String actorUserId,
            String idempotencyKey) {
        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Operator company verification request is required.");
        }
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            try {
                RegistryProperties runtime = requireRegisteredRuntime(mode);
                String avatarUrl = operatorAvatar(actorUserId);
                operations.apply(
                        runtime,
                        new ActionCommand(
                                RegistryProtocol.OPERATOR_ACTION_CLAIM,
                                null,
                                avatarUrl,
                                null,
                                null,
                                null,
                                null,
                                safeText(idempotencyKey),
                                new ClaimVerification(
                                        request.legalName(),
                                        request.registrationNumber(),
                                        request.jurisdiction(),
                                        request.registeredAddress(),
                                        request.website(),
                                        request.verificationContactName(),
                                        request.verificationContactRole(),
                                        request.verificationContactEmail(),
                                        request.authorityAttested())));
                return mapper.toClaimStatus(
                        operations.claimStatus(runtime),
                        safeText(actorUserId));
            } catch (RegistryHttpException exception) {
                throw registryHttpFailure(exception);
            } catch (RegistryProtocolException exception) {
                throw registryProtocolFailure(exception);
            } catch (IllegalArgumentException exception) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        safeMessage(exception),
                        exception);
            } catch (IllegalStateException exception) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        safeMessage(exception),
                        exception);
            }
        }
    }

    public OperatorLeaderboardPageDto leaderboard(
            String view,
            String throughPeriod,
            Integer limit,
            String cursor) {
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            try {
                return mapper.toLeaderboardPage(operations.leaderboard(
                        requireRegisteredRuntime(mode),
                        StringUtils.hasText(view) ? view.trim() : "claimed",
                        safeText(throughPeriod),
                        limit,
                        safeText(cursor)));
            } catch (RegistryHttpException exception) {
                throw registryHttpFailure(exception);
            } catch (RegistryProtocolException exception) {
                throw registryProtocolFailure(exception);
            } catch (IllegalArgumentException exception) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        safeMessage(exception),
                        exception);
            } catch (IllegalStateException exception) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        safeMessage(exception),
                        exception);
            }
        }
    }

    public OperatorAnnouncementPageDto announcements(
            String kind,
            String severity,
            String channel,
            Boolean includeExpired,
            Integer limit,
            String cursor) {
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            try {
                return mapper.toAnnouncementPage(operations.announcements(
                        requireRegisteredRuntime(mode),
                        safeText(kind),
                        safeText(severity),
                        safeText(channel),
                        Boolean.TRUE.equals(includeExpired),
                        limit,
                        safeText(cursor)));
            } catch (RegistryHttpException exception) {
                throw registryHttpFailure(exception);
            } catch (RegistryProtocolException exception) {
                throw registryProtocolFailure(exception);
            } catch (IllegalArgumentException exception) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        safeMessage(exception),
                        exception);
            } catch (IllegalStateException exception) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        safeMessage(exception),
                        exception);
            }
        }
    }

    public OperatorClaimStatusDto claimStatus(String actorUserId) {
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            try {
                return mapper.toClaimStatus(
                        operations.claimStatus(requireRegisteredRuntime(mode)),
                        safeText(actorUserId));
            } catch (RegistryHttpException exception) {
                throw registryHttpFailure(exception);
            } catch (RegistryProtocolException exception) {
                throw registryProtocolFailure(exception);
            } catch (IllegalArgumentException exception) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        safeMessage(exception),
                        exception);
            } catch (IllegalStateException exception) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        safeMessage(exception),
                        exception);
            }
        }
    }

    public OperatorLeaderboardDeploymentPageDto leaderboardDeployments(
            String groupId,
            String throughPeriod,
            Integer limit,
            String cursor) {
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            try {
                return mapper.toLeaderboardDeploymentPage(
                        operations.leaderboardDeployments(
                                requireRegisteredRuntime(mode),
                                groupId,
                                safeText(throughPeriod),
                                limit,
                                safeText(cursor)));
            } catch (RegistryHttpException exception) {
                throw registryHttpFailure(exception);
            } catch (RegistryProtocolException exception) {
                throw registryProtocolFailure(exception);
            } catch (IllegalArgumentException exception) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        safeMessage(exception),
                        exception);
            } catch (IllegalStateException exception) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        safeMessage(exception),
                        exception);
            }
        }
    }

    private String operatorAvatar(String actorUserId) {
        String userId = safeText(actorUserId);
        if (!StringUtils.hasText(userId)) {
            return "";
        }
        return usersRepository.findByUserId(userId)
                .map(Users::getImages)
                .map(OperatorNetworkService::firstAbsoluteHttpsImage)
                .orElse("");
    }

    private RegistryProperties requireRegisteredRuntime(MongoSessionMode mode) {
        OperatorRegistrySettings settings = settingsRepository
                .findById(OperatorRegistrySettings.SINGLETON_ID)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Register this deployment before using the operator network."));
        if (!Boolean.TRUE.equals(settings.getEnabled())
                || !"REGISTERED".equals(settings.getLifecycle())
                || settings.getSelection() == null
                || settings.getEnrollment() == null
                || !StringUtils.hasText(settings.getEnrollment().getDeploymentCode())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Register this deployment before using the operator network.");
        }
        OperatorRegistrySettings.RegistrySelection selection = settings.getSelection();
        RegistryProperties runtime = new RegistryProperties();
        runtime.setEnabled(true);
        runtime.setOutboundAllowed(
                mode == MongoSessionMode.DEMO || realProperties.isOutboundAllowed());
        runtime.setOperatorRegistrationConfirmed(false);
        runtime.setBaseUrl(selection.getBaseUrl());
        runtime.setRegistryScope(selection.getRegistryScope());
        runtime.setExpectedRegistryKeyFingerprint(
                selection.getRegistryPublicKeyFingerprint());
        runtime.setTrustOnFirstUse(false);
        runtime.setConnectTimeout(realProperties.getConnectTimeout());
        runtime.setRequestTimeout(realProperties.getRequestTimeout());
        runtime.setRetryDelay(realProperties.getRetryDelay());
        runtime.setMaxResponseBytes(realProperties.getMaxResponseBytes());
        runtime.setSoftwareVersion(realProperties.getSoftwareVersion());
        runtime.setPackageSigningPublicKeyPath(
                realProperties.getPackageSigningPublicKeyPath());
        if (mode == MongoSessionMode.DEMO) {
            runtime.setPrivateKeyPath(demoProperties.getPrivateKeyPath());
            runtime.setPublicKeyPath(demoProperties.getPublicKeyPath());
            runtime.setStateDir(demoProperties.getStateDir());
            runtime.setAllowInsecureHttp(demoProperties.isAllowInsecureHttp());
            runtime.setInsecureHttpAllowedHosts(demoProperties.getInsecureHttpAllowedHosts());
        } else {
            runtime.setPrivateKeyPath(realProperties.getPrivateKeyPath());
            runtime.setPublicKeyPath(realProperties.getPublicKeyPath());
            runtime.setStateDir(realProperties.getStateDir());
            runtime.setAllowInsecureHttp(false);
            runtime.setInsecureHttpAllowedHosts("");
        }
        if (!runtime.isOutboundAllowed()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Outbound registry communication is disabled.");
        }
        return runtime;
    }

    private ResponseStatusException registryHttpFailure(RegistryHttpException exception) {
        HttpStatus status = switch (exception.getStatusCode()) {
            case 400 -> HttpStatus.BAD_REQUEST;
            case 404 -> HttpStatus.NOT_FOUND;
            case 409 -> HttpStatus.CONFLICT;
            case 410 -> HttpStatus.GONE;
            case 429 -> HttpStatus.TOO_MANY_REQUESTS;
            case 503 -> HttpStatus.SERVICE_UNAVAILABLE;
            default -> HttpStatus.BAD_GATEWAY;
        };
        return new ResponseStatusException(status, safeMessage(exception), exception);
    }

    private ResponseStatusException registryProtocolFailure(
            RegistryProtocolException exception) {
        return new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                safeMessage(exception),
                exception);
    }

    private static String firstAbsoluteHttpsImage(List<String> images) {
        if (images == null) {
            return "";
        }
        return images.stream()
                .map(OperatorNetworkService::safeText)
                .filter(image -> image.startsWith("https://"))
                .findFirst()
                .orElse("");
    }

    private static String safeMessage(Exception exception) {
        String message = exception == null ? "" : safeText(exception.getMessage());
        return StringUtils.hasText(message) ? message : "Registry operation failed.";
    }

    private static String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
