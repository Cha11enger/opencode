# WYZORD CLI

WYZORD CLI is a terminal-first AI coding agent for WYZORD. It is forked from the MIT-licensed OpenCode project and rebranded as WYZORD CLI / WYZORD CODE for the WYZORD v2 workspace.

## Installation

For local development in this fork:

```powershell
cd D:\WYZORD-DEV-OS\wyzord-v2\wyzord-cli\opencode-fork\packages\opencode
npm link
wyzord
```

Useful commands:

```powershell
wyzord --help
wyzord --version
wyzord models theclawbay
wyzord debug config
```

## Agents

WYZORD CLI includes the inherited build and plan agent modes:

- `build` - default full-access agent for implementation work.
- `plan` - read-only agent for analysis and planning.

The CLI also includes internal subagent support for complex searches and multi-step work.

## Provider

This fork reads the local Codex TheClawBay provider config from `~/.codex/config.toml` when available and defaults to:

```text
theclawbay/gpt-5.5
```

Secrets are read locally at runtime and should not be committed.

## License And Attribution

This fork remains under the MIT License. The original OpenCode copyright and MIT permission notice are preserved in [LICENSE](./LICENSE), as required by the license.

See [NOTICE.md](./NOTICE.md) for upstream attribution and rebrand notes.
