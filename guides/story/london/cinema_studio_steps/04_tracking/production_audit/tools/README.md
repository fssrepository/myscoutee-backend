# Frozen audit reproduction tools

These are the scripts used for the September 12 audit. They operate on the local `/tmp/myscoutee-production-audit-20260912` cache and the recorded repository path. Do not run them for brief formatting: use `../summary.json` and the CSVs.

For an explicitly requested new audit, first preserve the current results as a revision. Extract sessions with `scan_sessions.py`; verify index/source identity against `../selection.json` before `calculate.py` (its selected indices refer to the original 595-file snapshot). `image_assessment.py` consumes the saved private image-job history/sample and locally downloaded raw images; these inputs came from read-only Higgsfield history and Element queries. `export_report.py` writes the detailed audit and CSVs, never the public brief. Later checkpoint/provenance annotations were added after its initial run.

No script launches paid generation. The source cutoff is fixed; new logs after it are excluded. The public metrics labels and layout are editorial presentation of saved values, not another calculation.
