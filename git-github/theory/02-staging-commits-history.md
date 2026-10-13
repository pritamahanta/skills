# Staging, Commits, and Git History

## 1. Git File States

Files in a Git repository can have different states:

| State | Meaning |
|---|---|
| **Untracked** | Git has not started tracking the file |
| **Modified** | A tracked file has changes that are not staged |
| **Staged** | Changes are selected for the next commit |
| **Committed** | Changes have been recorded in repository history |

A file can be tracked and still have unstaged modifications.

```text
Working directory
      │ git add
      ▼
Staged changes
      │ git commit
      ▼
Committed history
```

When uncertain about the current state, start with:

```bash
git status
```

---

## 2. The Staging Area

The staging area, also called the **index**, lets you choose which changes belong in the next commit.

### Stage a specific file

```bash
git add app.js
```

### Stage multiple files

```bash
git add app.js README.md
```

### Stage changes in the current directory

```bash
git add .
```

### Stage all applicable changes

```bash
git add -A
```

`git add -A` stages tracked modifications and deletions along with applicable new files.

### Stage only part of a file

```bash
git add -p
```

Interactive staging lets you select individual chunks of changes. This is useful when one file contains changes that belong in separate logical commits.

After staging, inspect the result:

```bash
git status
```

---

## 3. Create Good Commits

A commit records the changes currently in the staging area:

```bash
git commit -m "Add login validation"
```

A good commit represents one logical change and uses a message that describes what changed:

```text
Add login validation
Fix null response handling
Update API documentation
```

Avoid vague messages such as:

```text
changes
update
final
```

### Why commits matter

Commits create identifiable checkpoints. They allow you to:

- review changes
- compare versions
- investigate bugs
- restore or understand earlier states
- collaborate safely

Only staged changes are included in the commit.

---

## 4. Inspect Changes Before Committing

### View unstaged changes

```bash
git diff
```

### View staged changes

```bash
git diff --staged
```

### Compare two commits

```bash
git diff <commit1> <commit2>
```

### Compare one file between commits

```bash
git diff <commit1> <commit2> -- app.js
```

A reliable pre-commit workflow is:

```bash
git status
git diff --staged
git commit -m "Fix login validation"
```

This confirms both the repository state and the exact changes about to be recorded.

---

## 5. Explore Commit History

### View full history

```bash
git log
```

### View compact history

```bash
git log --oneline
```

### View a commit graph

```bash
git log --oneline --graph --all
```

### Inspect a specific commit

```bash
git show <commit-hash>
```

These commands help answer:

- What changed?
- Which commit introduced a change?
- What commits exist on different branches?
- How did the current branch reach its present state?

---

## 6. Amend the Latest Commit

If a file was forgotten or the latest commit needs another small change:

```bash
git add forgotten-file.js
git commit --amend
```

This replaces the latest commit instead of creating a new one. Because the commit is replaced, its hash changes.

Keep the existing commit message with:

```bash
git commit --amend --no-edit
```

> Amending rewrites commit history. Avoid amending a commit that others already rely on unless the team has agreed to the history change.

---

## 7. Remove Files From Git

### Remove a tracked file and stage its deletion

```bash
git rm file.txt
```

This removes the file from the working directory and stages the deletion.

### Stop tracking a file but keep it locally

```bash
git rm --cached file.txt
```

Use this when the file should remain on your computer but should no longer be tracked by Git. You may also need to add it to `.gitignore` to prevent it from being staged again.

---

## 8. A Complete Review-and-Commit Workflow

```bash
# Inspect the repository
git status

# Review unstaged changes
git diff

# Stage selected changes
git add app.js

# Review what will be committed
git diff --staged

# Create a logical commit
git commit -m "Fix login validation"

# Confirm the result
git status
git log --oneline
```

The important sequence is:

```text
Inspect
  ↓
Select with git add
  ↓
Review the staged diff
  ↓
Commit
  ↓
Inspect history
```

---

## 9. Quick Command Reference

| Command | Purpose |
|---|---|
| `git status` | Inspect current file states |
| `git add <file>` | Stage a file's changes |
| `git add .` | Stage applicable changes in the current directory |
| `git add -A` | Stage applicable changes across the repository |
| `git add -p` | Stage selected chunks interactively |
| `git commit -m "message"` | Record staged changes |
| `git diff` | View unstaged changes |
| `git diff --staged` | View staged changes |
| `git log` | View full commit history |
| `git log --oneline` | View compact history |
| `git log --oneline --graph --all` | View branch and commit relationships |
| `git show <commit>` | Inspect a commit and its changes |
| `git commit --amend` | Replace the latest commit |
| `git rm <file>` | Remove and stage deletion of a tracked file |
| `git rm --cached <file>` | Stop tracking a file while keeping it locally |

---

## 10. Interview Questions

### What is the staging area?

The staging area, or index, holds the changes selected for the next commit.

### Why not commit every modified file automatically?

Staging lets you group related changes into focused, logical commits instead of recording unrelated work together.

### What is the difference between `git diff` and `git diff --staged`?

`git diff` shows unstaged changes in the working directory. `git diff --staged` shows changes already selected for the next commit.

### What does `git commit --amend` do?

It replaces the latest commit with a new version containing the current staged changes. The commit hash changes.

### What does `git rm --cached` do?

It removes a file from Git's index while keeping the file in the working directory.

### Why use `git add -p`?

It lets you stage only selected portions of a file, which helps create focused commits.

---

## 11. Final Mental Model

```text
Untracked or modified files
          ↓ git add
Staging area
          ↓ git diff --staged
Review selected changes
          ↓ git commit
Repository history
          ↓ git log / git show
Inspect recorded work
```

> **Core rule:** Inspect your changes, stage only the work that belongs together, review the staged diff, and commit one logical change at a time.
