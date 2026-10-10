package com.raxim.myscoutee.domain.operator.api;
import com.raxim.myscoutee.domain.operator.dto.OperatorMeasurementDtos.*;

public interface MeasurementReports {
    /** Issued only after the integration owner's existing role and read-access checks. */
    String INTEGRATION_READ_AUTHORITY = "INTEGRATION_OPERATOR_REPORT_READ";
    OperatorMeasurementReportPageDto reports(
            String status,
            int page,
            int size);
}
