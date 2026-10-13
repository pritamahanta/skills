# Git Rebase, Interactive Rebase, and Cherry-Picking

## 1. What Is Rebasing?

**Rebasing** moves a series of commits by replaying them on top of a new base commit.

Suppose `main` advances while a feature is being developed:

```text
A---B---C  main
     \
      D---E  feature/login
```

Rebase the feature branch onto the latest `main`:

```bash
git switch feature/login
git rebase main
```

Result:

```text
A---B---C---D'---E'  feature/login
         ^
        main
```

`D'` and `E'` represent new commits. They contain replayed versions of `D` and `E`, but have different hashes because their parent history changed.

```text
Old base + feature commits
          ↓ rebase
New base + replayed feature commits
```

---

## 2. Merge vs. Rebase

| Merge | Rebase |
|---|---|
| Combines branch histories | Replays commits onto a new base |
| May create a merge commit | Usually creates a more linear history |
| Preserves the original branch structure | Creates new commits with new hashes |
| Clearly records that branches were integrated | Useful for updating a feature branch or organizing local history |

Neither operation is always better. The choice depends on the team's workflow and whether preserving an explicit merge point is important.

> Avoid rebasing commits that other developers already use unless the history rewrite has been coordinated. Rebasing shared commits can require others to reconcile their branches with the rewritten history.

---

## 3. Resolve Conflicts During a Rebase

A conflict can occur when Git replays an individual commit.

Check the state of the rebase:

```bash
git status
```

Resolve the conflicted files, then stage the resolutions:

```bash
git add app.js
```

Continue replaying the commits:

```bash
git rebase --continue
```

If another conflict occurs, repeat the resolve, stage, and continue steps.

### Cancel the rebase

```bash
git rebase --abort
```

This stops the in-progress rebase and attempts to restore the pre-rebase state.

### Skip the current commit

```bash
git rebase --skip
```

This omits the commit currently being replayed. Use it only when intentionally discarding that commit's changes, not simply to make a conflict disappear.

```text
Conflict
  ↓
Edit files
  ↓
git add <resolved-files>
  ↓
git rebase --continue
```

---

## 4. Interactive Rebase

Interactive rebase lets you review and reorganize a sequence of commits before sharing them.

```bash
git rebase -i HEAD~3
```

Git opens an editor listing the selected commits and their actions.

| Action | Meaning |
|---|---|
| `pick` | Keep the commit as it is |
| `reword` | Change the commit message |
| `edit` | Stop and amend the commit |
| `squash` | Combine with the previous commit and edit the combined message |
| `fixup` | Combine with the previous commit, usually discarding its message |
| `drop` | Remove the commit from the rebased history |

Interactive rebase is useful for:

- combining minor fix commits
- correcting commit messages
- removing unnecessary local commits
- organizing work into a clearer sequence

It rewrites history, so use it primarily for local or coordinated commits.

---

## 5. Cherry-Picking

**Cherry-picking** applies the changes introduced by a specific commit to the current branch.

Suppose a bug fix exists on another branch, but the entire branch should not be merged:

```bash
git switch main
git cherry-pick <commit-hash>
```

Git creates a new commit on `main` containing the selected change.

```text
Commit on another branch
          ↓ cherry-pick
New commit on current branch
```

### Cherry-pick vs. merge

- **Merge:** integrates the history of another branch.
- **Cherry-pick:** selects and applies specific commit changes.

Cherry-picking is useful for targeted fixes or backporting a particular change. Used carelessly, it can duplicate changes across branches and make history harder to understand.

---

## 6. Cancel an In-Progress Cherry-Pick

If a cherry-pick causes conflicts, inspect the state:

```bash
git status
```

After resolving conflicts, stage the files and continue:

```bash
git add <resolved-files>
git cherry-pick --continue
```

To abandon the operation:

```bash
git cherry-pick --abort
```

The related operation controls are:

```text
rebase
├── --continue
├── --abort
└── --skip

cherry-pick
├── --continue
└── --abort
```

Use each option intentionally because it changes how Git handles the current operation.

---

## 7. Recover After History Rewrites

If a rebase or other history operation moves a local branch unexpectedly, inspect recent reference movements:

```bash
git reflog
```

The reflog can help locate commits that are no longer visible through normal branch history. Once the desired commit is found, create a recovery branch:

```bash
git branch recovery-work <commit-hash>
```

The reflog is local and entries expire eventually, so it is a recovery tool rather than a permanent backup.

---

## 8. Practical Feature-Branch Workflow

Update a feature branch with the latest remote `main`:

```bash
git switch feature/login
git fetch origin
git rebase origin/main
```

If conflicts occur:

```bash
# Resolve the conflicted files
git add <resolved-files>
git rebase --continue
```

Review the result:

```bash
git log --oneline --graph --all
```

If the rebase should be abandoned:

```bash
git rebase --abort
```

After the feature branch is ready, integrate it according to the team's merge or rebase policy.

---

## 9. Choosing the Right Operation

```text
Need to integrate all branch history?
→ merge

Need to replay local commits on a newer base?
→ rebase

Need to clean up a local series of commits?
→ interactive rebase

Need one specific commit's change?
→ cherry-pick

Need to cancel an active operation?
→ --abort

Need to locate a previous local position?
→ reflog
```

---

## 10. Interview Questions

### What does rebase do?

It replays a series of commits on top of a new base commit, creating new commits with new hashes.

### Why can rebase cause conflicts?

Git applies each commit to the new base. A conflict can occur when a replayed change cannot be applied automatically.

### What is interactive rebase used for?

It reorganizes local commits by changing messages, combining commits, editing commits, or dropping commits.

### What is cherry-picking?

It applies the changes from a specific commit to the current branch and creates a new commit there.

### What is the difference between cherry-pick and merge?

Merge integrates another branch's history. Cherry-pick selects particular commit changes without integrating the entire branch.

### When should rebase be avoided?

Avoid rebasing commits already shared with others unless the team has coordinated the history rewrite.

### How do you cancel a rebase?

```bash
git rebase --abort
```

### How can you recover after a history rewrite?

Use `git reflog` to locate the earlier commit or branch position, then create a recovery branch from it.

---

## 11. Final Mental Model

```text
Rebase
  → replay commits on a new base
  → creates new commit hashes

Interactive rebase
  → edit, combine, reorder, or remove local commits

Cherry-pick
  → apply one selected commit to the current branch

Merge
  → combine branch histories

Reflog
  → locate recent local positions after history changes
```

### Key takeaways

```text
1. Rebase replays commits onto a new base.
2. Replayed commits receive new hashes.
3. Merge preserves an explicit branch-integration history; rebase usually creates a linear history.
4. Interactive rebase cleans up a local sequence of commits.
5. Cherry-pick applies a selected commit without merging the whole branch.
6. Use --continue, --abort, and --skip intentionally during a rebase.
7. Avoid rewriting shared history without coordination.
8. The reflog can help recover commits after local history changes.
```

> **Core rule:** Use merge to integrate histories, rebase to replay local work onto a new base, interactive rebase to clean up local commits, and cherry-pick to apply a specific commit's changes.
