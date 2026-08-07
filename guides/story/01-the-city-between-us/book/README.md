# MyScoutee — The Story

This folder contains the English-first, currently unpublished review draft of
the MyScoutee origin story. It is Volume `I` of a planned trilogy, a memoir-led
product book, not a translation and not a claim of proven product outcomes.

Current state: **Volume I · Draft v0.1 · not yet published**.

## Versioning and trilogy rule

`version.json` is the single source for the visible trilogy volume, edition
version, draft/public status and dates. The builder places those values on the
cover, title page and HTML/PDF metadata. `CHANGELOG.md` records the history.

- Volume `I` is a trilogy position, not the book's edition version.
- Keep this manuscript in `draft` status and below `1.0` until the Founder
  explicitly says it is ready to publish.
- The first approved public edition becomes `1.0`.
- After publication, increment the version for every released change according
  to the patch/minor/major rules in `CHANGELOG.md`.
- Future Volumes `II` and `III` receive their own version histories. Their exact
  English titles remain unassigned until the Founder confirms them.
- The stable HTML/PDF review filenames are working artifacts. At publication,
  preserve a versioned immutable release copy as well as the current working
  export.

## Build

Run from the repository root:

```bash
python3 guides/story/01-the-city-between-us/book/build_public_book.py
```

The builder writes:

- `MYSCOUTEE_THE_STORY_PUBLIC_EDITION_EN.html` beside the source;
- `../renders/MyScoutee_The_Story_Public_Review_EN.pdf` as the review artifact.

It reads `version.json`; do not type a version directly into the manuscript or
generated HTML.

The cover follows the existing manual wordmark contract: the original logo
replaces the first character of `MyScoutee`, so the visible lockup is the mark
plus `yScoutee`. It never places the mark beside the complete word and therefore
never duplicates the `M`.

A large Roman `I` marks the book as the first volume of the trilogy. It does not
replace `The Story` or the literary subtitle `The City Between Us`.

The build embeds `frontend/src/assets/logo/heart.png`. It needs Python 3 and a
`google-chrome` executable, but no network access or third-party Python package.

## Illustration system

The review edition is complete without generated illustrations. The manuscript
already contains optional illustration anchors, and `illustrations.json` maps
them to future files under `assets/illustrations/`. When every file for one
anchor exists, the next build places it automatically. When an asset is absent,
the layout closes cleanly without an empty placeholder.

The future illustrated edition supports both:

- wide character montages for the London house, global/local memories, the
  three pre-London Budapest memories, balanced six-person candidate group and
  the first shared event;
- individual portrait grids for the five Budapest women, selected London
  residents and the six-person candidate group, plus a narrow Founder portrait.

Generate each montage and its separate portraits from the same locked character
references. Do not invent a montage first and then ask another model to guess
the individual identities. The Budapest relationship montage and its five
portraits must use the identities locked with
`../prompts/budapest-before-london-relationship-memory-board.txt`. The six-person MyScoutee set remains exactly three
women and three men, with varied age, ethnicity, body, clothing, temperament
and inner expectation. Older adults retain equal agency and visual weight.

The filenames in `illustrations.json` are the asset contract. Keep them stable
after character approval so the book can be rebuilt without editing the
manuscript or layout code.

## Public boundary

The book ends with the present MyScoutee partner-and-pilot invitation. It does
not mention or foreshadow the later legal, tax or court matter. Any future
second film or documentary volume must be reconstructed separately from primary
documents and reviewed on its own facts.
