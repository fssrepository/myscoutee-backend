# Element attachment audit — 2026-09-10

Live MCP inspection matched **266/266 active image definitions** from FULL_PROJECT_PROMPT_MAP.csv to an Element with attached image media. This includes **69/69 memory prompts**. Attachment coverage does not certify visual quality. The last twelve MW03 B/C and MW05 C images also matched their exact generation REFERENCE IDs. MW05_C_04 uses the revised writing-at-table prompt.

## Thirteen empty superseded Elements to delete

The creator confirmed all 13 empty Elements are visible after locating the remaining records on the external display. This resolves the earlier UI/API discrepancy. Individual MCP fetches also showed zero image and video media for these records. Their old four-view pages are superseded, and all individual replacements have attached images.

Delete only these exact old Elements; retain the numbered single-view Elements and their images. No deletion was performed by the assistant.

| Old pack | Exact Element name | UUID |
|---|---|---|
| MW01-B | `@loc_MYS_mys-mw01-b-london-social_s0_v1` | `98154ba6-6ffa-4d60-8354-40e02f7d9bca` |
| MW01-C | `@loc_MYS_mys-mw01-c-london-social_s0_v1` | `5b1ce3aa-237c-4718-a2c2-0e70f3b70132` |
| MW02-A | `@loc_MYS_mys-mw02-a-global-routes_s0_v1` | `281541e5-762a-4d6a-ab50-ae6a58f134af` |
| MW02-C | `@loc_MYS_mys-mw02-c-global-routes_s0_v1` | `42ba6eb9-09f0-4231-89f2-0a5433d12d47` |
| MW03-B | `@loc_MYS_mys-mw03-b-work-rule-change-admin_s0_v1` | `84607fe9-ff2d-4f29-b9e8-871ce72041c5` |
| MW03-C | `@loc_MYS_mys-mw03-c-work-rule-change-admin_s0_v1` | `57a942a9-c35f-4a4e-b545-132be45b91e9` |
| MW04-B | `@loc_MYS_mys-mw04-b-police-defence_s0_v1` | `24d551f4-3f6d-4f93-ad02-d2a2122467f4` |
| MW04-C | `@loc_MYS_mys-mw04-c-police-defence_s0_v1` | `8e7c58c1-509c-4080-ba8a-a7bc7d5e0009` |
| MW05-B | `@loc_MYS_mys-mw05-b-court-file_s0_v1` | `bb196dee-004a-470f-9423-b5a5001eefec` |
| MW05-C | `@loc_MYS_mys-mw05-c-court-file_s0_v1` | `4172ffc4-184a-4954-80f4-03ea03ad6418` |
| MW06-A | `@loc_MYS_mys-mw06-a-human-countermemories_s0_v1` | `f5155207-51da-4fee-8481-81c5bdd8d37a` |
| MW06-B | `@loc_MYS_mys-mw06-b-human-countermemories_s0_v1` | `5200d6f6-b432-40eb-9ccf-f487d2154a80` |
| MW06-C | `@loc_MYS_mys-mw06-c-human-countermemories_s0_v1` | `7ab046b1-9bac-4272-87e3-feb6ee85901d` |

## Latest twelve verified bindings

| Key | Live Element | UUID | Attached generation |
|---|---|---|---|
| MW03_B_01 | `@loc_MYS_mys-mw03-b-01-memory-view-05_s0_v1` | `bba82dbb-98b2-4295-a1f3-659b11c77001` | `b043534f-c886-49d9-bf8e-f6b75f52b835` |
| MW03_B_02 | `@loc_MYS_mys-mw03-b-02-memory-view-06_s0_v1` | `027e9ae2-ffff-4219-9143-d9bf58666126` | `1702fd93-5445-4ff3-8e08-df30dfb46cf2` |
| MW03_B_03 | `@loc_MYS_mys-mw03-b-03-memory-view-07_s0_v1` | `17538b46-71b7-4d95-8623-becd35ec5275` | `26996b17-a0f6-442e-8080-a62d011d0a0e` |
| MW03_B_04 | `@loc_MYS_mys-mw03-b-04-memory-view-08_s0_v1` | `fbaf7644-ee1f-45ab-a6d8-34776f135248` | `960bd199-5019-4d01-a9bf-7b109ed589db` |
| MW03_C_01 | `@loc_MYS_mys-mw03-c-01-memory-view-09_s0_v1` | `afd0a2b6-65d9-4c98-b746-512c710f381b` | `764b0ba2-1ed5-41df-8f77-cd4385ab8f8b` |
| MW03_C_02 | `@loc_MYS_mys-mw03-c-02-memory-view-01_s0_v1` | `c3b6377f-2f65-4d19-9588-f820426b7ff2` | `28275f56-2f4c-49e7-88e0-56c91963df48` |
| MW03_C_03 | `@loc_MYS_mys-mw03-c-03-memory-view-07_s0_v1` | `0da3fbe0-51f4-4cdf-8a06-8496134397f9` | `c3a940c3-30b2-4c56-a67c-6257f2e70b10` |
| MW03_C_04 | `@loc_MYS_mys-mw03-c-04-memory-view-08_s0_v1` | `6d72803a-1fea-4a0f-a265-9eb9322fd672` | `85a05e6e-8a87-45f0-ada1-756f2a92b8c7` |
| MW05_C_01 | `@loc_MYS_mys-mw05-c-01-memory-view-09_s0_v1` | `baf59585-be6a-4721-9d2e-cbef75076349` | `34e8787d-1b2c-4029-a75e-185c0ec7cc46` |
| MW05_C_02 | `@loc_MYS_mys-mw05-c-02-memory-view-01_s0_v1` | `32acf9ce-32c1-4330-b5f3-7fc956f09f2f` | `e155a942-09c3-43d1-b3ee-66a34665be97` |
| MW05_C_03 | `@loc_MYS_mys-mw05-c-03-memory-view-07_s0_v1` | `5978a913-a5f8-45c0-8ca1-1709c0ad418b` | `6dc7c5fb-09e7-478c-bc2a-8848ad74a2aa` |
| MW05_C_04 | `@loc_MYS_mys-mw05-c-04-memory-view-08_s0_v1` | `fbea8081-00be-4e21-8c3a-4ea3cb7f45e4` | `d8f297bc-21c5-48ff-9f42-df35e07d2933` |
