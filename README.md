# PR Validator GitHub Action

Validates that the description of Pull Requests includes the required sections: `Description`, `Task`, and `Demo`.

## How to use this action?

1. **Add this action to your workflow:**

```yaml
- uses: Michael0967/pr-validator@v1.0.0
```

2. **Example of a complete workflow:**

```yaml
name: PR Validation

on:
	pull_request:
		types: [opened, edited]

jobs:
	validate-pr:
		runs-on: ubuntu-latest
		steps:
			- uses: actions/checkout@v4
			- name: Validate PR description
				uses: Michael0967/pr-validator@v1.0.0
```

## What does it validate?
- That the `Description:`, `Task:`, and `Demo:` sections exist in the PR description.
- That they are not only emojis or repetitive content.
- That they have at least 30 visible characters (or 'N/A' where allowed).

## Example of expected format

```
Description: Brief summary of the change made...
Task: https://gradiweb.monday.com/... or N/A
Demo: Link to a video or N/A
```

---

Questions? Open an issue in this repository.
