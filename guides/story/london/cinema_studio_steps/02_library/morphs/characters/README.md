# Character morph references

Each prompt specifies a concrete transformation between two existing characters, with distinct intermediate body, face and garment volumes. The intended output is one 4K 2×2 sheet; source character identity sheets remain 1×3. These are remembered people and have no rating cards.

| Prompt | Source → destination | Story connection |
|---|---|---|
| [CM001](CM001_APPOINTED_LAWYER_TO_OFFICE_SUBSTITUTE_2X2.txt) | C04 → C26 | The expected appointed lawyer and the defence-office substitute: MW04 B, the defence-contact memory. |
| [CM002](CM002_SOHO_WOMAN_TO_BEGINNER_DANCE_WOMAN_2X2.txt) | C02 → C10 | The Soho encounter and beginner dance memory: two distinct women, MW01 / MW06. |
| [CM003](CM003_SNORING_HOUSEMATE_TO_MORTGAGE_HOUSEMATE_2X2.txt) | C06 → C07 | Two separate occupants of the crowded London shared house: MW01 B, a housemate change and family obligations. |
| [CM004](CM004_TRANSIT_HELPER_TO_CAIRO_TRAVELER_2X2.txt) | C11 → C13 | The Russian transit passenger and the Sudanese man in the Cairo taxi memory: MW02 travel connections. |
| [CM005](CM005_ADMIN_COLLEAGUE_A_TO_B_2X2.txt) | C23 → C24 | Administrative colleagues working from different versions: MW03 A, three people without a shared screen. |
| [CM006](CM006_FORENSIC_EXPERT_A_TO_B_2X2.txt) | C28 → C29 | Two experts with different reactions, faces and clothes: MW05 B, the examination memory. |

## Output Element mentions

The creator supplied these exact Higgsfield output IDs on 2026-09-10. Use them to reference the generated morph sheets; each morph image-generation prompt continues to use its two C-character inputs.

- CM001: `@char_MYS_mys-cm001-appointed-lawyer-to-office-substitute_s0_v1`
- CM002: `@char_MYS_mys-cm002-soho-woman-to-beginner-dance-woman_s0_v1`
- CM003: `@char_MYS_mys-cm003-snoring-housemate-to-mortgage-housemate_s0_v1`
- CM004: `@char_MYS_mys-cm004-transit-helper-to-cairo-traveler_s0_v1`
- CM005: `@char_MYS_mys-cm005-admin-colleague-a-to-b_s0_v1`
- CM006: `@char_MYS_mys-cm006-forensic-expert-a-to-b_s0_v1`

The authoritative bindings are stored in [source_manifest.json](../../../04_tracking/source_manifest.json). The six mentions are also included in [reference_motion_options.txt](../../../03_film/draft/reference_motion_options.txt). Selecting a transition for a particular film beat remains separate from binding its output Element; these entries do not add new film events. The original characters remain separate people in their own scenes, including the three administrative colleagues and the two experts.

The creator reported a morph output with a 1×3 layout but did not identify its CM key. Actual outputs have not been inspected here; the intended 2×2 layout is not a claim that every generated image achieved it. No regeneration is requested.

The six output definitions are already included in [MORPHS_IMPORT.md](../../../00_project/elements/categories/MORPHS_IMPORT.md); no additional import or duplicate character definition is needed.
