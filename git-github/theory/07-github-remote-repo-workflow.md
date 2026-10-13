# GitHub and Remote Repository Workflows

## 1. What Is a Remote Repository?

A **remote repository** is another copy of a Git repository, usually hosted on a platform such as GitHub.

A typical setup contains:

```text
Local repository  → repository on your computer
Remote repository → repository hosted on GitHub
origin            → conventional name for the remote
```

Git manages history locally. Remote commands synchronize commits and repository information between the local and remote repositories.

---

## 2. Connect a Local Repository to GitHub

After creating an empty repository on GitHub, add it as a remote:

```bash
git remote add origin <repository-url>
git remote -v
```

`git remote -v` displays the remote names and their fetch/push URLs.

If the local branch is named `main`, publish it with:

```bash
git push -u origin main
```

The `-u` option sets the upstream relationship between the local branch and its remote-tracking branch. Later `git push` and `git pull` commands can then use that relationship automatically.

---

## 3. Clone an Existing Repository

Clone a repository and its history:

```bash
git clone <repository-url>
```

Git creates a local working copy and normally configures the source repository as the remote named `origin`.

```bash
cd <repository-name>
git status
git remote -v
```

Cloning is the usual starting point when joining an existing project.

---

## 4. Local and Remote-Tracking Branches

A **local branch** is the branch you work on directly.

A **remote-tracking branch**, such as `origin/main`, is your local record of the remote branch's state. It is updated by commands such as `git fetch`.

List local branches:

```bash
git branch
```

List local and remote-tracking branches:

```bash
git branch -a
```

View upstream relationships and tracking status:

```bash
git branch -vv
```

Create a local branch that tracks an existing remote branch:

```bash
git switch --track origin/feature/login
```

The remote branch must already exist and be available in your local remote-tracking references.

Conceptually:

```text
Local branch
    ↕ tracks
Remote-tracking branch
    ↕ represents
Remote branch on GitHub
```

---

## 5. `git fetch` vs. `git pull`

### `git fetch`

```bash
git fetch origin
```

`git fetch` downloads new objects and updates remote-tracking references. It does not, by itself, change the current local branch.

Inspect commits on the remote that are not yet in local `main`:

```bash
git log --oneline main..origin/main
```

### `git pull`

```bash
git pull
```

`git pull` fetches remote updates and then integrates them into the current branch according to the configured or specified strategy.

For example, explicitly request a rebase:

```bash
git pull --rebase
```

### The core difference

```text
git fetch
→ update your local view of the remote
→ do not integrate into the current branch automatically

git pull
→ fetch remote updates
→ integrate them into the current branch
```

Use `fetch` when you want to inspect remote changes before deciding how to integrate them.

---

## 6. Push Local Changes to GitHub

After committing locally:

```bash
git push
```

Publish a branch and set its upstream when one is not configured:

```bash
git push -u origin feature/login
```

A push may be rejected if the remote contains commits your local branch does not include. In that case:

1. fetch the remote updates
2. inspect the differences
3. integrate them with merge or rebase
4. push again

Avoid force-pushing shared branches because it can replace remote history. If a coordinated history rewrite is necessary, `--force-with-lease` is generally safer than unconditional `--force`, but it still requires care.

---

## 7. A Typical Feature-Branch Workflow

```bash
# Obtain current remote information
git fetch origin

# Start from an up-to-date main branch
git switch main
git pull --ff-only

# Create a focused feature branch
git switch -c feature/login

# Make changes and commit them
git add .
git commit -m "Add login feature"

# Publish the feature branch
git push -u origin feature/login
```

After pushing, open a pull request on GitHub.

When the feature is merged, update local `main` and remove the feature branch when it is no longer needed.

---

## 8. Pull Requests and Collaboration

A **pull request (PR)** is a GitHub mechanism for proposing changes from one branch into another.

Typical PR workflow:

1. Create a focused feature branch.
2. Commit logical changes locally.
3. Push the feature branch.
4. Open a PR against the target branch.
5. Review feedback and update the branch.
6. Resolve conflicts or failed checks.
7. Merge according to team policy.

Pull requests support discussion, code review, automated checks, and controlled integration. Focused branches and understandable commits make review easier and reduce unrelated changes.

---

## 9. Synchronization Mental Model

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

The remote-tracking branch is your local record of the remote state; it is not the remote repository itself.

---

## 10. Essential Command Reference

| Task | Command |
|---|---|
| Check status | `git status` |
| Inspect configured remotes | `git remote -v` |
| Clone a repository | `git clone <repository-url>` |
| Create a branch | `git switch -c <branch>` |
| Switch branches | `git switch <branch>` |
| Track a remote branch | `git switch --track origin/<branch>` |
| List branches | `git branch -a` |
| View tracking information | `git branch -vv` |
| Download remote updates | `git fetch origin` |
| Integrate remote updates | `git pull` |
| Pull using rebase | `git pull --rebase` |
| Publish a branch | `git push -u origin <branch>` |
| View history | `git log --oneline --graph --all` |
| Merge a branch | `git merge <branch>` |
| Rebase onto a branch | `git rebase <branch>` |
| Save unfinished work | `git stash push -m "message"` |
| Inspect local reference history | `git reflog` |

---

## 11. Interview Questions

### What is a remote repository?

Another copy of a Git repository, often hosted on GitHub, used to synchronize work and collaborate.

### What is `origin`?

The conventional default name for the remote created when a repository is cloned or commonly when a remote is added manually.

### What is the difference between a local branch and `origin/main`?

A local branch is checked out and developed directly. `origin/main` is a remote-tracking reference showing the last fetched state of the remote `main` branch.

### What is the difference between `fetch` and `pull`?

`fetch` updates remote-tracking references without integrating changes into the current branch. `pull` fetches and then integrates the updates.

### What does `git push -u` do?

It pushes the branch and establishes its upstream relationship with the specified remote branch.

### Why can a push be rejected?

The remote may contain commits that the local branch does not include. Fetch and integrate those changes before pushing again.

### What is a pull request?

A GitHub collaboration workflow for reviewing and proposing the integration of one branch into another.

### Why avoid force-pushing shared branches?

Force-pushing can replace remote history and disrupt other developers. Use it only with coordination, preferring `--force-with-lease` when appropriate.

---

## 12. Final Mental Model

```text
Fetch remote information
        ↓
Update remote-tracking references
        ↓
Create a focused local branch
        ↓
Commit logical changes
        ↓
Push and set upstream
        ↓
Open a pull request
        ↓
Review, test, and integrate
```

### Key takeaways

```text
1. A remote repository is another copy of a Git repository.
2. origin is the conventional name for the main remote.
3. A remote-tracking branch records the last fetched remote state.
4. fetch updates remote information without changing the current branch.
5. pull fetches and integrates remote updates.
6. push publishes local commits to the remote.
7. Pull requests support review and controlled collaboration.
8. Avoid force-pushing shared branches without coordination.
```

> **Core rule:** Fetch updates, create a focused feature branch, commit logically, push with an upstream, open a pull request, review the changes, and merge according to the team's policy.
