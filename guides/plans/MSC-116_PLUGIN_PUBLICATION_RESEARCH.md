# MSC-116 — plugin publication and embedded UI research

Checked 2026-10-06. Research only; no submission, publication, new hosted site or
subscription purchase. Plan availability must be checked again before launch.

**Continuation, 2026-10-07:** publication preparation is now implemented under
MSC-119 in the MCP repository. Start with `plugins/PUBLICATION_HANDOFF.md` there
for current artifacts, verification and remaining steps. The user excluded
embedded interfaces from this work; the section below is historical research,
not an implementation task. Full QA remains deferred until master consolidation.

## ChatGPT directory

OpenAI's submission flow requires an organization owner or Apps Management Write
permission and verified individual/business publisher identity. Include the MCP
server in the initial plugin ZIP; a skills-only submission cannot later add one.
Approval and publishing are separate steps. This page does not establish that a
free ChatGPT account alone is sufficient for the publishing workflow.
[Official submission guide](https://developers.openai.com/plugins/deploy/submission).

## Embedded UI and the existing website

MCP Apps links a tool to an HTML resource through `_meta.ui.resourceUri`. ChatGPT
renders that resource in an iframe. Nested frames are blocked by default; an
existing interface on the MCP server's registrable domain can be declared with
`frameDomains`, subject to justification and review. Production component
resources are recommended.
[Official UI guide](https://developers.openai.com/plugins/build/chatgpt-ui).

Inference for MyScoutee: the existing server can serve a small review component;
a separate Sites project is not inherently required. The marketing homepage does
not automatically become an embedded application merely by configuring its URL.
A personal-decision UI would need to show the actual record, images and conditions
and receive the user's own choice. Current MCP tools do not implement that UI.
Keep user decisions in the application until that full flow exists and is tested.

## Claude

The directory submission portal is available to developers on paid Claude plans.
It accepts either a remote MCP connector or a GitHub plugin bundle containing MCP
servers and skills. The portal validates submissions; approval precedes the
publisher's choice to publish.
[Official announcement](https://claude.com/blog/build-plugins-for-claude).

Using a custom remote connector is a different question: Claude currently supports
Free through Enterprise, with Free limited to one custom connector.
[Official connector help](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

## MCP Events

ChatGPT documents MCP Events for Work chats on web, desktop with Cloud selected,
and dots, subject to workspace controls. It requires MCP 2.0 protocol 2026-07-28,
persistent subscriptions and outbound HTTPS. Event discovery, subscription and
unsubscribe methods are paired with signed webhook delivery and callback
verification. Polling, streaming and gap/terminated control notifications are not
supported by that integration.
[Official Events guide](https://developers.openai.com/plugins/build/mcp-events).

The supplied [shared conversation](https://chatgpt.com/share/6ac4a55f-8ee0-83eb-97af-b90e12dcaf96)
did not expose its conversation body to the available reader; no conclusions are
attributed to its unavailable content.

Repository finding: MyScoutee already has durable domain callbacks through
`/watch`, but that is not the MCP Events protocol. Events needs its own explicit
adapter, subscription/signature verification and revocation tests. The user then
requested implementation: MCP 1.5.0 now supplies that adapter using the existing
backend delivery queue. The three current definitions are event.changed,
event.encounters and asset.changed, with Full access and per-resource filters.
See [Events QA](../qa/checklists/api/MCP-EVENTS-001.md); live ChatGPT interoperability
and execution QA remain NOT RUN. The later private ChatGPT conversation link
also did not expose its body. Implementation follows the official Events and
[OAuth documentation](https://developers.openai.com/plugins/build/auth).

## Higgsfield and hosting lifetime

**Scope update, 2026-10-07:** the user excluded free-hosting and post-subscription
hosting-lifetime investigation from further work. The findings below are retained
as historical research and are not open tasks or publication blockers.

Higgsfield Apps publishes web applications to a Higgsfield subdomain. Building
uses the creator's credits; visitors use their own credits for generations. Apps
can be created and managed through MCP. Custom-domain arrangements beyond naming
the subdomain require contacting Higgsfield.
[Official Apps help](https://higgsfield.ai/creator-hub/help-center/tools/what-are-higgsfield-apps).

Unresolved: the checked public documentation does not establish the availability
of permanent free hosting, what happens to an already published site after plan
cancellation, or equivalent OpenAI Sites retention terms. Do not promise continued
hosting after cancellation or purchase a plan based on an assumption. Obtain the
provider's current written terms before choosing external hosting. Keeping the
component on MyScoutee's own deployment avoids introducing that dependency.
