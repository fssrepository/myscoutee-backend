# MSC115-TEMPLATE-REGRESSION

Verify the retained template counterparts affected by fixes made during MSC-115.
Collect affected changes in the [regression record](../../evidence/general/MSC115-TEMPLATE-REGRESSION.json).
This is a separate QA checkpoint; it does not reopen the completed MSC-122 baseline.

## Preparation

1. Review each collected fix and its canonical owner. Include changes verified
   only by code review or a source-side spot check. Record a concrete N/A reason
   where the template omits the product feature.
2. Carry applicable code, configuration, seeds and shared component revisions
   into the template. Record source and template revisions separately.
3. At a prescribed campaign checkpoint, or once together at campaign end,
   prepare the existing template QA environment and retained fixtures. Follow
   its resource rules; never overlap running stacks or build owners.

## Checks

4. For each retained calendar consumer affected by the shared changes, compare
   configured colours across day, week and month views. Preserve list-card
   colours. Check item activation and supported cell activation; an inactive
   cell must not display a clickable cursor.
5. Check the collected calendar density cases: ordinary badges at low density,
   the configured count representation above the threshold and its existing
   navigation. Verify long labels, two-line ellipsis and cell containment.
6. Check ordinary empty lists and task columns retain their intended placement.
   On a retained consumer using the shared error card, verify its centered
   read-error state and successful retry. Do not add a product-only screen to
   the template merely to test the shared component.
7. Execute any additional affected checks recorded in the regression record,
   using the existing counterpart and applicable HTTP/local modes. Reuse
   matching evidence from a prescribed checkpoint instead of replaying it.
8. Record each result, environment and evidence, including untested boundaries.
   Restore the prepared state. Close this QA only after every applicable item
   has a result; source-side success alone does not close template QA.

The matrix contains only purpose, status and the next step. Execution details
belong in the regression record and the template's existing qualification ledger.
