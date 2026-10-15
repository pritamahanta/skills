# Skills Learning Repository

A personal workspace for studying programming concepts through structured theory notes and small code examples.

## Repository areas

| Directory | Focus |
|---|---|
| [`javascript/`](javascript/) | JavaScript theory and code examples |
| [`react/`](react/) | React theory and browser examples |
| [`nodejs/`](nodejs/) | Node.js theory and server-side examples |
| [`type-script/`](type-script/) | TypeScript theory and source files |
| [`git-github/`](git-github/) | Git and GitHub theory, workflows, and revision notes |
| [`fastAPIS/`](fastAPIS/) | FastAPI practice code |

## Directory conventions

Most learning areas are divided into:

- `theory/`: Markdown study notes and topic explanations
- `code/`: Practical examples and exercises

The TypeScript area keeps its source files under [`type-script/src/`](type-script/src/), alongside its project configuration.

## Quick revision

- Git and GitHub: [`git-github/shortnotes.md`](git-github/shortnotes.md)
- Git and GitHub detailed notes: [`git-github/theory/`](git-github/theory/)
- JavaScript notes: [`javascript/theory/`](javascript/theory/)
- React notes: [`react/theory/`](react/theory/)
- Node.js notes: [`nodejs/theory/`](nodejs/theory/)
- TypeScript source lessons: [`type-script/src/`](type-script/src/)

## How to study

1. Read the relevant topic in its `theory/` directory.
2. Inspect the related example in its `code/` directory when one exists.
3. Run or modify the example to test your understanding.
4. Use [`git-github/shortnotes.md`](git-github/shortnotes.md) for quick Git and GitHub revision.

## Running examples

### Node.js

The Node.js examples are in [`nodejs/code/`](nodejs/code/). The directory includes an Express project with its own `package.json`.

Install its dependencies before running an Express example:

```bash
cd nodejs/code
npm install
```

Run a JavaScript file with Node.js:

```bash
node <file-name>.js
```

### TypeScript

The TypeScript project is in [`type-script/`](type-script/) and includes `package.json` and `tsconfig.json`.

Install its development dependency with:

```bash
cd type-script
npm install
```

The lesson files are in [`type-script/src/`](type-script/src/).

### React

The React material is organized into [`react/theory/`](react/theory/) and [`react/code/`](react/code/). The code examples are browser-oriented and should be used with the accompanying HTML setup when available.

## Notes

- Theory files are written as Markdown study notes.
- Code examples are intentionally small and focused on the concept being studied.
- Commands should be run from the relevant project directory when that directory contains its own `package.json`.
