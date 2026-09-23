#!/usr/bin/env bash
set -euo pipefail
# Uses the running dev application's already compiled classpath. Never starts
# Gradle, rebuilds the application, or starts another Spring server.
docker exec myscoutee sh -c '
  for qa_process in /proc/[0-9]*/cmdline; do
    if tr "\000" "\n" < "$qa_process" 2>/dev/null | grep -Fxq "com.raxim.myscoutee.Main"; then
      qa_classpath=$(tr "\000" "\n" < "$qa_process" | sed -n "/^-cp$/{n;p;}")
      test -n "$qa_classpath" || continue
      exec java -Xmx192m -cp "$qa_classpath" /workspace/docker/scripts/manual-qa-checkpoints/FinanceVersionProbe.java
    fi
  done
  echo "The existing compiled development application was not found." >&2
  exit 1
'
