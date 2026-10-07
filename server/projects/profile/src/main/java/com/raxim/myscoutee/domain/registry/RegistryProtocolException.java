package com.raxim.myscoutee.domain.registry;

/**
 * Signals that a registry response failed protocol validation after transport succeeded.
 */
public final class RegistryProtocolException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public RegistryProtocolException(String message) {
        super(message);
    }

    public RegistryProtocolException(String message, Throwable cause) {
        super(message, cause);
    }
}
