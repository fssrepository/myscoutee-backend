# Service composition

Shared build, deployment and host-lifecycle commands are owned by the
[microservices package](../../../../myscoutee-microservices/README.md). Run its
commands from this application repository root, with this project selected.

Project inputs have one owner:

- [Assembly selection](../../../config/microservices/assemblies.json): domain ownership, dependencies and memory budgets.
- [Transport bindings](../../../config/microservices/transport/bindings.json): implemented cross-service contracts.
- [Runtime configuration](../../../config/microservices/deploy/runtime.json): lab identity, databases, routes and monitoring.
- [Chart inputs](../../../config/microservices/chart): project-specific deployment values.

| Assembly | Domains |
| --- | --- |
| identity | accounts, access, administration, platform, integrations |
| community | groups, community, events, campaigns, content, feedback |
| communication | chat, notifications, email, localization |
| assets | assets, media |
| payments | payments |
| affinity | affinity |
| help | help |
| network | operator, registry |

Canonical implementations remain in `server/projects/profile`; the shared
package selects and compiles them without copying product source. Each domain
has one implementation owner. The lab retains the existing REAL/DEMO databases
in one Mongo replica set.

The [published technical manual](../../publication/manuals/MyScoutee_Microservices_Guide_EN.pdf)
describes the architecture. [QA](../../../tests/qa/README.md) owns the accepted cases.
Intermediate implementation journals and targeted performance runs stay in Git.
