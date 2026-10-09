package com.raxim.myscoutee.domain.operator.api;
import com.raxim.myscoutee.domain.operator.dto.OperatorRevenueDtos.*;

public interface RevenueReports {
    OperatorRevenueReportPageDto reports(
            String status,
            int page,
            int size);
}
