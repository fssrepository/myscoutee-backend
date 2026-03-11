# Submodule Rule

Do not modify submodules directly from this parent repository workspace.
If the submodule's standalone repository is available in the workspace, always modify that standalone repository.
Use this parent repository only to update the submodule pointer after standalone repo changes.

# Stop Command Rule

If the user says `stop` (or a direct variant like `stop!`, `stoppp`, `stop thinking`), immediately halt all actions:
- no more tool calls
- no edits
- no planning/explanations
- reply with a brief acknowledgment only

Resume only after a new explicit user request.
