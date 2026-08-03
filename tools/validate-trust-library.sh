#!/usr/bin/env bash
# Validate the repository-local agent trust protocol and its canonical links.
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "${repo_root}"

required=(
  AGENTS.md
  .agents/trust/manifest.md
  .agents/trust/constitution.md
  .agents/trust/routing.md
  .agents/trust/evidence-model.md
  .agents/trust/risk-model.md
  .agents/trust/system-map.md
  .agents/trust/sources.md
  .agents/trust/maintenance.md
  .agents/trust/habits/worktree-and-scope.md
  .agents/trust/habits/diagnosis-before-change.md
  .agents/trust/habits/change-discipline.md
  .agents/trust/habits/efficiency-scan.md
  .agents/trust/habits/search-before-create.md
  .agents/trust/habits/runtime-and-tests.md
  .agents/trust/habits/full-flow-evidence.md
  .agents/trust/habits/continuity-and-corrections.md
  .agents/trust/reviews/bugfix.md
  .agents/trust/reviews/frontend.md
  .agents/trust/reviews/java-backend.md
  .agents/trust/reviews/data-and-seeds.md
  .agents/trust/reviews/demo-e2e-production.md
  .agents/trust/reviews/derived-state.md
  .agents/trust/reviews/performance.md
  .agents/trust/reviews/testing.md
  .agents/trust/reviews/protocol-and-registry.md
  .agents/trust/reviews/security-and-privacy.md
  .agents/trust/reviews/packaging-and-release.md
  .agents/trust/reviews/cross-repository.md
  .agents/trust/reviews/docs-and-i18n.md
  .agents/trust/reviews/completion.md
  .agents/trust/patterns/catalog.md
  .agents/trust/patterns/frontend-vertical-slice.md
  .agents/trust/patterns/java-domain-slice.md
  .agents/trust/patterns/environment-isolation.md
  .agents/trust/patterns/write-time-derived-state.md
  .agents/trust/patterns/external-durable-work.md
  .agents/trust/patterns/ui-behavior-parity.md
  .agents/trust/learnings/accepted.md
  .agents/trust/learnings/candidates.md
  .agents/trust/learnings/rejected-patterns.md
  .agents/trust/learnings/provenance.md
  .agents/trust/learnings/working-context.md
  .agents/trust/templates/task-ledger.md
  .agents/trust/templates/trust-record.md
  .agents/trust/templates/learning-candidate.md
)

failed=0
for path in "${required[@]}"; do
  if [[ ! -f "${path}" ]]; then
    printf 'missing required file: %s\n' "${path}" >&2
    failed=1
  fi
done

if ! rg -q '\.agents/trust/manifest\.md' AGENTS.md; then
  printf 'AGENTS.md does not reference the trust manifest\n' >&2
  failed=1
fi

while IFS= read -r entry; do
  source_file="${entry%%:*}"
  markdown_link="${entry#*:}"
  target="${markdown_link#']('}"
  target="${target%')'}"
  target="${target%%#*}"
  [[ -z "${target}" ]] && continue
  [[ "${target}" == http://* || "${target}" == https://* ]] && continue
  resolved="$(realpath -m "$(dirname "${source_file}")/${target}")"
  if [[ ! -e "${resolved}" ]]; then
    printf 'broken Markdown link: %s -> %s\n' "${source_file}" "${target}" >&2
    failed=1
  fi
done < <(rg --no-heading --with-filename -o '\]\([^)]*\.md(?:#[^)]*)?\)' \
  AGENTS.md .agents/trust -g '*.md' || true)

references=(
  frontend/src/app/shared/core/base/services/operator-registry.service.ts
  frontend/src/app/shared/core/http/services/operator-registry.service.ts
  frontend/src/app/shared/core/local/source/services/operator-registry.service.ts
  frontend/src/app/shared/ui/context/stores/operator-registry.store.ts
  frontend/src/app/shared/core/base/services/route-delay.service.ts
  frontend/src/app/shared/core/local/seed/services/demo-bootstrap.service.ts
  server/projects/profile/src/main/java/com/raxim/myscoutee/profile/controller/operator/OperatorRegistryController.java
  server/projects/profile/src/main/java/com/raxim/myscoutee/profile/service/operator/OperatorRegistryService.java
  server/projects/profile/src/main/java/com/raxim/myscoutee/registry/RegistryOperatorNetworkService.java
  guides/plans/PROJECT_CONTEXT.md
  guides/plans/PRODUCTION_QUALIFICATION.md
  e2e/README.md
)

for path in "${references[@]}"; do
  if [[ ! -e "${path}" ]]; then
    printf 'missing catalog/canonical reference: %s\n' "${path}" >&2
    failed=1
  fi
done

if (( failed != 0 )); then
  exit 1
fi

printf 'MyScoutee trust library validation passed (%d required files).\n' \
  "${#required[@]}"
