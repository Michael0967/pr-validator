# PR Validator GitHub Action

A GitHub Action that validates Pull Request descriptions to ensure they contain the required sections: Description, Task, and Demo.

## Features

- Validates PR descriptions for required sections
- Checks for minimum content length (30 characters)
- Detects low-quality content (repetitive text, mostly emojis)
- Supports N/A values for optional sections
- Provides helpful error messages with formatting examples

## Usage

### Basic Usage

```yaml
name: Validate PR Description
on:
  pull_request:
    types: [opened, edited, synchronize]

jobs:
  validate-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Check PR Description
        uses: Michael0967/pr-validator@v1.0.0
```

### With Custom PR Body Input

```yaml
name: Validate PR Description
on:
  pull_request:
    types: [opened, edited, synchronize]

jobs:
  validate-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Check PR Description
        uses: Michael0967/pr-validator@v1.0.0
        with:
          pr-body: ${{ github.event.pull_request.body }}
```

## Required PR Description Format

Your PR description must include the following sections:

```markdown
**Description:** Brief summary of the changes made in this PR. This should be at least 30 characters long and provide a clear overview of what was implemented or fixed.

**Task:** Link to the task/issue (e.g., https://gradiweb.monday.com/...) or N/A if not applicable.

**Demo:** Link to a demo video or N/A if not applicable.
```

## Validation Rules

- **Description**: Required, minimum 30 characters
- **Task**: Required, can be a link or N/A
- **Demo**: Required, can be a link or N/A
- Content cannot be mostly emojis
- Content cannot be repetitive noise
- HTML tags and markdown formatting are stripped for validation

## Error Messages

The action will fail with helpful error messages if:
- Required sections are missing
- Sections are empty
- Content is too short
- Content contains mostly emojis
- Content is repetitive

## Example Output

### Success
```
✅ PR description is valid.
```

### Failure
```
❌ ERROR: The PR description must contain valid 'Description:', 'Task:' and 'Demo:' sections.
👀 Description section is missing.
👀 Task section is too short (minimum 30 visible characters, or use 'N/A').

💡 Expected format:
Description: Short summary of the change...
Task: https://gradiweb.monday.com/... or N/A
Demo: Video link or N/A
```

## License

MIT License - see LICENSE file for details.
