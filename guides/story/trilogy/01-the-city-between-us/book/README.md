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
python3 guides/story/trilogy/01-the-city-between-us/book/build_public_book.py
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

The build embeds `frontend/src/assets/logo/heart.png`. It needs Python 3,
`google-chrome`, Inkscape, `pdftk`, and the Poppler tools `pdftotext`,
`pdfseparate`, and `pdfunite`. It needs no network access or third-party Python
package. Full-bleed cover and part-opener pages are rendered separately and
merged into the typeset book; vector ending ornaments are then stamped at a
fixed bottom-of-page position.

## Ending ornament system

The seven ending ornaments are original vectors, not reproductions of museum
objects or frames from *Hungarian Folk Tales*. They use documented craft
languages as a visual grammar and mix each Hungarian root with the outward
movement of the chapter sequence:

1. roots and open horizon — life tree, seed, wheat and outward route marks;
2. ground, key and gate — the three-part floral order of `cifraszűr`, a keyhole
   and cultivated furrows;
3. the house between cities — painted-furniture vines, a shared house, London
   rain and distant windows;
4. indigo world routes — white-on-indigo `kékfestő` rosettes, a compass and
   returning paths;
5. human heart and encounter — carved gingerbread-form birds, an open heart and
   distinct paths that meet;
6. lace network and star — Hövej-inspired leaf loops and six rosettes joined to
   one guiding star;
7. notebook, truth and return — carved-and-painted branches surrounding the
   open cognac notebook and a final star.

The same contextual ornament returns as a low-contrast watermark on the next
part opener. Each opener has its own restrained palette—earth, London brick and
slate, indigo route blue, human burgundy, network violet, and cognac brown—while
the typography and composition remain one coherent book system.

Chapter drop caps repeat the central sign of their current part ornament at
miniature scale behind the initial letter. They therefore carry context rather
than acting as a generic blue typographic flourish.

Each chapter heading ends in a full-width two-pixel gradient rule. Its palette
follows the current part cover and fades into the paper, making it a structural
separator rather than a detached decorative underline.

The research basis includes the Hungarian Ethnography descriptions of
[ornamental folk art](https://mek.oszk.hu/02700/02790/html/110.html),
[embroidery and `cifraszűr`](https://www.mek.oszk.hu/02700/02790/html/115.html),
and [painted furniture](https://mek.oszk.hu/02700/02790/html/113.html); UNESCO's
record of [European resist block printing and indigo dyeing](https://ich.unesco.org/en/RL/blaudruck-modrotisk-kekfestes-modrotla-resist-block-printing-and-indigo-dyeing-in-europe-01365);
the Hungarikum collection's account of
[Hövej lace](https://www.hungarikum.hu/hu/node/6975); and the Rómer Flóris
Museum's catalogue of [carved gingerbread moulds](https://romer.hu/en/magazine/mezeskalacsformak/).

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
