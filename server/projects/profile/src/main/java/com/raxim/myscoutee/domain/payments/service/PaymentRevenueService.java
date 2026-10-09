package com.raxim.myscoutee.domain.payments.service;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.payments.repository.PaymentsRepository;
import com.raxim.myscoutee.domain.payments.api.PaymentRevenue;
import com.raxim.myscoutee.domain.payments.document.Payment;
@Service
public class PaymentRevenueService implements PaymentRevenue {
 private final PaymentsRepository payments;
 public PaymentRevenueService(PaymentsRepository payments) { this.payments = payments; }
 public java.util.List<Payment> findRevenueCandidates() { return payments.findRevenueCandidates(); }
}
