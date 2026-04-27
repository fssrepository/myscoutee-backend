# FRONTEND WORKFLOW RULE

ALWAYS EDIT `frontend/` DIRECTLY FROM THIS WORKSPACE FOR THIS REPOSITORY.
DO NOT SPEND TIME CHECKING WHETHER THERE IS A STANDALONE FRONTEND REPOSITORY OR WHETHER `frontend/` IS A SUBMODULE.
ONLY DO THAT CHECK IF THE USER EXPLICITLY ASKS FOR IT.

# Stop Command Rule

If the user says `stop` (or a direct variant like `stop!`, `stoppp`, `stop thinking`), immediately halt all actions:
- no more tool calls
- no edits
- no planning/explanations
- reply with a brief acknowledgment only

Resume only after a new explicit user request.
