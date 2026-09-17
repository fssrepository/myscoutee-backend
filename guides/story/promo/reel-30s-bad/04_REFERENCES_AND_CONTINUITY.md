# H3 reference allocation and closing frame

| Input order | Image | Meaning |
| --- | --- | --- |
| 1–6 | I01–I06 | Six identities, clothing and individual activity wishes |
| 7 | I07_PARK_WORLD | Empty shared park |
| 8, Part B only | I08_MEETING_COMPOSITION | Group seating and desired closing composition |

**Part A: six generic references (I01–I06). Part B: eight (I01–I08).**
Higgsfield documents a maximum of nine images for H3. The current plan leaves
START and END empty. The image order must match the pasted prompt.

## Composition reference versus END

An eighth image used as a generic reference guides the scene; it does not pin
the last frame. The supplied group image can guide the final shot without a
guarantee of pixel-exact arrival.

Higgsfield's H3 guide says references and Start/End can combine. MiniMax's API
explicitly makes these modes mutually exclusive. Their deployed combination and
slot counting have not been tested in the user's composer, so this production
does not depend on it. Do not infer “nine references plus two free frames.”

The motion-concealed cut to the later park meeting needs no continuity frame.
Match A’s outgoing rightward blur with B’s incoming blur in the edit.
For an actual continuous scene, the accepted previous clip's last decoded frame
would become the next clip's START, not its END. A still does not carry camera
velocity or audio. The historical London workflow observed an exported endpoint
two frames early, so inspect the actual decoded final frame if ever using it.

## Optional Element import

[Import text](images/ELEMENT_IMPORT_OPTIONAL.txt) contains six characters and one
park. Bind the corresponding accepted I01–I07 images after import. I08 is a scene
composition, not another character.

The current Higgsfield MCP Element contract supports automatic reference
injection for Nano Banana Pro, but not H3. For H3 use the actual images as generic
references; a named library Element alone does not bind its image. Web Element
handling may differ and has not been verified. Importing does not increase the
image limit. Count actual attached images, not just Element names.

No actual attachment or mixed-mode test has been performed. The supplied menu
screenshots establish H3 availability, not eight-image acceptance or eligibility.

Sources: [Higgsfield nine-image limit](https://higgsfield.ai/minimax/h3),
[Higgsfield mixed-mode claim](https://higgsfield.ai/blog/minimax-h3-higgsfield),
[MiniMax exclusive modes](https://platform.minimax.io/docs/api-reference/video-generation-v2-create);
available Higgsfield MCP Element tool contract, checked 15 September 2026.
