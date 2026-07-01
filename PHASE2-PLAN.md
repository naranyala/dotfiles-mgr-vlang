# Phase 2 Development Plan

## Overview
Phase 2 adds deep system integration via C FFI libraries and advanced frontend features. These require backend V code changes (new `.v` files with C bindings) and new frontend npm packages.

---

## Module 1: Service Manager (systemd integration)

### Backend: `src/plugins/services/services.v`
**C FFI: `libsystemd`** (or exec-based fallback)

New RPCs:
- `svcList` — List all systemd services with status (active/inactive/failed)
- `svcStart(name)` — Start a service
- `svcStop(name)` — Stop a service
- `svcEnable(name)` — Enable at boot
- `svcDisable(name)` — Disable at boot
- `svcRestart(name)` — Restart a service
- `svcStatus(name)` — Detailed status of a service
- `svcLogs(name, lines)` — Recent journal logs for a service

**Implementation approach:**
- Primary: Use `os.execute("systemctl ...")` for each operation (simpler, works everywhere)
- Parse output with V string processing
- Future: Direct D-Bus calls via libsystemd for better performance

### Frontend: `frontend/src/plugins/services/index.js`
**npm: `@shoelace-style/shoelace`** (web components for switches, badges, dialogs)

UI cards:
- Service list with status badges (active=green, inactive=gray, failed=red)
- Toggle switches for enable/disable
- Start/stop/restart buttons
- Log viewer for each service
- Search/filter input

---

## Module 2: Backup & Restore (archive support)

### Backend: `src/plugins/backup/backup.v`
**C FFI: `libarchive`** (or exec-based fallback with tar/zip)

New RPCs:
- `backupCreate(path, dest)` — Create a backup archive
- `backupExtract(archive, dest)` — Extract an archive
- `backupList(archive)` — List contents of an archive
- `backupDiff(archive1, archive2)` — Compare two archives

**Implementation approach:**
- Primary: Use `os.execute("tar ...")` or `os.execute("zip ...")`
- Parse output for file listings
- Future: libarchive FFI for native archive support

### Frontend: `frontend/src/plugins/backup/index.js`
**npm: `diff2html`** (side-by-side diff view)

UI cards:
- Backup creator (select path, choose format, create)
- Archive viewer (list contents)
- Restore wizard (select archive, choose destination)
- Diff viewer (compare before/after)

---

## Module 3: Markdown & Documentation Viewer

### Backend: `src/plugins/docs/docs.v`
No new RPCs needed — uses existing `readFile` RPC.

### Frontend: `frontend/src/plugins/docs/index.js`
**npm: `marked`** (markdown parser) + **`highlight.js`** (already used)

UI cards:
- README viewer for workspace repos
- Markdown file browser
- Rendered preview with syntax highlighting
- Link navigation

---

## Module 4: Enhanced Config Diff Tool

### Backend: No new RPCs — uses existing `readFile` RPC.

### Frontend: `frontend/src/plugins/diff/index.js`
**npm: `diff2html`** (unified/side-by-side diff)

UI cards:
- File diff viewer (select two files, see differences)
- Config backup diff (compare current vs backup)
- Git diff viewer (show changes in workspace repos)

---

## Implementation Order

1. **Service Manager** — Highest impact for sysadmin use case
2. **Markdown Viewer** — Quick win, no backend changes needed
3. **Config Diff Tool** — Uses existing RPCs, adds diff visualization
4. **Backup & Restore** — Most complex, needs new backend RPCs

---

## Dependencies to Install (Phase 2)

```bash
bun add @shoelace-style/shoelace diff2html marked
```

---

## File Structure After Phase 2

```
src/plugins/
├── system/       (existing)
├── files/        (existing)
├── git/          (existing)
├── tools/        (existing)
├── processes/    (existing)
├── probe/        (existing)
├── services/     (NEW — Phase 2)
├── backup/       (NEW — Phase 2)
├── docs/         (NEW — Phase 2)
└── diff/         (NEW — Phase 2)

frontend/src/plugins/
├── theme/        (existing)
├── files/        (existing)
├── filetools/    (existing)
├── git/          (existing)
├── system/       (existing)
├── tools/        (existing)
├── processes/    (existing)
├── probe/        (existing)
├── network/      (existing)
├── commands/     (existing)
├── health/       (existing)
├── services/     (NEW — Phase 2)
├── backup/       (NEW — Phase 2)
├── docs/         (NEW — Phase 2)
└── diff/         (NEW — Phase 2)
```
