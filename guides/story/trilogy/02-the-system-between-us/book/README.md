# Part II book

Working title: **The System Between Us**.

Status: **The English and Hungarian first-edition drafts are synchronized for
publication on 20 August 2026.**

The manuscript is [THE_SYSTEM_BETWEEN_US_REVIEW_DRAFT_EN.md](THE_SYSTEM_BETWEEN_US_REVIEW_DRAFT_EN.md).

The Hungarian edition source is
[THE_SYSTEM_BETWEEN_US_REVIEW_DRAFT_HU.md](THE_SYSTEM_BETWEEN_US_REVIEW_DRAFT_HU.md).
Its editable reading copy is
[MyScoutee_The_Story_Part_II_The_System_Between_Us_v1.0.0_HU.pdf](draft/MyScoutee_The_Story_Part_II_The_System_Between_Us_v1.0.0_HU.pdf).

The current editable reading copy is
[MyScoutee_The_Story_Part_II_The_System_Between_Us_v1.0.0_EN.pdf](draft/MyScoutee_The_Story_Part_II_The_System_Between_Us_v1.0.0_EN.pdf).
The browser edition is
[MYSCOUTEE_THE_STORY_PART_II_PUBLIC_EDITION_EN.html](MYSCOUTEE_THE_STORY_PART_II_PUBLIC_EDITION_EN.html).
The matching locked PDF, checksum and publication manifest live under
[`../published/`](../published/).

Build the editable review HTML and PDF from the repository root with:

```bash
python3 guides/story/trilogy/02-the-system-between-us/book/build_review_book.py
```

The builder writes the browser edition beside the manuscript. An explicit
`--pdf` path creates the replaceable editable export; the default locked build
writes the public PDF, SHA-256 checksum and publication manifest. It refuses to
overwrite a published version, so any later released correction requires a new
edition number.

The private-source and transcript tasks remain useful post-publication source
hardening, not claims that the public memoir is a complete legal record. The
edition itself clearly separates documents, attributed recollection, memoir
and later context.

Part II deliberately ends before the final result. Part III will record what the
proceeding, institutional transition, Founder and product ultimately become.
