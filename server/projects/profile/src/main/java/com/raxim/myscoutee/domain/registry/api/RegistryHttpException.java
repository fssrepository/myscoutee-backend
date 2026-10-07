package com.raxim.myscoutee.domain.registry.api;
    public final class RegistryHttpException extends RuntimeException {
        private static final long serialVersionUID = 1L;

        private final int statusCode;
        private final String errorCode;

        public RegistryHttpException(int statusCode, String errorCode, String message) {
            super(message);
            this.statusCode = statusCode;
            this.errorCode = errorCode;
        }

        public RegistryHttpException(int statusCode, String errorCode, String message, Throwable cause) {
            super(message, cause);
            this.statusCode = statusCode;
            this.errorCode = errorCode;
        }

        public int getStatusCode() {
            return statusCode;
        }

        public String getErrorCode() {
            return errorCode;
        }
    }
