package com.raxim.myscoutee.common.config.bootstrap;

public class OperatorBootstrapTokenInvalidException
        extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public OperatorBootstrapTokenInvalidException() {
        super("Operator bootstrap token is invalid.");
    }
}
