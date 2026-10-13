# Git Branches, `HEAD`, Undo, and Recovery

## 1. What Is a Branch?

A branch is a lightweight, movable reference to a commit. Branches let you develop features or fixes independently from the main line.

```text
        A---B---C  main
             \
              D---E  feature/login
```

`feature/login` has its own commits while sharing the earlier history through commit `B`.

---

## 2. Create and Switch Branches

List local branches:

```bash
git branch
```

Create a branch without switching to it:

```bash
git branch feature/login
```

Switch to an existing branch:

```bash
git switch feature/login
```

Create and switch in one command:

```bash
git switch -c feature/login
```

The older `git checkout` command can also switch branches:

```bash
git checkout feature/login
```

For everyday branch switching, `git switch` makes the intention clearer.

---

## 3. Understanding `HEAD`

`HEAD` represents your current checkout position. Normally, it points to the current branch, and that branch points to a commit.

```text
HEAD → current branch → current commit
```

Switching branches moves `HEAD` to the selected branch:

```bash
git switch main
```

You are now working from the current commit of `main`.

### Detached `HEAD`

A detached `HEAD` occurs when you check out a commit directly instead of a branch:

```bash
git switch --detach <commit-hash>
```

This is useful for inspecting or testing an earlier version. New commits made in this state are not attached to a named branch and can become difficult to find later.

If you want to preserve work made from a detached `HEAD`, create a branch:

```bash
git switch -c recovery-work
```

Conceptually:

```text
Named branch
  → commits remain reachable through the branch name

Detached HEAD
  → HEAD points directly to a commit
  → new work needs a branch to remain easy to find
```

---

## 4. Undo Uncommitted Changes With `restore`

Discard unstaged changes to a tracked file:

```bash
git restore app.js
```

> This can permanently discard the file's unstaged edits. Inspect the changes first.

Unstage a file while keeping its working-directory changes:

```bash
git restore --staged app.js
```

This removes the file from the index but leaves the edits in the working directory.

```text
git restore file
→ restore file contents

git restore --staged file
→ remove changes from staging
→ keep changes in working directory
```

---

## 5. Understanding `git reset`

`git reset` moves the current branch reference to another commit. Its effect on the staging area and working directory depends on the selected mode.

Suppose the latest commit is incorrect:

```bash
git reset --soft HEAD~1
```

This moves the branch back one commit while preserving the changes in the staging area.

```bash
git reset --mixed HEAD~1
```

This moves the branch back and leaves the changes in the working directory as unstaged changes. `--mixed` is the default mode.

```bash
git reset --hard HEAD~1
```

This moves the branch back and resets both the staging area and working directory to match that commit. It can discard tracked uncommitted changes.

### Reset modes

| Mode | Branch / `HEAD` | Staging area | Working directory |
|---|---|---|---|
| `--soft` | Moved | Preserved | Preserved |
| `--mixed` | Moved | Reset | Preserved |
| `--hard` | Moved | Reset | Reset |

```text
--soft  → move history, keep everything staged
--mixed → move history, unstage changes, keep files
--hard  → move history and reset files
```

Use `--hard` carefully because it can discard uncommitted tracked changes.

---

## 6. `restore` vs. `reset` vs. `revert`

| Command | Primary purpose | Effect on history |
|---|---|---|
| `git restore` | Restore file contents or unstage changes | Does not move branch history |
| `git reset` | Move the current branch and optionally reset files/index | Rewrites the current branch position |
| `git revert` | Create a commit that reverses an earlier commit | Preserves existing history |

### Revert a published commit

```bash
git revert <commit-hash>
```

`git revert` is generally safer for already-published commits because it adds a new reversal commit instead of removing or rewriting existing history.

```text
Uncommitted file changes → restore
Move local branch history → reset
Undo a published commit  → revert
```

---

## 7. Recover Work With `git reflog`

The reflog records recent movements of local references, including changes caused by commands such as:

- `reset`
- branch switching
- rebasing
- other operations that move `HEAD`

View it with:

```bash
git reflog
```

If a reset moved your branch away from a commit you still need:

1. Find the commit in the reflog.
2. Create a recovery branch at that commit.

```bash
git branch recovery <commit-hash>
```

You can then inspect the recovered work without moving your current branch.

```text
reflog entry
     ↓
find previous commit
     ↓
create recovery branch
     ↓
inspect or restore the work
```

The reflog is local and entries expire eventually. It is a recovery tool, not a permanent backup.

---

## 8. A Safe Undo and Recovery Workflow

Before changing history or discarding files:

```bash
# Inspect the current state
git status

# Inspect unstaged changes
git diff

# Inspect recent history
git log --oneline --decorate -n 5
```

Choose the action based on the situation:

```text
Unstage but keep edits
→ git restore --staged <file>

Discard unstaged file edits
→ git restore <file>

Move a local branch back
→ git reset --soft/--mixed/--hard <commit>

Undo a published commit
→ git revert <commit>

Find a previous local branch position
→ git reflog
```

Create a recovery branch before experimenting with a commit you may need:

```bash
git branch recovery-work <commit-hash>
```

---

## 9. Interview Questions

### What is a Git branch?

A lightweight, movable reference to a commit that provides an independent line of development.

### What does `HEAD` represent?

It represents the current checkout position, normally through the currently selected branch.

### What is a detached `HEAD`?

A state in which `HEAD` points directly to a commit instead of a branch.

### What is the difference between `git restore` and `git reset`?

`git restore` primarily changes file or staging state. `git reset` moves the current branch to another commit and may also reset the index or working directory.

### What is the difference between `git reset` and `git revert`?

`git reset` moves the branch and can rewrite local history. `git revert` creates a new commit that reverses an earlier commit, preserving existing history.

### What is `git reflog` used for?

It records recent local reference movements and can help locate commits that are no longer visible in normal branch history.

### Why is `git reset --hard` dangerous?

It resets the staging area and working directory to the target commit and can discard uncommitted tracked changes.

---

## 10. Final Mental Model

```text
Branch
  → movable name pointing to a commit

HEAD
  → current checkout position

restore
  → repair file/staging state

reset
  → move local branch history

revert
  → add a commit that reverses an earlier commit

reflog
  → locate recent local positions for recovery
```

### Key takeaways

```text
1. Branches support independent development.
2. HEAD identifies the current checkout position.
3. A detached HEAD is useful for inspection, but new work should be saved on a branch.
4. restore works mainly with file and staging state.
5. reset moves branch history and has soft, mixed, and hard modes.
6. revert reverses a commit by creating a new commit.
7. reflog can help recover commits no longer visible in normal branch history.
8. reset --hard can destroy uncommitted tracked changes, so use it carefully.
```

> **Core rule:** Use `restore` for file state, `reset` for moving local history, `revert` for safely undoing published commits, and `reflog` to recover previous local reference positions.
