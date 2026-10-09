#!/usr/bin/env python3
"""Use the canonical packaged runtime-status HTTP regression suite."""
import runpy
from pathlib import Path
runpy.run_path(str(Path(__file__).resolve().parents[4] / 'packaging/tests/runtime-status-test.py'), run_name='__main__')
