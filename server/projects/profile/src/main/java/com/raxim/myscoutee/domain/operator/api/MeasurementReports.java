package com.raxim.myscoutee.domain.operator.api;
import com.raxim.myscoutee.domain.operator.dto.OperatorMeasurementDtos.*;

public interface MeasurementReports {
    OperatorMeasurementReportPageDto reports(
            String status,
            int page,
            int size);
}
