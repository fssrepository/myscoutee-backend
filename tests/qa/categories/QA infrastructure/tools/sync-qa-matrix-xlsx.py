#!/usr/bin/env python3
"""Sync this application's unchanged matrix layout through the shared QA tool."""
import os
from pathlib import Path
import subprocess
import sys
project = Path(__file__).resolve().parents[5]
source = Path(os.environ.get('MYSCOUTEE_QA_SOURCE', project / 'tests/qa/node_modules/@fssrepository/myscoutee-qa'))
matrix = project / 'tests/qa'
subprocess.run([sys.executable, str(source / 'matrix/sync-qa-matrix-xlsx.py'),
    '--csv', str(matrix / 'QA_MATRIX.csv'),
    '--xlsx', str(matrix / 'QA_MATRIX.xlsx'),
    '--repository-root', str(project)], check=True)
