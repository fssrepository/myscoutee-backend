# Agent instructions

Before project work, load and apply
[the myscoutee-backend instructions](../myscoutee-skills/instructions/projects/myscoutee-backend.md)
and the shared documents they require. Resolve project paths from this repository
root, not from the shared checkout. Current user instructions take precedence.

Use the existing sibling `../myscoutee-skills` checkout. If it is absent, clone it
from this repository root:

```sh
git clone -- https://github.com/fssrepository/myscoutee-skills.git ../myscoutee-skills
```

If that path already exists but the required instructions are missing, report the
problem; do not overwrite it. Do not automatically pull, reset or replace an
existing checkout. A clone failure is a missing-instructions blocker; report it.

## Keep the template in sync

For every fix, inspect the equivalent implementation in
`../myscoutee-template` and carry over the applicable change in the same task.
Include entry components, tests, build scripts and packaging when affected.
Preserve the template's own behavior and deployment configuration; generate its
image lock from its own built images rather than copying backend image identities.
Verify both implementations before reporting the shared fix complete.
