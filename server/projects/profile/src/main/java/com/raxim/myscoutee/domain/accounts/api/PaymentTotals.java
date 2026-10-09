package com.raxim.myscoutee.domain.accounts.api;
public interface PaymentTotals {
    enum Direction { SPENT, INCOME, ALL }
    void increment(String userId, Direction direction, String currency, double amount);
    void reverseReceipt(String userId, String receiptId, Direction direction, String currency, double amount);
    void incrementPendingRefunds(String userId);
    void decrementPendingRefunds(String userId);
    String summaryCurrency(String userId);
    void selectSummaryCurrency(String userId, String currency);
}
