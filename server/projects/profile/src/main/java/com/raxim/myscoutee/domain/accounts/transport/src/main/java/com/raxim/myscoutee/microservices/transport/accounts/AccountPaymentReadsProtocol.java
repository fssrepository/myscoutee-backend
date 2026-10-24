package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.Collection;
import com.raxim.myscoutee.domain.accounts.dto.AccountPaymentSummaryDto;

public final class AccountPaymentReadsProtocol {
    public static final String SUMMARY = "/_internal/v1/accounts/payment-reads/summary";
    public static final String TOTALS = "/_internal/v1/accounts/payment-reads/totals";
    public static final String PARTICIPANTS = "/_internal/v1/accounts/payment-reads/participants";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024;
    public static final int MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
    private AccountPaymentReadsProtocol() {}
    public static String[] paths() { return new String[] {SUMMARY, TOTALS, PARTICIPANTS}; }
    public record SummaryQuery(String userId) {}
    public record ParticipantsQuery(Collection<String> ids) {}
    public record SummaryResult(Boolean resolved, AccountPaymentSummaryDto value) {}
    public record TotalsResult(Boolean resolved, com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserPaymentTotalsDto value) {}
    public record Error(String code) {}
    public static boolean valid(SummaryQuery value) {
        return value != null && (value.userId() == null || value.userId().length() <= 512);
    }
    public static boolean valid(ParticipantsQuery value) {
        return value != null && value.ids() != null && value.ids().size() <= 4096
                && value.ids().stream().allMatch(id -> id == null || id.length() <= 512);
    }
}
