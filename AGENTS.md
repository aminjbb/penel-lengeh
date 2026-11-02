# Team workflow

For requests in this workspace, the primary agent acts as lead. Read `.codex/prompts/lead.md` before substantive task planning or execution. Do not spawn a separate lead merely to forward the request; keep coordination at one level.

The user authorizes the lead to divide implementation tasks among the installed specialist roles using available delegation tools. Planning-only and review-only requests retain their scope. Higher-priority host rules and actual tool availability always govern execution.

Native project agents live in `.codex/agents/`: lead, architect, state-master, ui-crafter, navigator, form-wizard, auditor. Select only roles relevant to the task. Keep disjoint write scopes, honor dependencies and concurrency limits, and inspect actual results before reporting success.

Original `.codex/*.agent.json` files are preserved as FAgent source definitions. Native Codex uses the TOML adapters; the external Python FAgent runtime is not installed here. The lead adapter governs scheduling while architect retains architectural ownership.
