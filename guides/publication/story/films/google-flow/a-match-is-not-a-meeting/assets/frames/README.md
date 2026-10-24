# Frame map

## Owned checkpoint chain

| Role | File | Flow input? |
| --- | --- | --- |
| familiar match, missing path | `PR_CP01.png` | yes, S01 first |
| one private priority starts on the desk | `PR_CP02.png` | yes, S01 last / S02 first |
| the private editable list expands | `PR_CP03.png` | yes, S02 last / S03 first |
| six different users arrange their own lists | `PR_CP04.png` | yes, S03 last / S04 first |
| priorities and context reveal a possible group | `PR_CP05.png` | yes, S04 last / S05 first |
| people, transport, place, supplies | `PR_CP06.png` | yes, S05 last / S06 first |
| real shared meeting | `PR_CP07.png` | yes, S06 last / S07 first |
| warmer next invitation | `PR_CP08.png` | yes, S07 last |
| transparent opening brand layer | `PR_OPENING_OVERLAY.png` | no, post composite |
| transparent closing brand layer | `PR_CLOSING_OVERLAY.png` | no, post composite |
| branded first-frame reference | `PR_OPENING_BRANDED.png` | no, post composite |
| branded last-frame reference | `PR_CLOSING_BRANDED.png` | no, post composite |

The exact brand source is
`../../../../../frontend/src/assets/logo/heart.png`.

`PR_OPENING_BRANDED` and `PR_CLOSING_BRANDED` use the untouched heart asset with
editable rasterized `yScoutee`; they document the first/last appearance but
never enter Flow.

The matching transparent `PR_OPENING_OVERLAY` and `PR_CLOSING_OVERLAY` layers
carry only the deterministic gradient, mark and text. They are composited over
the moving accepted footage by `scripts/brand_the_product.sh`.
