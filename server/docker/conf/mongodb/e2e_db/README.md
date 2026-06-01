This seed folder is for disposable e2e/stress runs.

The JSON files are intentionally separate files, not symlinks. They start as a
physical clone of the corrected `demo_db` seed so destructive e2e and stress
runs have realistic data while runtime writes stay isolated from `demo_db`.
