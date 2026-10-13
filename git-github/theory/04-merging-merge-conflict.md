# Git Merging and Merge Conflicts

## 1. What Is Merging?

Merging combines changes from one branch into another branch.

A common feature workflow is:

```bash
git switch -c feature/login

# Make changes and commit them
git add .
git commit -m "Add login feature"

git switch main
git merge feature/login
```

The final command integrates `feature/login` into `main`.

```text
Source branch  → feature/login
Target branch  → main

Merge feature/login while checked out on main
```

---

## 2. Fast-Forward Merge

A **fast-forward merge** is possible when the target branch has not advanced independently since the feature branch was created.

Before:

```text
A---B  main
     \
      C---D  feature/login
```

After:

```text
A---B---C---D  main
             ^
       feature/login
```

Git simply moves the `main` reference forward to the feature branch's latest commit. No merge commit is created because the histories have not diverged.

```text
No divergent work
        ↓
Move target branch pointer forward
        ↓
Fast-forward merge
```

---

## 3. Three-Way Merge

A **three-way merge** is needed when both branches have developed independently.

Before:

```text
        C---D  feature/login
       /
A---B---E      main
```

Git compares three commits:

1. the common ancestor, `B`
2. the tip of the current branch, `E`
3. the tip of the incoming branch, `D`

Git combines the changes from both branch tips. A merge commit is generally created when the histories have diverged.

```text
Common ancestor + current branch + incoming branch
                    ↓
              Three-way merge
```

---

## 4. Delete a Merged Branch

After merging, delete the local feature branch:

```bash
git branch -d feature/login
```

The lowercase `-d` checks whether Git considers the branch safely merged.

Force deletion with:

```bash
git branch -D feature/login
```

Use `-D` carefully because it bypasses the safety check and can remove a branch containing commits that are not merged elsewhere.

Deleting a branch normally does not delete commits that remain reachable through another branch.

---

## 5. What Is a Merge Conflict?

A merge conflict occurs when Git cannot safely reconcile competing changes, often because both branches changed the same lines in incompatible ways.

Git marks the conflicted area with markers such as:

```text
<<<<<<< HEAD
console.log("Main version");
=======
console.log("Feature version");
>>>>>>> feature/login
```

The markers mean:

- `<<<<<<< HEAD` begins the current branch's version.
- `=======` separates the competing versions.
- `>>>>>>> feature/login` ends the incoming branch's version.

The labels depend on the merge context. The file is not resolved until the markers are removed and the final content is valid.

---

## 6. Resolve a Merge Conflict

### Step 1: Identify conflicted files

```bash
git status
```

### Step 2: Inspect each conflicted file

Decide whether to:

- keep the current branch's version
- keep the incoming branch's version
- combine both versions

### Step 3: Remove conflict markers

Edit the file so it contains the intended valid content and no unintended conflict markers.

### Step 4: Stage the resolution

```bash
git add app.js
```

Stage every resolved file, not only `app.js` if multiple files were conflicted.

### Step 5: Complete the merge

```bash
git commit
```

Git usually prepares a merge-commit message. Review it and complete the commit using the instructions shown by Git.

The resolution flow is:

```text
Conflict detected
      ↓
git status
      ↓
Edit conflicted files
      ↓
Remove markers and test the result
      ↓
git add resolved files
      ↓
git commit
```

---

## 7. Abort an In-Progress Merge

If you decide not to continue an active merge:

```bash
git merge --abort
```

This abandons the in-progress merge and attempts to restore the pre-merge state.

Use it while the merge is still in progress. If the merge commit has already been completed, undoing it requires a different approach, such as reverting the merge commit.

Before starting a risky merge, commit or otherwise preserve important unrelated work. An abort is intended to cancel the merge, but it should not be treated as a substitute for protecting uncommitted changes.

---

## 8. Practical Merge Workflow

```bash
# Inspect the repository
git status

# Move to the feature branch
git switch feature/login

# Commit the feature work
git add .
git commit -m "Complete login feature"

# Move to the target branch
git switch main

# Merge the feature branch
git merge feature/login

# Inspect the result
git status
git log --oneline --graph --all
```

If conflicts occur, stop and resolve them before treating the merge as complete:

```bash
git status
# edit conflicted files
git add <resolved-files>
git commit
```

After a successful merge, you may remove the local feature branch:

```bash
git branch -d feature/login
```

---

## 9. Merge Comparison

| Situation | Result |
|---|---|
| Target branch has not advanced | Fast-forward merge; branch pointer moves forward |
| Both branches have new commits | Three-way merge; a merge commit is generally created |
| Changes cannot be combined automatically | Merge conflict; human resolution is required |
| Merge should be abandoned before completion | `git merge --abort` |

---

## 10. Interview Questions

### What does `git merge` do?

It combines the changes from an incoming branch into the currently checked-out branch.

### What is a fast-forward merge?

A merge in which Git moves the target branch pointer forward because the target has no independent commits after the branches diverged.

### What is a three-way merge?

A merge that compares the common ancestor and the tips of both branches to combine independently developed changes.

### What causes a merge conflict?

Git cannot automatically reconcile competing changes, commonly because both branches modified the same lines incompatibly.

### How do you resolve a conflict?

Inspect the conflicted files, choose or combine the intended content, remove conflict markers, stage the resolved files, and complete the merge commit.

### How do you cancel an in-progress merge?

Run:

```bash
git merge --abort
```

### What is the difference between `git branch -d` and `git branch -D`?

`-d` checks that the branch is safely merged. `-D` forcefully deletes it without that safety check.

---

## 11. Final Mental Model

```text
Feature branch
      ↓
Commit feature work
      ↓
Switch to target branch
      ↓
Merge feature branch
      │
      ├── histories aligned → fast-forward
      ├── histories diverged → three-way merge
      └── incompatible changes → resolve conflict
                                      ↓
                              stage and commit
```

### Key takeaways

```text
1. Merging combines one branch's changes into another.
2. A fast-forward merge moves a branch pointer without creating a merge commit.
3. A three-way merge combines two branch tips using their common ancestor.
4. Conflicts require manual review and resolution.
5. Resolved files must be staged before the merge can be completed.
6. git merge --abort cancels an in-progress merge.
7. git branch -d safely deletes a merged branch; -D bypasses the safety check.
```

> **Core rule:** Switch to the target branch before merging, resolve conflicts carefully when Git cannot combine changes automatically, stage the resolutions, and complete the merge with a commit.
