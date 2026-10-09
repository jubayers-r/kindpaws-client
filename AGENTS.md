<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository Agent Instructions

## Mission

Implement the requested change with the smallest complete, secure, maintainable diff. Inspect the repository before changing it. Verify actual behavior and report only evidence-supported results.

## 1. Source of Truth

- Inspect the installed framework version, relevant types, package scripts, existing implementation, and API contracts before making assumptions.
- For Next.js changes, read the relevant installed guide in `node_modules/next/dist/docs/`. Resolve the package location in monorepos.
- Preserve existing project conventions and user changes.
- If an essential API contract or product decision is ambiguous, ask before implementing the ambiguous part.

## 2. Runtime and Dependencies

- Use Bun exclusively. Never use npm, yarn, or pnpm.
- Follow the scripts in the existing package.json.
- Never manually edit bun.lock or bun.lockb.
- Ask for explicit confirmation before adding or removing external dependencies.
- Do not modify unrelated files or overwrite existing user changes.

## 3. Architecture and Security

- Default to Server Components where appropriate.
- Add 'use client' only at the smallest practical interactive boundary.
- Keep secrets, database clients, and privileged server logic out of client modules.
- Validate untrusted inputs on the server.
- Enforce authorization server-side; hiding UI is not authorization.
- Follow existing API contracts and shared schemas.
- Use the project's existing shadcn components, cn() helper, Tailwind tokens, and localization conventions.

## 4. Implementation Discipline

- Inspect relevant types and interfaces before large implementations.
- Work sequentially; do not spawn background workers.
- Prefer focused changes over broad refactors.
- Keep state transitions, loading indicators, error recovery, and empty states correct.
- Avoid speculative abstractions and unnecessary dependencies.
- Never fabricate endpoints, payload fields, test results, or file paths.

## 5. Verification

- Review the final diff for unrelated changes, security issues, type errors, and accidental regressions.
- Run relevant checks defined by the project, such as typecheck, lint, tests, and build.
- Never claim a check passed unless it actually ran and succeeded.
- Report failures, blocked checks, and untested behavior honestly.
- Provide concise manual testing steps when automated checks cannot verify the UI behavior.

## 6. Scope and Approval

Never execute:

- git reset --hard
- git clean -fd
- git checkout -- .
- git push --force

Obtain explicit confirmation before destructive operations, external dependency changes, or major architectural refactors.

Routine, non-destructive implementation and verification should proceed without unnecessary interruptions.

## 7. Documentation and Context

Read additional documentation only when relevant to the task.

- Architecture and boundaries: ARCHITECTURE.md
- Frontend conventions: docs/engineering/frontend.md
- Testing and verification: docs/engineering/testing.md
- Security: docs/engineering/security.md
- Engineering documentation index: docs/engineering/index.md

For substantial multi-file tasks, use docs/exec-plans/README.md and maintain an implementation summary when the work must survive a session handoff.

Do not create planning documents for trivial edits. Do not repeatedly inspect the same code without a new hypothesis or useful evidence.

## 8. Completion

Before finishing:

1. Inspect the diff.
2. Run appropriate verification.
3. Report modified files and actual check results.
4. Identify outstanding blockers and manual checks.
5. Update a substantial task's handoff summary when needed.

Deliver the smallest correct change, preserve repository integrity, and distinguish verified results from assumptions.
