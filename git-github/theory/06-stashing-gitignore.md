# Git Stashing and `.gitignore`

## 1. What Is Git Stashing?

`git stash` temporarily saves uncommitted changes so you can switch tasks or branches without creating a temporary commit.

### Typical scenario

You are working on a feature when an urgent bug fix arrives. You can stash the unfinished feature, switch branches, fix the bug, and later restore the feature work.

```bash
git stash push -m "WIP: login feature"
```

This saves applicable changes and leaves the working directory cleaner.

By default, untracked files are not included. Include them with:

```bash
git stash push -u -m "WIP: login feature"
```

The `-u` option includes untracked files.

---

## 2. List and Inspect Stashes

List saved stashes:

```bash
git stash list
```

Example:

```text
stash@{0}: On feature/login: WIP: login feature
stash@{1}: On main: WIP: documentation
```

Inspect the latest stash as a patch:

```bash
git stash show -p stash@{0}
```

The `-p` option displays the changes stored in the stash.

---

## 3. Apply or Pop a Stash

Apply the latest stash and keep it in the stash list:

```bash
git stash apply
```

Apply a specific stash:

```bash
git stash apply stash@{1}
```

Apply the latest stash and normally remove it after successful application:

```bash
git stash pop
```

| Command | Applies changes | Removes the stash entry |
|---|---|---|
| `git stash apply` | Yes | No |
| `git stash pop` | Yes | Normally, if application succeeds |

Applying a stash to a different code state can produce conflicts. Resolve them like other Git conflicts, then inspect the result with `git status` and `git diff`.

---

## 4. Delete Stashes

Delete one stash entry:

```bash
git stash drop stash@{0}
```

Delete every stash entry:

```bash
git stash clear
```

These commands remove stash references. Verify that the saved work is no longer needed before deleting it.

```text
stash list
    ↓
inspect or apply
    ↓
keep, drop one, or clear all
```

---

## 5. What Is `.gitignore`?

A `.gitignore` file contains patterns for files and directories that Git should ignore when they are untracked.

Common examples include:

- local environment files
- dependency directories
- build output
- log files
- temporary files
- personal editor settings

Example:

```gitignore
# Environment variables
.env
.env.*

# Dependencies
node_modules/

# Build output
dist/
build/

# Logs
*.log
```

Use patterns appropriate for the project. Broad patterns can accidentally exclude important source files.

---

## 6. Common `.gitignore` Patterns

### Ignore a directory

```gitignore
node_modules/
```

This ignores matching directories named `node_modules`.

### Ignore a file extension

```gitignore
*.log
```

This matches files with the `.log` extension according to Git's ignore-pattern rules.

### Re-include a path

A pattern beginning with `!` can re-include a path excluded by an earlier pattern, subject to Git's directory and pattern rules.

```gitignore
*.log
!important.log
```

Here, `.log` files are ignored except for `important.log`.

---

## 7. Ignoring an Already-Tracked File

Adding a file to `.gitignore` does not stop Git from tracking it if it is already tracked.

Stop tracking the file while keeping the local copy:

```bash
git rm --cached .env
git commit -m "Stop tracking local environment file"
```

After this, the `.gitignore` rule prevents the local file from being added again.

### Security warning

`.gitignore` is not a way to erase a secret that was already committed. Earlier commits still contain the secret. If a secret was exposed:

1. revoke or rotate the secret immediately
2. remove it from the current project state
3. handle repository-history cleanup when appropriate

---

## 8. Repository and Global Ignore Rules

Use a repository-level `.gitignore` for rules that apply to everyone working on the project.

For personal patterns, such as editor files that should be ignored across many repositories, configure a global excludes file:

```bash
git config --global core.excludesfile ~/.config/git/ignore
```

Create the file and add personal ignore patterns there.

```text
Project-specific rules → repository .gitignore
Personal machine rules → global excludes file
```

Global ignore rules are not normally shared with other contributors, so they should not replace project-level rules.

---

## 9. Stash vs. `.gitignore`

These features solve different problems:

| Feature | Purpose |
|---|---|
| `git stash` | Temporarily save current uncommitted work |
| `.gitignore` | Prevent matching untracked files from being added accidentally |

```text
Unfinished tracked edits → stash
Files that should remain untracked → .gitignore
```

A stash is temporary saved work. An ignore rule is a repository or personal configuration rule.

---

## 10. Practical Workflows

### Temporarily switch tasks

```bash
# Save unfinished work
git stash push -u -m "WIP: login feature"

# Switch and work on another branch
git switch bugfix

# Return to the original branch
git switch feature/login

# Restore the saved work
git stash pop
```

### Review before restoring

```bash
git stash list
git stash show -p stash@{0}
git stash apply stash@{0}
git status
git diff
```

Using `apply` first is useful when you want to keep the stash entry until the restored work has been checked.

---

## 11. Interview Questions

### What does `git stash` do?

It temporarily saves uncommitted changes and returns the working directory to a cleaner state.

### Does `git stash` include untracked files by default?

No. Use `git stash -u` or `git stash push -u` to include untracked files.

### What is the difference between `git stash apply` and `git stash pop`?

Both apply a stash. `apply` keeps the stash entry, while `pop` normally removes it after successful application.

### What does `.gitignore` do?

It defines patterns for untracked files and directories that Git should ignore.

### Does `.gitignore` untrack an existing file?

No. Use `git rm --cached <file>` to remove it from the index while keeping it locally.

### Does `.gitignore` remove committed secrets?

No. A secret already present in history must be revoked or rotated, and history may need separate cleanup.

### What is the difference between `.gitignore` and a global excludes file?

`.gitignore` contains project rules that can be shared. A global excludes file contains personal rules for the local machine.

---

## 12. Final Mental Model

```text
Uncommitted work
      ↓
git stash
      ↓
Temporary stash entry
      ↓
git stash apply / pop
      ↓
Work restored
```

```text
Untracked local file
      ↓
.gitignore pattern
      ↓
Git ignores matching file
```

### Key takeaways

```text
1. git stash temporarily saves unfinished work.
2. Use -u when untracked files should be included.
3. apply restores a stash and keeps its entry.
4. pop restores a stash and normally removes it after success.
5. .gitignore prevents matching untracked files from being added.
6. Adding a tracked file to .gitignore does not untrack it.
7. git rm --cached stops tracking a file while keeping the local copy.
8. Never treat .gitignore as a way to erase a committed secret.
9. Use repository .gitignore for shared project rules and global excludes for personal rules.
```

> **Core rule:** Use `git stash` to temporarily preserve unfinished work, and use `.gitignore` to prevent selected untracked files from entering version control.
