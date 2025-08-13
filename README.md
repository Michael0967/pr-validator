# PR Validation GitHub Action

[![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-blue?logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Validates that Pull Request descriptions include mandatory sections with quality content.**

This action ensures a minimum standard for change documentation and prevents PRs with incomplete or invalid information.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Validation Rules](#validation-rules)
- [Technical Details](#technical-details)
- [Examples](#examples)

## Features

### Required Sections

| Section | Status | Description |
|---------|--------|-------------|
| **Description** | Required | Change summary |
| **Task** | Required or N/A | Task link |
| **Demo** | Required or N/A | Video link |

### Validation Checks

| Check | Implementation | Threshold |
|-------|---------------|-----------|
| **Length** | Count visible characters | ≥ 30 chars |
| **Emojis** | Unicode emoji detection | < 50% emojis |
| **Repetition** | Character frequency analysis | No excessive repetition |
| **N/A Usage** | Exact match validation | Only in Task/Demo |

## Quick Start

### 1. Add to your workflow

Add this job to your existing `.github/workflows/` YAML file:

```yaml
jobs:
  validate-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Check PR Description
        uses: Michael0967/pr-validator@v1.0.6
```

### 2. Use this template

```markdown
Description: Brief summary of your changes here.

Task: https://your-task-manager.com/task/123 or N/A

Demo: https://your-video-link.com or N/A
```

## Usage

The action automatically validates PR descriptions on every update.

## Validation Rules

| Rule | Result | Example |
|------|--------|---------|
| Missing section | Error | No `Description:` section |
| Empty content | Error | `Description: ` (empty) |
| Too short | Error | `Description: Bug fix` |
| Emoji spam | Error | `Description: 🐛✨🎉` |
| Valid N/A | Success | `Task: N/A` |

## Technical Details

### Internal Flow

| Step | Action | Description |
|------|--------|-------------|
| 1 | Input Processing | Read `pr-body` input or `github.context.payload.pull_request.body` |
| 2 | Section Extraction | Parse `Description:`, `Task:`, `Demo:` with regex |
| 3 | Content Cleaning | Remove HTML, comments, Markdown formatting |
| 4 | Validation | Apply all validation rules |
| 5 | Result | Pass or fail with detailed feedback |

### Validation Logic

| Check | Implementation | Threshold |
|-------|---------------|-----------|
| **Length** | Count visible characters | ≥ 30 chars |
| **Emojis** | Unicode emoji detection | < 50% emojis |
| **Repetition** | Character frequency analysis | No excessive repetition |
| **N/A Usage** | Exact match validation | Only in Task/Demo |

## Examples

### Valid Examples

**Complete:**
```markdown
Description: Added user authentication feature with JWT tokens.

Task: https://monday.com/boards/123/pulses/456

Demo: https://www.loom.com/share/abc123
```

**With N/A:**
```markdown
Description: Fixed the checkout form validation bug.

Task: N/A

Demo: https://www.loom.com/share/xyz789
```

### Invalid Examples

**Missing sections:**
```markdown
Description: Added new feature
# Missing Task and Demo
```

**Too short:**
```markdown
Description: Bug fix
Task: N/A
Demo: N/A
```

**Emoji spam:**
```markdown
Description: 🐛✨🎉🔥💯
Task: N/A
Demo: N/A
```

## Dependencies

- `@actions/core` - Input handling and logging
- `@actions/github` - GitHub context access

## License

MIT © 2025

---

<div align="center">
[Report Bug](https://github.com/Michael0967/pr-validator/issues) • [Request Feature](https://github.com/Michael0967/pr-validator/issues)

</div> 