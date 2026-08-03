# Trust tooling

This directory contains the executable support for the project-local trust
protocol. Behavioral instructions remain under `.agents/trust`; model eval
specifications live under `suite/` so normal agent loading does not include the
exam prompts or expected semantics.

## Entrypoints

- `run-trust-evals.mjs` validates, previews, or runs the model regression suite.
- `validate-trust-library.sh` checks trust structure, links, references, suite
  definitions, and runner self-tests without calling a model.
- `trust-mode.sh` manages the gitignored local `off|light|standard|deep` mode.
- `tests/` contains offline tests for the eval runner and grader.
- `suite/` contains the versioned cases, schema, documentation, and reviewed
  baseline reports.

```bash
tools/trust/validate-trust-library.sh
node tools/trust/run-trust-evals.mjs --validate
node tools/trust/run-trust-evals.mjs --model <candidate-model> --dry-run
```

Live model runs are always explicit. Raw responses and reports remain under the
gitignored `.e2e-artifacts/trust-evals/` directory.
