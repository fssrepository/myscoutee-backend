#!/usr/bin/env bash
# Validate the repository-local agent trust protocol and its canonical links.
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "${repo_root}"

required=(
  AGENTS.md
  .agents/trust/kernel.md
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
  .agents/trust/patterns/smart-list-live-surface.md
  .agents/trust/learnings/accepted.md
  .agents/trust/learnings/candidates.md
  .agents/trust/learnings/rejected-patterns.md
  .agents/trust/learnings/provenance.md
  .agents/trust/learnings/working-context.md
  .agents/trust/templates/task-ledger.md
  .agents/trust/templates/trust-record.md
  .agents/trust/templates/learning-candidate.md
  evals/trust/README.md
  evals/trust/case.schema.json
  evals/trust/baselines/README.md
  evals/trust/cases/T001-popup-live-list-options.json
  evals/trust/cases/T002-smart-list-mutation.json
  evals/trust/cases/T003-demo-bootstrap-efficiency.json
  evals/trust/cases/T004-fixture-vs-product.json
  evals/trust/cases/T005-history-not-authority.json
  evals/trust/cases/T006-running-environment.json
  evals/trust/cases/T007-persistence-proof.json
  tools/run-trust-evals.mjs
  tools/tests/trust-eval-runner-test.mjs
  tools/trust-mode.sh
  tools/validate-trust-library.sh
)

failed=0
for path in "${required[@]}"; do
  if [[ ! -f "${path}" ]]; then
    printf 'missing required file: %s\n' "${path}" >&2
    failed=1
  fi
done

if ! rg -q '\.agents/trust/kernel\.md' AGENTS.md; then
  printf 'AGENTS.md does not reference the trust kernel\n' >&2
  failed=1
fi

if ! rg -q '\.trust-mode\.local' AGENTS.md; then
  printf 'AGENTS.md does not document the local trust-mode override\n' >&2
  failed=1
fi

if ! git check-ignore -q --no-index .trust-mode.local; then
  printf '.trust-mode.local must remain gitignored\n' >&2
  failed=1
fi

if [[ -f .trust-mode.local ]]; then
  IFS= read -r local_mode < .trust-mode.local || true
  case "${local_mode}" in
    off|light|standard|deep) ;;
    *)
      printf 'invalid local trust mode: %q\n' "${local_mode}" >&2
      failed=1
      ;;
  esac
fi

kernel_lines="$(wc -l < .agents/trust/kernel.md)"
if (( kernel_lines > 140 )); then
  printf 'trust kernel exceeds the 140-line loading budget: %s\n' \
    "${kernel_lines}" >&2
  failed=1
fi

agents_lines="$(wc -l < AGENTS.md)"
if (( agents_lines > 45 )); then
  printf 'AGENTS.md exceeds the 45-line mode-gate budget: %s\n' \
    "${agents_lines}" >&2
  failed=1
fi

if ! bash -n tools/trust-mode.sh; then
  printf 'tools/trust-mode.sh has invalid shell syntax\n' >&2
  failed=1
fi

if ! node tools/run-trust-evals.mjs --validate >/dev/null; then
  printf 'trust eval case validation failed\n' >&2
  failed=1
fi

if ! node tools/tests/trust-eval-runner-test.mjs >/dev/null; then
  printf 'trust eval runner self-test failed\n' >&2
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
  frontend/src/app/shared/ui/components/core/smart-list/smart-list.component.ts
  frontend/src/app/shared/ui/components/core/smart-list/smart-list.types.ts
  frontend/src/app/shared/ui/scheduler/ui-task-scheduler.ts
  frontend/src/app/shared/ui/components/notification-center-popup/notification-center-popup.component.ts
  frontend/src/app/asset/components/asset-popup/asset-popup.component.ts
  frontend/src/app/asset/components/asset-availability-popup/asset-availability-popup.component.ts
  frontend/src/app/operator/components/operator-page/operator-page.component.ts
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
