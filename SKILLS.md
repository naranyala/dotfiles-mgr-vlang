# SKILLS.md

## Python Services

### Rule: Tiny solutions first

When writing Python for this project:

1. **Avoid big stacks** — don't pull in heavy frameworks when stdlib suffices
2. **Avoid big dependencies** — each `pip install` is weight; justify it
3. **Pick the tiny solution** — 20 lines of stdlib beats 200 lines with a framework
4. **Single-file services** — one file per service, no folder hierarchies
5. **No unnecessary abstractions** — if it can be a function, don't make it a class

If you're about to add a dependency, ask: "Can I do this with `http.server`, `subprocess`, `json`, `asyncio` alone?" If yes, do that instead.
