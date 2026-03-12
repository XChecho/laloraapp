# RTK — Token-Optimized Commands

When running shell commands, ALWAYS prefix with `rtk` for these commands.
This reduces token consumption by ~89%.

## File System

- `ls` / `ls -la` → `rtk ls`
- `tree` → `rtk tree`
- `find` → `rtk find` (accepts native flags like `-name`, `-type`)
- `wc` → `rtk wc`

## File Reading & Diffs

- `cat <file>` → `rtk read <file>`
- `diff <file1> <file2>` → `rtk diff <file1> <file2>`
- `grep <pattern>` → `rtk grep <pattern>`

## Git & GitHub

- `git status` → `rtk git status`
- `git diff` → `rtk git diff`
- `git log` → `rtk git log`
- Any `git` command → `rtk git <subcommand>`
- Any `gh` command → `rtk gh <subcommand>`
- `gt` (Graphite stacked PRs) → `rtk gt <subcommand>`

## JavaScript / Node

- `npm run <script>` → `rtk npm run <script>` (rtk npm run build, rtk npm run dev, rtk npm run test, ...)
- `npx <tool>` → `rtk npx <tool>` (auto-routes tsc, eslint, prisma to specialized filters)
- `pnpm <command>` → `rtk pnpm <command>`
- `next build` → `rtk next build`

## Linting & Formatting

- `eslint` / `npx eslint` → `rtk lint`
- `prettier` → `rtk prettier`
- `ruff` → `rtk ruff`
- `mypy` → `rtk mypy`
- `tsc` / `npx tsc` → `rtk tsc`
- Any formatter (prettier, black, ruff format) → `rtk format`

## Databases & Cloud

- `psql` → `rtk psql` (strips borders, compresses tables)
- `aws` → `rtk aws` (forces JSON output, compresses)
- `kubectl` → `rtk kubectl`
- `docker` → `rtk docker`

## Network & Downloads

- `curl` → `rtk curl` (auto JSON detection and schema output)
- `wget` → `rtk wget` (strips progress bars)

## Logs & Errors

- Any command where only errors matter → `rtk err "<command>"`
- Any command where only logs matter → `rtk log "<command>"`

## Summaries & Analysis

- Quick 2-line summary of a command → `rtk smart "<command>"`
- Full heuristic summary → `rtk summary "<command>"`
- Project dependencies → `rtk deps`
- Environment variables (sensitive masked) → `rtk env`
- Token savings history → `rtk gain`
- Claude Code spending vs RTK savings → `rtk cc-economics`

## Utilities

- `cat package.json` / `cat Cargo.toml` / etc. → `rtk deps` (dependency summary)
- Run command without filtering but track usage → `rtk proxy "<command>"`
- Discover missed RTK savings from history → `rtk discover`
- Learn from past CLI errors → `rtk learn`
- Check hook integrity → `rtk verify`
- Show hook rewrite audit metrics → `rtk hook-audit` (requires `RTK_HOOK_AUDIT=1`)
- Rewrite a raw command to RTK equivalent → `rtk rewrite "<command>"`
- RTK configuration → `rtk config`
- Initialize RTK in CLAUDE.md → `rtk init`
- JSON structure without values → `rtk json <file>`