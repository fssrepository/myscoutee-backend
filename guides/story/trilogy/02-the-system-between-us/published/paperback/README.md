# Part II Amazon KDP paperback upload

Upload exactly these two PDFs from this directory:

- `MyScoutee_The_Story_Part_II_The_System_Between_Us_v1.0.0_EN_Paperback_Interior_6x9.pdf`
  as the manuscript/interior;
- `MyScoutee_The_Story_Part_II_The_System_Between_Us_v1.0.0_EN_Paperback_Cover_StandardColor.pdf`
  as the cover.

KDP settings: paperback, English, left-to-right, 6 × 9 inch trim, standard color
on white paper, no interior bleed. The submitted interior has 133 pages and
does not contain the outer cover. KDP rounds this up to 134 pages for the cover
calculation. The wrap-cover PDF includes bleed and is ordered as back cover,
spine, front cover from left to right. The spine title is included because the
page count is above KDP's 79-page threshold.

Rebuild from the repository root with:

```bash
python3 guides/story/trilogy/02-the-system-between-us/book/build_review_book.py --paperback
```
