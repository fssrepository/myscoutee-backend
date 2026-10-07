# SERVICE-FEEDBACK-UI-001 — event-style service feedback

Stable follow-up for the MSC-116 user corrections. Execution status belongs in the
QA matrix. Use the approved completed-case feedback fixture when this run starts.

1. Open a pending service feedback from its existing card. The Start feedback badge
   has the shared media-badge height. Check neighboring badges/actions align.
2. The form uses the existing event FormFlow layout: service image (not provider
   portrait), service title, provider and related case. Missing/hidden/deleted
   service image uses the existing image-card placeholder. No private image leaks.
3. Each of the four criteria has its own labeled switch/radio blocks. Choose one
   block per criterion. There are no numeric inputs, sliders or free-text field.
   Selections in one criterion must not overwrite another criterion.
4. Save with all criteria selected: stored choices are the documented fixed
   2/4/6/8/10 scores; the normal average reflects those values. Missing criteria
   cannot submit; direct invalid values above 10 still fail the existing API rule.
5. Reopen submitted feedback read-only. Current choices and historical values are
   faithfully displayed. There is no invented conversion or migration of old scores.
6. Compare HTTP and local mode through save, reload and pagination. Image metadata
   is returned with the feedback page; there is no extra per-card fetch or seed load.
7. In EN/HU, desktop/mobile, run every community.service-feedback guide anchor:
   four criteria, FormFlow save and close. Confirm service-specific labels, no
   overflow, and the same navigation/summary interaction as event feedback.
8. Check an event feedback and an ordinary rating control for unintended UI changes.
   API/MCP cannot submit service feedback on the user's behalf.

PASS requires the real popup, persisted results, local/HTTP parity and guide steps.
Source changes or the old general-guide PASS do not prove this extension.
