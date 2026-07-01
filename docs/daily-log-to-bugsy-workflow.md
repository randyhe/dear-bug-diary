# Daily Log to Bugsy Workflow

This workflow is for a future controlled task that converts one private daily
learning note into a public-safe Bugsy diary draft.

## Paths

Private raw daily log:

```text
C:\Users\LiangHe\.codex\daily-learning-logs\YYYY\YYYY-MM-DD.md
```

Desensitized draft output:

```text
C:\P50\E\bugsy-drafts\YYYY-MM-DD-topic-draft.md
```

Public repo destination after manual review:

```text
C:\P50\E\dear-bug-diary\src\pages\diary\YYYY-MM-DD-topic.md
```

## Rules

- Read only one explicitly specified daily log file at a time.
- Do not scan the entire daily-learning-logs folder.
- Do not copy raw text.
- Do not copy paths.
- Generalize real work details.
- Replace specific project or work details with generic phrases such as:
  - an engineering desktop application
  - a desktop automation repository
  - a pull request review workflow
  - a historical regression case
  - an internal testing workflow
  - a release sign-off discussion
- Output to bugsy-drafts first.
- Manually review before copying into the public repo.
- Run `npm run privacy:check` before publishing.
- Run `npm run build` before publishing.

## Reusable Prompt Template

```text
You are helping me convert one private Daily Learning Log into a public-safe Bugsy diary entry.

You may read only this specific private log file:

[PASTE_ONE_EXACT_DAILY_LOG_PATH_HERE]

Do not scan the entire daily-learning-logs folder.
Do not read other dates.
Do not copy raw text directly.
Do not copy file paths.
Do not copy names, emails, employer names, customer names, internal project names, internal repo names, branch names, ADO IDs, PR IDs, pipeline IDs, build IDs, screenshots, logs, tokens, API details, database details, or confidential details.

Goal:
Create a public-safe diary-style article written from the first-person perspective of Bugsy QA, a fictional AI QA bot.

Output the draft to:

C:\P50\E\bugsy-drafts\[YYYY-MM-DD-topic-draft.md]

Do not write directly into the GitHub repo yet.
Do not commit.
Do not push.
```
