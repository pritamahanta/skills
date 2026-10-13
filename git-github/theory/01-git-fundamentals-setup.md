# Git Fundamentals and Setup

## 1. What Is Git?

Git is a **distributed version control system (VCS)** that tracks changes to files over time.

Git helps developers:

- preserve project history
- compare versions of files
- restore earlier versions
- develop features independently with branches
- collaborate without directly overwriting each other's work

### Git vs. GitHub

| Git | GitHub |
|---|---|
| A version control system | A cloud platform for hosting Git repositories |
| Runs locally on your computer | Provides remote repositories and collaboration tools |
| Manages commits, branches, merges, and history | Provides pull requests, reviews, issues, and permissions |

Git works without GitHub. GitHub uses Git to manage repository history and adds online collaboration features.

---

## 2. Essential Git Concepts

| Term | Meaning |
|---|---|
| **Repository** | A project tracked by Git, including its history |
| **Commit** | A recorded snapshot of selected project changes |
| **Branch** | A movable reference to a commit used for independent development |
| **Working directory** | The files currently being edited |
| **Staging area** | The place where changes are selected for the next commit |
| **Remote** | A reference to another repository, often hosted on GitHub |
| **HEAD** | The current checked-out commit or branch position |

### The three main local areas

```text
Working Directory
       │ git add
       ▼
Staging Area
       │ git commit
       ▼
Repository History
```

---

## 3. Install and Configure Git

Check whether Git is installed:

```bash
git --version
```

Configure the author information Git uses for your commits:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Review the global configuration:

```bash
git config --global --list
```

The `--global` option applies the setting to your user account. A repository-specific configuration can override a global setting.

> `user.name` and `user.email` identify the author recorded in a commit. They do not authenticate you to GitHub.

---

## 4. Create a Repository

Create a project directory and initialize Git:

```bash
mkdir git-practice
cd git-practice

git init
```

`git init` creates a Git repository in the current directory. Git stores the repository's internal data in the hidden `.git` directory.

Check the repository state:

```bash
git status
```

Create a file and check the status again:

```bash
echo "# Git Practice" > README.md
git status
```

`README.md` appears as **untracked** because Git sees the file but has not yet been told to include it in version control.

---

## 5. The Basic Git Workflow

The standard local workflow is:

```text
Edit files
    ↓
Working directory
    │ git add
    ▼
Staging area
    │ git commit
    ▼
Repository history
```

Example:

```bash
git add README.md
git commit -m "Add project README"
git status
```

- `git add` stages changes for the next commit.
- `git commit` records the staged changes in the repository history.
- `git status` shows what is modified, staged, or untracked.

A commit contains only the changes that were staged before the commit command.

---

## 6. Essential Commands

| Command | Purpose |
|---|---|
| `git --version` | Check the installed Git version |
| `git init` | Initialize a repository |
| `git status` | Inspect the current file states |
| `git config --global --list` | View global Git configuration |
| `git add <file>` | Stage a file's changes |
| `git commit -m "message"` | Record staged changes |
| `git log` | View commit history |
| `git help <command>` | Open documentation for a Git command |

---

## 7. A Small Practice Session

```bash
mkdir git-practice
cd git-practice
git init

echo "# Git Practice" > README.md
git status

git add README.md
git commit -m "Add project README"
git log
```

The progression is:

```text
Repository initialized
        ↓
README.md is untracked
        ↓
README.md is staged
        ↓
README.md is committed
        ↓
Commit appears in history
```

---

## 8. Common Questions

### Can Git work without GitHub?

Yes. Git runs locally and can track project history without any remote hosting service.

### What does GitHub add?

GitHub provides remote repository hosting and collaboration features such as pull requests, code reviews, issues, and repository permissions.

### What does `git init` do?

It initializes a Git repository in the current directory and creates the hidden `.git` directory.

### What does `git add` do?

It places selected changes in the staging area so they can be included in the next commit.

### What does `git commit` do?

It records the currently staged changes as a snapshot in repository history.

### Why use `git status` frequently?

It shows which files are untracked, modified, or staged, helping you understand what the next Git command will affect.

### Does Git configuration authenticate me to GitHub?

No. The configured name and email identify commit authorship. Authentication is a separate process.

---

## 9. Key Takeaways

```text
Git
→ local distributed version control system

GitHub
→ hosting and collaboration platform built around Git

Repository
→ project plus its Git history

Working directory
→ files currently being edited

Staging area
→ selected changes for the next commit

Commit
→ recorded snapshot of staged changes
```

> **Core rule:** Edit files in the working directory, stage the changes with `git add`, and record them in repository history with `git commit`. Git manages local history; GitHub provides remote hosting and collaboration.
