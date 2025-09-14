# PR Validation GitHub Action

[![GitHub
Actions](https://img.shields.io/badge/GitHub-Actions-blue?logo=github-actions&logoColor=white)](https://github.com/features/actions)\
[![License:
MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Validates that Pull Request descriptions include mandatory sections
> with quality content.**

This action ensures a minimum standard for change documentation and
prevents PRs with incomplete or invalid information.

------------------------------------------------------------------------

## Table of Contents

-   [Features](#features)\
-   [Quick Start](#quick-start)\
-   [Usage](#usage)\
-   [Validation Rules](#validation-rules)\
-   [Technical Details](#technical-details)\
-   [Examples](#examples)\
-   [Build & Release](#build--release)

------------------------------------------------------------------------

## Features

### Required Sections

  Section           Status            Description
  ----------------- ----------------- -------------------
  **Description**   Required          Change summary
  **Task**          Required or N/A   Task link or N/A
  **Demo**          Required or N/A   Video link or N/A

### Validation Checks

  ------------------------------------------------------------------------
  Check            Implementation               Threshold
  ---------------- ---------------------------- --------------------------
  **Length**       Count visible characters     ≥ 30 chars (Description)

  **Emojis**       Unicode emoji detection      \< 50% emojis

  **Repetition**   Character frequency check    No excessive repetition

  **N/A Usage**    Exact match validation       Only in Task/Demo
  ------------------------------------------------------------------------

------------------------------------------------------------------------

## Quick Start

### 1. Add to your workflow

``` yaml
jobs:
  validate-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Check PR Description
        uses: Michael0967/pr-validator@v1.0.9
```

### 2. Use this template

\`\`\`markdown Description: Brief summary of your changes here.

Task: https://your-task-manager.com/task/123 or N/A

Demo: https://your-video-link.com or N/A \`\`\`

------------------------------------------------------------------------

## Usage

The action automatically validates PR descriptions on every update.\
Optional input:

  Input          Default   Description
  -------------- --------- ------------------------------------
  `pr-body`      ""        Override PR body content
  `min-length`   `30`      Minimum characters for Description

Example with inputs:

``` yaml
jobs:
  validate-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Check PR Description
        uses: Michael0967/pr-validator@v1.0.9
        with:
          pr-body: ${{ github.event.pull_request.body }}
          min-length: 40
```

------------------------------------------------------------------------

## Validation Rules

  Rule              Result    Example
  ----------------- --------- ---------------------------
  Missing section   Error     No `Description:` section
  Empty content     Error     `Description:` (empty)
  Too short         Error     `Description: Bug fix`
  Emoji spam        Error     `Description: 🐛✨🎉`
  Valid N/A         Success   `Task: N/A`

------------------------------------------------------------------------

## Technical Details

### Internal Flow

  -------------------------------------------------------------------------
  Step   Action              Description
  ------ ------------------- ----------------------------------------------
  1      Input Processing    Read `pr-body` input or PR body from context

  2      Section Extraction  Parse `Description:`, `Task:`, `Demo:`

  3      Content Cleaning    Remove HTML, comments, Markdown formatting

  4      Validation          Apply rules (length, noise, emojis, N/A)

  5      Result              Fail with feedback or succeed cleanly
  -------------------------------------------------------------------------

------------------------------------------------------------------------

## Examples

### ✅ Valid PR

\`\`\`markdown Description: Added user authentication with JWT tokens.

Task: https://monday.com/boards/123/pulses/456

Demo: https://www.loom.com/share/abc123 \`\`\`

### ✅ With N/A

\`\`\`markdown Description: Fixed checkout form validation bug.

Task: N/A

Demo: https://www.loom.com/share/xyz789 \`\`\`

### ❌ Invalid PR

\`\`\`markdown Description: Bug fix Task: N/A Demo: N/A \`\`\`

------------------------------------------------------------------------

## Build & Release

This action is bundled with [**esbuild**](https://esbuild.github.io/)
for performance:

``` bash
npm install
npm run build      # generates dist/index.js
git add dist
git commit -m "chore: build v1.0.9"
git tag -fa v1 -m "Release v1.0.9"
git tag v1.0.9
git push origin main --tags
```

### Scripts (`package.json`)

``` json
"scripts": {
  "build": "esbuild index.js --bundle --platform=node --target=node20 --minify --sourcemap --outfile=dist/index.js"
}
```

> ✅ Always **commit `dist/index.js`** to the repo so consumers can run
> the Action without installing dependencies.

------------------------------------------------------------------------

## Dependencies

-   `@actions/core` -- Inputs and logging\
-   `@actions/github` -- GitHub context access\
-   `esbuild` -- Bundling for production

------------------------------------------------------------------------

## License

MIT © 2025

------------------------------------------------------------------------

<div align="center">
[Report Bug](https://github.com/Michael0967/pr-validator/issues) •
[Request Feature](https://github.com/Michael0967/pr-validator/issues)
</div> 