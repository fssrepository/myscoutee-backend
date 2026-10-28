# Learning guides

Illustrated explanations of development concepts, with examples relevant to
MyScoutee. These are learning material, not application policy or live operational
status reports.

| Guide | Language | Contents |
| --- | --- | --- |
| [Git Workflows and CI Runners (PDF)](MyScoutee_Git_Workflows_and_CI_Runners_EN.pdf) | English | Branching strategies, runner scopes and executors, concurrency, parallel jobs, and MyScoutee context |
| [Patterns, Data Structures and Algorithms (PDF)](MyScoutee_Patterns_Data_Structures_and_Algorithms_EN.pdf) | English | Application design patterns, concrete data structures and algorithms, and a source-backed map of adjacent laboratories |

The Git guide incorporates both shared conversations:
[branching and runner scope](https://chatgpt.com/share/6ade4b53-01c0-83ed-9e5f-b38cc5948fed)
and [parallel execution](https://chatgpt.com/share/6ade4c16-d9d4-83ed-ab4d-3a645b6e1b44).
Primary sources and pinned repository references are linked inside the PDF.

## Rebuild the Git guide

The editable text and vector diagrams live in
[`build-git-ci-guide.py`](build-git-ci-guide.py). Requires Python 3, ReportLab and
DejaVu fonts at `/usr/share/fonts/truetype/dejavu`.

```sh
python3 guides/learning/build-git-ci-guide.py
pdfinfo guides/learning/MyScoutee_Git_Workflows_and_CI_Runners_EN.pdf
```

For visual review, render the output into a temporary directory with `pdftoppm`
and inspect every page. The generator checks for overflowing text, tables, code
and diagram boxes. The released PDF stays beside its source, following the
repository documentation layout. This standalone guide does not publish copies
into the frontend product-manual catalog.

The patterns guide's editable inventory and laboratory map live in the sibling
`myscoutee-architecture/guides/development/engineering/` checkout, with the
`guides/publication/manuals/build-guide.py` generator. Run
that generator from the architecture repository root to rebuild this PDF and
its separate Engineering Deep Dive PDF. The learning guide is published here
because it explains implementation concepts rather than operating the product.
