# Git & GitHub Short Notes

## 1. Core Concepts

### Git vs. GitHub

| Git | GitHub |
|---|---|
| Local distributed version control system | Hosting and collaboration platform for Git repositories |
| Tracks commits, branches, merges, and history | Provides remotes, pull requests, reviews, issues, and permissions |
| Works without GitHub | Uses Git to manage repository history |

### Essential terms

| Term | Meaning |
|---|---|
| Repository | Project plus its Git history |
| Working directory | Files currently being edited |
| Staging area / index | Changes selected for the next commit |
| Commit | Recorded snapshot of staged changes |
| Branch | Lightweight, movable reference to a commit |
| `HEAD` | Current checkout position; normally points to the current branch |
| Remote | Reference to another repository, commonly on GitHub |
| `origin` | Conventional name for the main remote |
| Remote-tracking branch | Local record of a remote branch, such as `origin/main` |
| Reflog | Local record of recent reference movements, useful for recovery |

### Local workflow

```text
Working directory
      │ git add
      ▼
Staging area
      │ git commit
      ▼
Repository history
```

### File states

| State | Meaning |
|---|---|
| Untracked | Git does not track the file yet |
| Modified | A tracked file has unstaged changes |
| Staged | Changes are selected for the next commit |
| Committed | Changes are recorded in history |

---

## 2. Setup and Repository Basics

```bash
git --version

git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global --list

mkdir git-practice
cd git-practice
git init
git status
```

- `git init` creates a repository and its hidden `.git` directory.
- `user.name` and `user.email` identify commit authorship; they do not authenticate GitHub.
- Repository-specific configuration can override global configuration.

Create and commit a first file:

```bash
echo "# Git Practice" > README.md
git status
git add README.md
git commit -m "Add project README"
git log
```

---

## 3. Command Cheat Sheet

### Inspect and configure

| Command | Purpose / important detail |
|---|---|
| `git status` | Show untracked, modified, staged, and operation states; use first when uncertain |
| `git log` | Full commit history |
| `git log --oneline` | Compact history |
| `git log --oneline --graph --all` | Branch and commit graph |
| `git show <commit-hash>` | Inspect a commit and its changes |
| `git help <command>` | Open Git documentation |

### Stage and commit

| Command | Purpose / important detail |
|---|---|
| `git add <file>` | Stage a file's changes |
| `git add file1 file2` | Stage selected files |
| `git add .` | Stage applicable changes in the current directory |
| `git add -A` | Stage applicable new files, modifications, and deletions |
| `git add -p` | Interactively stage selected chunks |
| `git commit -m "message"` | Record staged changes as a commit |
| `git commit --amend` | Replace the latest commit; changes its hash |
| `git commit --amend --no-edit` | Amend without changing the message |

Good commits represent one logical change and use descriptive messages. Only staged changes enter a commit.

### Inspect differences

| Command | Purpose |
|---|---|
| `git diff` | View unstaged changes |
| `git diff --staged` | View staged changes that will enter the next commit |
| `git diff <commit1> <commit2>` | Compare two commits |
| `git diff <commit1> <commit2> -- <file>` | Compare one file between commits |

Recommended pre-commit check:

```bash
git status
git diff --staged
git commit -m "Describe one logical change"
```

### Branches

| Command | Purpose |
|---|---|
| `git branch` | List local branches |
| `git branch <branch>` | Create a branch without switching |
| `git switch <branch>` | Switch branches |
| `git switch -c <branch>` | Create and switch to a branch |
| `git checkout <branch>` | Older branch-switching command |
| `git switch --detach <commit>` | Inspect a commit with detached `HEAD` |
| `git switch --track origin/<branch>` | Create a local branch tracking a remote branch |
| `git branch -a` | List local and remote-tracking branches |
| `git branch -vv` | Show upstream and tracking information |
| `git branch -d <branch>` | Safely delete a merged local branch |
| `git branch -D <branch>` | Force-delete a local branch; bypasses safety check |

### Undo and recovery

| Command | Purpose / warning |
|---|---|
| `git restore <file>` | Discard unstaged file changes; destructive to those edits |
| `git restore --staged <file>` | Unstage changes while keeping working-directory edits |
| `git reset --soft <commit>` | Move branch; preserve index and working directory |
| `git reset --mixed <commit>` | Move branch; reset index, preserve working directory; default mode |
| `git reset --hard <commit>` | Move branch and reset index/files; can discard tracked uncommitted changes |
| `git revert <commit>` | Create a new commit reversing an earlier commit; safer for published history |
| `git reflog` | Find recent local branch/`HEAD` positions |
| `git branch recovery <commit>` | Preserve recovered work on a new branch |

### File removal

| Command | Purpose |
|---|---|
| `git rm <file>` | Remove a tracked file and stage the deletion |
| `git rm --cached <file>` | Stop tracking a file while keeping the local copy |

### Remotes and GitHub

| Command | Purpose / important detail |
|---|---|
| `git remote add origin <url>` | Add a remote named `origin` |
| `git remote -v` | Show remote fetch and push URLs |
| `git clone <url>` | Create a local copy with history and normally an `origin` remote |
| `git fetch origin` | Download objects and update remote-tracking references; do not integrate into current branch |
| `git pull` | Fetch and integrate updates into current branch |
| `git pull --rebase` | Pull while requesting rebase integration |
| `git pull --ff-only` | Pull only if integration can fast-forward |
| `git push` | Publish local commits using configured upstream |
| `git push -u origin <branch>` | Publish branch and establish upstream tracking |

### Stashing

| Command | Purpose / important detail |
|---|---|
| `git stash push -m "message"` | Temporarily save applicable uncommitted work |
| `git stash push -u -m "message"` | Include untracked files |
| `git stash list` | List stash entries |
| `git stash show -p stash@{0}` | Inspect a stash patch |
| `git stash apply [stash@{n}]` | Apply stash and keep its entry |
| `git stash pop` | Apply latest stash and normally remove it after success |
| `git stash drop stash@{n}` | Delete one stash |
| `git stash clear` | Delete all stashes; verify they are no longer needed |

---

## 4. Important Comparisons

### `restore` vs. `reset` vs. `revert`

```text
git restore → file contents or staging state
git reset   → move local branch history; may reset index/files
git revert  → new commit reversing an earlier commit
```

Use `revert` for an already-published commit when preserving shared history matters. Use `reset` carefully for local history, especially `--hard`.

### Merge vs. rebase

| Merge | Rebase |
|---|---|
| Combines branch histories | Replays commits onto a new base |
| May create a merge commit | Usually produces a linear history |
| Preserves the integration point | Creates new commits with new hashes |
| Suitable when explicit branch integration matters | Useful for updating or organizing local feature history |

Avoid rebasing commits already used by others unless the rewrite is coordinated.

### Merge vs. cherry-pick

```text
merge       → integrate another branch's history
cherry-pick → apply selected commit changes as a new commit
```

Cherry-picking is useful for a targeted fix, but repeated cherry-picks can duplicate changes across branches.

### Fetch vs. pull

```text
git fetch → update local remote-tracking references; do not change current branch
git pull  → fetch, then integrate updates into current branch
```

Use `fetch` when you want to inspect remote changes before choosing merge or rebase.

### Stash vs. `.gitignore`

```text
git stash → temporarily preserve unfinished work
.gitignore → prevent matching untracked files from being added
```

---

## 5. Branches, `HEAD`, and History

### Branch and `HEAD` model

```text
HEAD → current branch → current commit
```

A branch is a movable name pointing to a commit. A detached `HEAD` points directly to a commit:

```bash
git switch --detach <commit-hash>
```

Use detached `HEAD` for inspection or testing. Create a branch before making work you want to keep:

```bash
git switch -c recovery-work
```

### Reset modes

| Mode | Branch / `HEAD` | Index | Working directory |
|---|---|---|---|
| `--soft` | Moved | Preserved | Preserved |
| `--mixed` | Moved | Reset | Preserved |
| `--hard` | Moved | Reset | Reset |

### Reflog recovery

```bash
git reflog
git branch recovery-work <commit-hash>
```

The reflog is local and expires eventually; it is not a permanent backup.

---

## 6. Merge Workflow and Conflicts

### Merge types

Fast-forward, when the target has not advanced independently:

```text
A---B  main
     \
      C---D  feature

A---B---C---D  main
```

No merge commit is required; Git moves the target branch pointer forward.

Three-way merge, when both branches have new commits:

```text
        C---D  feature
       /
A---B---E      main
```

Git compares the common ancestor and both branch tips. A merge commit is generally created.

### Merge commands

```bash
git switch main
git merge feature/login
```

If conflicts occur, Git marks them like this:

```text
<<<<<<< HEAD
current branch version
=======
incoming branch version
>>>>>>> feature/login
```

Resolve them:

```bash
git status
# edit each conflicted file
# remove markers and keep valid intended content
git add <resolved-files>
git commit
```

Abort an active merge:

```bash
git merge --abort
```

Use `--abort` before the merge commit is completed. Preserve important unrelated work before risky operations.

---

## 7. Rebase, Interactive Rebase, and Cherry-Pick

### Rebase a feature branch

```bash
git switch feature/login
git rebase main
```

If `main` advances, feature commits are replayed and receive new hashes.

Resolve a rebase conflict:

```bash
git status
# edit and resolve files
git add <resolved-files>
git rebase --continue
```

Control an active rebase:

```bash
git rebase --abort
git rebase --skip
```

- `--abort` cancels the rebase.
- `--skip` omits the current commit; use only intentionally.

### Interactive rebase

```bash
git rebase -i HEAD~3
```

| Action | Meaning |
|---|---|
| `pick` | Keep commit |
| `reword` | Change message |
| `edit` | Stop and amend |
| `squash` | Combine with previous commit and edit message |
| `fixup` | Combine with previous commit, usually discard its message |
| `drop` | Remove commit |

Use primarily for local or coordinated history because it rewrites commits.

### Cherry-pick

```bash
git switch main
git cherry-pick <commit-hash>
```

Resolve and continue:

```bash
git status
# edit conflicted files
git add <resolved-files>
git cherry-pick --continue
```

Abort:

```bash
git cherry-pick --abort
```

---

## 8. Stashing and `.gitignore`

### Temporarily switch tasks

```bash
git stash push -u -m "WIP: login feature"
git switch bugfix
# fix, stage, and commit bug work
git switch feature/login
git stash pop
```

Use `git stash apply` instead of `pop` when you want to keep the stash entry until the restored work has been checked.

### `.gitignore`

Example project rules:

```gitignore
.env
.env.*
node_modules/
dist/
build/
*.log
!important.log
```

- Ignore rules apply to matching untracked files.
- Adding a tracked file to `.gitignore` does not untrack it.
- To keep a local file but stop tracking it:

```bash
git rm --cached .env
git commit -m "Stop tracking local environment file"
```

- A committed secret remains in earlier history. Revoke or rotate it and handle history cleanup separately.

Personal ignore rules can use a global excludes file:

```bash
git config --global core.excludesfile ~/.config/git/ignore
```

Use repository `.gitignore` for shared project rules and global excludes for personal machine rules.

---

## 9. GitHub Remote and Pull Request Workflow

### Connect and publish

```bash
git remote add origin <repository-url>
git remote -v
git push -u origin main
```

### Clone and inspect

```bash
git clone <repository-url>
cd <repository-name>
git status
git remote -v
```

### Standard feature workflow

```bash
# Update local knowledge of the remote
git fetch origin

# Start from current main
git switch main
git pull --ff-only

# Create and develop a feature
git switch -c feature/login
git add .
git commit -m "Add login feature"

# Publish it
git push -u origin feature/login
```

Then open a pull request:

1. Push the focused feature branch.
2. Open a PR against the target branch.
3. Review feedback and update the branch.
4. Resolve conflicts or failed checks.
5. Merge according to team policy.
6. Update local `main` and remove the feature branch when no longer needed.

### Remote synchronization model

```text
Local commits
      │ git push
      ▼
Remote repository on GitHub
      │ git fetch
      ▼
Remote-tracking references
      │ merge / rebase / pull
      ▼
Current local branch
```

A push may be rejected if the remote has commits not present locally. Fetch, inspect, integrate, and push again.

Avoid force-pushing shared branches. If a coordinated rewrite is required, `--force-with-lease` is generally safer than unconditional `--force`, but still requires care.

---

## 10. High-Value Workflows

### Create and publish a feature

```bash
git status
git fetch origin
git switch main
git pull --ff-only
git switch -c feature/name
# edit files
git add .
git diff --staged
git commit -m "Describe the feature"
git push -u origin feature/name
```

### Resolve a merge conflict

```bash
git status
# edit conflicted files and remove markers
git add <resolved-files>
git commit
```

To abandon the active merge:

```bash
git merge --abort
```

### Update a feature branch with rebase

```bash
git switch feature/name
git fetch origin
git rebase origin/main
# resolve, stage, and continue if needed
git add <resolved-files>
git rebase --continue
```

To abandon:

```bash
git rebase --abort
```

### Recover after a local history change

```bash
git reflog
git branch recovery-work <commit-hash>
```

---

## 11. Common Mistakes and Cautions

- `git restore <file>` can permanently discard unstaged edits.
- `git reset --hard` can discard tracked uncommitted changes.
- `git branch -D` bypasses the merged-branch safety check.
- `git commit --amend`, interactive rebase, and rebase rewrite commit history.
- Do not rewrite commits already shared with others without coordination.
- `git revert` is generally safer than rewriting an already-published commit.
- `git rebase --skip` discards the commit currently being replayed; use only intentionally.
- `git cherry-pick` can duplicate changes across branches.
- `git merge --abort`, `git rebase --abort`, and `git cherry-pick --abort` apply to operations still in progress.
- `git stash clear` permanently removes all stash references; verify first.
- `.gitignore` does not remove tracked files or erase committed secrets.
- Force-pushing can replace shared remote history; coordinate it and prefer `--force-with-lease` when appropriate.
- A detached `HEAD` does not provide a named branch for preserving new work.
- Reflog entries are local and expire; reflog is not a permanent backup.

---

## 12. Five-Minute Revision

```text
Git = local history; GitHub = remote hosting/collaboration.

Working directory → staging area → commit history.

Branch = movable commit reference.
HEAD = current checkout position.
origin/main = last fetched remote state.

add = stage; commit = record; diff = inspect.

merge = combine histories.
rebase = replay commits on a new base.
cherry-pick = apply one selected commit.

restore = file/index state.
reset = move local history.
revert = new commit undoing an earlier commit.
reflog = recover recent local positions.

fetch = download/inspect remote updates.
pull = fetch + integrate.
push = publish local commits.

stash = temporarily save unfinished work.
.gitignore = ignore matching untracked files.

map of danger:
restore/reset --hard → can discard local changes
amend/rebase → rewrite history
force-push → can replace shared remote history
```
