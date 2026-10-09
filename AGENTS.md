<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# PRODUCTION AGENT RUNTIME PROTOCOL — NEXT.JS + BUN + SHADCN

This document governs AI coding agents working on this production frontend application. Prioritize correctness, security, maintainability, deterministic execution, minimal context consumption, and verifiable delivery.

**Core principle:** Understand the existing system before changing it. Make the smallest complete change that satisfies the request. Verify what changed. Report only what the evidence supports.

---

**Managed-block rule:** Preserve the contents and markers of the Next.js-managed section. Add project-specific instructions outside these markers. Do not remove or rewrite the managed section to avoid a generated diff.

---

## 1. Operating Principles

1. **Inspect before implementing.** Establish the relevant architecture, types, existing patterns, and acceptance criteria before editing.
2. **Follow repository truth.** Existing implementation, installed package versions, configuration, schemas, and version-matched documentation take precedence over assumptions from training data.
3. **Minimize the change surface.** Modify only files required to fulfill the request and verify the resulting behavior.
4. **Prefer simple, complete solutions.** Avoid speculative abstractions, unnecessary dependencies, unrelated refactors, and premature optimization.
5. **Preserve existing conventions.** Reuse established components, utilities, design tokens, validation schemas, and API clients.
6. **Verify before claiming completion.** A change is not verified merely because the code was written.
7. **Keep communication evidence-based.** Clearly distinguish completed work, test results, unresolved problems, and manual checks that remain.
8. **Never fabricate.** Do not invent APIs, schema fields, test results, file paths, package scripts, environment values, or successful outcomes.

### Instruction priority

Resolve conflicting requirements in this order:

1. Security, privacy, and explicit user constraints.
2. Installed framework documentation and actual API contracts.
3. Existing project configuration and established architecture.
4. This protocol.
5. Agent preferences and general conventions.

If an essential requirement remains ambiguous, ask a focused question before implementing the ambiguous portion. Continue independent, unambiguous work where safe.

---

## 2. Toolchain and Runtime — Bun Only

### Mandatory tooling

- Use `bun` as the runtime and package manager.
- Never run or recommend `npm`, `yarn`, or `pnpm`.
- Never manually edit or resolve conflicts directly inside `bun.lock` or `bun.lockb`.
- Do not change dependency versions or regenerate lockfiles without a task-related reason.
- Use scripts defined in the existing `package.json`; do not assume every project has the same scripts.

Common commands, subject to project configuration:

| Purpose                       | Command              |
| ----------------------------- | -------------------- |
| Install existing dependencies | `bun install`        |
| Add a production dependency   | `bun add <pkg>`      |
| Add a development dependency  | `bun add -d <pkg>`   |
| Remove a dependency           | `bun remove <pkg>`   |
| Start development server      | `bun dev`            |
| Typecheck                     | `bun run typecheck`  |
| Lint                          | `bun run lint`       |
| Production build              | `bun run build`      |
| Fallback TypeScript check     | `bun x tsc --noEmit` |

Do not run a command merely because it appears in this table. First confirm that it is appropriate for the repository and task.

### Dependency policy

- Prefer existing dependencies and built-in platform capabilities.
- Do not add a dependency when a suitable existing utility or installed package already solves the problem.
- **Pause for explicit user confirmation before adding or removing an external dependency.**
- Never use dependency installation as a substitute for understanding an existing implementation.
- After an approved dependency change, inspect the resulting manifest and let Bun manage the lockfile.

### Lockfile integrity

Never manually modify lockfiles. If installation or lockfile generation produces unrelated changes, investigate their cause and keep the task's scope intact.

---

## 3. Next.js Version and Documentation Discipline

### Mandatory pre-implementation checks

For Next.js-related work:

1. Identify the installed Next.js version and relevant project structure.
2. Locate the installed documentation at `node_modules/next/dist/docs/`, resolving the actual package location in monorepos.
3. Read the relevant guide, API reference, file-convention documentation, or migration guidance before writing code that depends on unfamiliar or version-sensitive APIs.
4. Inspect deprecation notices and the project's current implementation.
5. Use the documented API supported by the installed version.

Do not read the entire documentation tree. Find the relevant document and inspect only what the task requires.

If the installed version does not contain bundled documentation, use another trustworthy, version-matched source when available. Do not silently substitute documentation for a different version.

### Next.js-specific safeguards

- Default to React Server Components where the App Router supports them and the component does not require client-side capabilities.
- Add `'use client'` only at the smallest practical component boundary that needs hooks, event handlers, browser APIs, or interactive client-side primitives.
- Keep database access, secrets, server-only utilities, and privileged operations out of client modules.
- Use Server Actions or route handlers according to the existing architecture and the documented API contract.
- Treat request-context APIs such as `params`, `searchParams`, `cookies()`, and `headers()` according to the installed version's signatures. Await asynchronous APIs where required.
- Do not assume Pages Router and App Router conventions are interchangeable.
- Do not introduce caching, revalidation, streaming, or rendering changes without understanding their effects on the requested behavior.
- Follow the installed version's conventions for metadata, errors, loading boundaries, route handlers, and file organization.
- Preserve existing framework-managed files and generated sections.

### Optional framework diagnostics

If Next.js development diagnostics, MCP integrations, browser inspection tools, or other agent tooling are already configured and available, use them when they materially improve diagnosis or verification.

Never assume an optional tool is installed or connected. Do not introduce infrastructure solely to satisfy this protocol.

---

## 4. Repository Reconnaissance and Scope Control

### Before editing

Perform the smallest useful inspection sequence:

1. Identify the repository root and relevant application directory.
2. Inspect the working-tree status and existing user changes.
3. Read the relevant package scripts and configuration.
4. Locate the target component, route, types, schemas, API client, and related tests.
5. Inspect nearby implementations to establish existing conventions.
6. Identify the expected behavior and relevant regression risks.

Prefer targeted searches and type/interface inspection over dumping large implementation files into context.

### Zero scope creep

- Modify only files directly related to the request.
- Do not reformat unrelated files, rename unrelated symbols, or clean up unrelated imports.
- Do not replace established architecture merely because an alternative is preferable in isolation.
- Do not revert or overwrite existing user changes.
- Do not claim ownership of modifications that existed before the task.
- If an unrelated defect blocks the requested change, explain the dependency and its impact before expanding scope.

### Destructive-operation safeguards

Never execute:

- `git reset --hard`
- `git clean -fd`
- `git checkout -- .`
- `git push --force`

Do not run other destructive commands or broad deletion scripts without explicit user confirmation.

Before potentially destructive changes, explain what will be affected and obtain confirmation. Preserve uncommitted work.

---

## 5. Architecture and Server/Client Boundaries

### React and component design

- Prefer Server Components for server-rendered content and server-side data access when appropriate.
- Keep client components focused on interaction, local state, and browser-dependent behavior.
- Do not move a component to the client simply to make one small interaction work; isolate the interaction where practical.
- Reuse existing layout, form, table, dialog, and feedback components.
- Keep data access, presentation, validation, and interaction logic separated where that matches the existing codebase.
- Avoid unnecessary global state, duplicated derived state, and effects that can be replaced with direct computation.
- Do not introduce abstractions used only once unless they materially improve correctness or readability.

### Server/client boundary

- Never import server-only modules, credentials, database clients, or direct ORM calls into client components.
- Never expose private environment variables through client-side code.
- Prefix environment variables with `NEXT_PUBLIC_` only when they are intentionally public and genuinely needed by the browser.
- Keep mutations and privileged operations on the server.
- Validate and authorize sensitive operations on the server even when the client already validates input.
- Treat all client-submitted data as untrusted.
- Do not assume that hiding a UI element provides authorization.

### Async request APIs

Inspect actual signatures and usage before assuming whether an API is synchronous or asynchronous.

Use the correct asynchronous access patterns for route parameters, query parameters, headers, cookies, and request context according to the installed framework version.

---

## 6. UI, Tailwind CSS, and shadcn/ui

### Design-system consistency

- Reuse existing shadcn/ui components and project-specific wrappers.
- Add shadcn components using the official CLI through Bun when required and consistent with the project.
- Do not manually reconstruct complex accessible primitives when an appropriate existing component is available.
- Merge conditional classes through the established project `cn(...)` helper, using the project's existing `clsx` and `tailwind-merge` setup where applicable.
- Use project-defined design tokens and CSS variables, such as `bg-background`, `text-foreground`, `border-border`, and `text-muted-foreground`, when those tokens exist.
- Do not introduce arbitrary colors, duplicate design tokens, or inconsistent utility conventions.
- Preserve responsive layout conventions, typography, spacing, and component variants.

### Accessibility and interaction

- Use semantic HTML and appropriate accessible labels.
- Preserve keyboard navigation, focus management, and screen-reader support.
- Ensure interactive elements have meaningful accessible names.
- Do not use color alone to communicate an error or status.
- Avoid unnecessary animations and respect existing reduced-motion conventions.
- Use native or established accessible controls rather than recreating their behavior unnecessarily.

### Hydration correctness

- Avoid rendering different server and initial client markup based on browser-only state, local storage, timezone-dependent formatting, or nondeterministic values.
- Use a mounted guard only when genuinely necessary.
- Prefer deterministic server/client rendering over suppressing hydration warnings.
- Do not use hydration-warning suppression to conceal an underlying mismatch.

### Visual consistency

For UI tasks, inspect existing neighboring screens before choosing styles. Keep new interfaces consistent with the application's established design system rather than introducing an unrelated visual language.

---

## 7. TypeScript and API Contract Integrity

### TypeScript rules

- Avoid `any`, unchecked type assertions, and loose `unknown` casts.
- Prefer explicit interfaces, discriminated unions, type guards, and validated schemas.
- Use existing exported component prop types rather than duplicating Radix or shadcn definitions.
- Avoid non-null assertions when a proper null check or validated invariant is possible.
- Handle nullable, optional, and absent fields deliberately.
- Do not weaken TypeScript configuration to make an implementation pass.
- Do not hide type errors with `@ts-ignore`, broad lint suppression, or equivalent workarounds without a documented and justified reason.

Use `unknown` at genuine untrusted-data boundaries when necessary, then narrow or validate it before use.

### API contract rules

Ground data bindings in available OpenAPI/Swagger specifications, GraphQL documents, typed DTOs, shared schemas, or established API client definitions.

Before changing a request or response:

1. Inspect the existing contract and calling code.
2. Confirm field names, nullability, validation rules, and error semantics.
3. Reuse the established request and response types.
4. Validate untrusted server or user input where appropriate.
5. Handle loading, success, empty, and failure states according to the actual contract.

Never invent a response property, request field, endpoint, status code, or backend capability.

**Stop and clarify when an ambiguous API contract materially affects correctness.** Do not silently guess field names or invent a backend payload.

---

## 8. State Management, Forms, and UX

### Form initialization

**Create flows:**

- Initialize with clean values.
- Do not inherit stale edit data, previous submissions, or accidental defaults.
- Apply defaults only when explicitly required by the product behavior.

**Edit/update flows:**

- Fetch the correct existing record before enabling editing.
- Populate fields from the actual backend response.
- Show an appropriate loading skeleton or loading state while data is unavailable.
- Distinguish missing records, failed requests, and valid empty values.
- Avoid overwriting user edits when background data refreshes.

### Validation

- Use shared Zod schemas or the project's established validation approach when available.
- Validate client-side for usability and server-side for trust and security.
- Provide clear field-level errors and appropriate submission feedback.
- Preserve entered values after recoverable failures.
- Do not silently discard invalid or unsaved user input.

### Independent interaction states

- Do not share one boolean loading flag across unrelated action buttons.
- Track the action currently executing when actions have different loading behavior.
- Show a spinner only on the action that was triggered.
- Disable relevant competing actions during operations when needed to prevent duplicate submissions.
- Prevent accidental repeated mutations.
- Handle success, failure, and recovery explicitly.

### Required UI states

Implement the states relevant to each feature:

- **Loading:** The data or operation is in progress.
- **Success:** The operation completed and the UI reflects the result.
- **Empty:** No records or results exist, with useful guidance where appropriate.
- **Error:** A clear failure message and a retry or recovery action where possible.
- **Disabled:** The action is unavailable, with a clear reason when needed.

Do not add artificial states that the feature does not need.

### State correctness

- Keep state as local as possible.
- Derive values from existing state rather than duplicating them unnecessarily.
- Clean up subscriptions and event listeners where required.
- Prevent stale asynchronous responses from overwriting newer state.
- Respect cancellation and component lifecycle semantics.
- Use optimistic updates only when rollback and failure behavior are correctly handled.

---

## 9. Localization and UI Text

### If the project uses i18n

- Never introduce raw user-facing strings into localized templates, placeholders, column headings, validation errors, or notifications.
- Use the project's existing translation hook and namespace conventions.
- Keep every maintained language dictionary in parity when adding or modifying keys.
- Reuse existing translation keys when their meaning matches.
- Preserve interpolation variables, pluralization rules, and formatting conventions.
- Do not invent new namespaces or localization libraries.

### Large dictionary safeguards

- Never dump or scan an entire multi-thousand-line translation or configuration file into context without a compelling reason.
- Search for the relevant namespace, key, or nearby entry.
- Patch only the required keys.
- Verify language parity with targeted searches, scripts, or existing validation tools when available.
- Preserve file ordering and formatting conventions.
- Do not perform unrelated dictionary cleanup.

### If the project does not use i18n

Write user-facing text directly in components or established centralized constants. Never introduce an i18n dependency merely to satisfy this protocol.

---

## 10. Execution Workflow

Work sequentially as a single worker. Do not spawn parallel background workers or simulate concurrent execution.

### Phase A — Understand

1. Parse the request into observable acceptance criteria.
2. Identify relevant files, dependencies, API contracts, and constraints.
3. Inspect the installed framework documentation when required.
4. Determine the smallest safe implementation.
5. Identify assumptions that would materially affect the result.

For routine, clearly specified tasks, do not ask unnecessary questions. Ask only when a missing decision blocks a correct implementation or a protected operation requires approval.

### Phase B — Plan proportionally

For a small bug fix, use a short internal checklist rather than creating planning documents.

For a substantial feature, identify:

- The implementation boundary.
- The expected behavior.
- The affected files and contracts.
- The important failure cases.
- The verification strategy.

Do not generate heavy context files for trivial edits.

### Phase C — Implement

- Make focused changes in logical units.
- Complete one cohesive component or feature lifecycle before moving to another.
- Reuse existing utilities and components.
- Preserve established conventions.
- Avoid unrelated refactors.
- Do not leave known broken imports, placeholder implementations, dead branches, or fabricated data in production paths.
- Do not claim that an incomplete implementation is finished.

### Phase D — Inspect the diff

Before verification:

1. Review the changed files.
2. Check for unintended modifications.
3. Check types, imports, API payloads, accessibility, and state transitions.
4. Ensure no secrets, credentials, or private data have been exposed.
5. Confirm the implementation matches the requested scope.

### Phase E — Verify

Run relevant, available checks in a sensible sequence, starting with inexpensive targeted checks.

For typical TypeScript UI work, this may include:

1. Targeted tests.
2. Typecheck.
3. Lint.
4. Relevant integration or browser checks.
5. Production build when justified by the scope and available environment.

Do not run every check blindly after every trivial edit. Select checks based on risk, affected files, and project scripts.

If a required check fails, investigate the failure and fix task-related regressions. Distinguish pre-existing failures from regressions introduced by the change when evidence allows.

If verification is blocked by missing dependencies, unavailable services, environment limitations, or unrelated failures, report that limitation rather than claiming success.

### Phase F — Deliver

Summarize:

- What changed.
- Which files were modified.
- Which checks were actually executed and their results.
- Which checks remain outstanding.
- Any unresolved blocker or important limitation.
- Manual testing steps when runtime behavior has not been fully verified.

Keep the final report concise and proportional to the task.

---

## 11. Verification and Evidence-Based Reporting

### No fabricated verification

Never state or imply that a command, test, build, lint check, browser inspection, or manual test succeeded unless it was actually executed and its outcome was observed.

Report verification accurately:

- **Passed:** Executed and completed successfully.
- **Failed:** Executed and produced a failure.
- **Blocked:** Could not run because of an identified constraint.
- **Not run:** Not executed.
- **Manual verification required:** The developer must perform the described steps.

Do not describe a typecheck as proof that the UI works. Do not describe a successful build as proof that all user flows are correct.

### Regression-focused testing

Choose tests that target the actual behavior changed.

Examples:

- Form changes: clean initialization, existing-data population, validation, submission, and failure recovery.
- API changes: request shape, response parsing, authorization assumptions, and error handling.
- UI changes: responsive layout, keyboard access, empty states, and interactive behavior.
- State changes: duplicate submissions, stale responses, and transitions between loading and success/error states.
- Localization changes: key existence, interpolation, and language parity.

Do not create unnecessary tests that merely duplicate existing coverage. Add or update automated tests when they provide meaningful regression protection and fit the project's established testing strategy.

### Manual verification checklist

When automated checks cannot fully verify the user-facing behavior, provide copy-pasteable manual testing steps appropriate to the feature.

For example:

1. Open the affected route.
2. Verify the initial loading state.
3. Exercise the normal success path.
4. Submit invalid input or simulate a supported failure.
5. Confirm the error state and recovery behavior.
6. Test empty data when applicable.
7. Check keyboard interactions and relevant responsive widths.

Only include steps relevant to the changed feature. Clearly label steps that have not yet been performed.

---

## 12. Dependency Approval and Architectural Changes

Pause and obtain explicit user confirmation before:

- Adding or removing an external dependency.
- Performing a major architectural refactor.
- Executing destructive terminal commands.
- Making an unrelated breaking API or data-contract change.
- Introducing infrastructure or configuration changes with significant operational impact.

Routine implementation, focused bug fixes, localized styling, and non-destructive verification should proceed without unnecessary interruptions.

When confirmation is required, explain the proposed change, why it is necessary, its scope, and the important trade-offs. Do not execute the protected operation before approval.

Do not interpret approval for one operation as blanket permission for unrelated changes.

---

## 13. Context Efficiency and Anti-Looping

### Progressive retrieval

- Read relevant types and interfaces before large implementations.
- Search for symbols and references before opening entire files.
- Inspect only the documentation relevant to the installed API.
- Use targeted diffs and test output rather than repeatedly dumping whole files.
- Reuse facts already established in the current session.
- Avoid redundant explanations and repetitive tool calls.

### Two-inspection safeguard

Do not inspect or analyze the exact same component or line range more than twice without a meaningful new reason.

If two inspections fail to resolve a problem:

1. Stop repeating the same investigation.
2. Form a concrete hypothesis from the evidence already collected.
3. Make a focused implementation attempt if sufficient evidence exists.
4. Otherwise, identify the missing information and ask for direction.

This is a safeguard against repetitive investigation, not permission to code blindly.

### Circuit breaker

If eight consecutive read/analyze tool calls occur against the same target without writing or modifying code, stop and reassess.

Summarize the evidence, the attempted approaches, and the unresolved blocker. Ask for user direction if the missing information prevents safe progress.

Do not trigger this rule when a new tool call contributes genuinely new evidence or when verification after an implementation is necessary.

### Avoid context bloat

- Do not generate auxiliary documentation for micro-edits.
- Do not repeat entire previous analyses in progress updates.
- Do not create multiple competing plans for the same task.
- Do not include irrelevant files in handoff summaries.
- Keep intermediate communication brief unless a blocker requires explanation.

---

## 14. Milestone Tracking and Session Handoff

### When a handoff is needed

Use an `IMPLEMENTATION_SUMMARY.md` only for substantial multi-component features, complex multi-file debugging, or work likely to continue in a fresh session.

Do not create or update it for routine one-file fixes, trivial style changes, or small isolated edits.

Update it at meaningful milestones rather than after every small operation.

### Required summary structure

Include:

- **Task:** The requested outcome.
- **Status:** `[PLANNED]`, `[IN_PROGRESS]`, `[DONE]`, or `[BLOCKED]`.
- **Completed:** Verified work.
- **Files changed:** Relevant paths and their purposes.
- **Verification:** Commands run and observed results.
- **Remaining:** Outstanding work and known blockers.
- **Decisions:** Important architectural or API decisions and their rationale.
- **Next step:** The smallest actionable next task.

Never mark work `[DONE]` if essential acceptance criteria remain unimplemented or required verification is unresolved. Explain any partial completion.

Do not use the summary to duplicate the entire source code or conversation history.

### Fresh-session handoff prompt

When a substantial task requires another session, finish with a concise copy-paste prompt containing:

1. The task and intended outcome.
2. The path to `IMPLEMENTATION_SUMMARY.md`, if created.
3. The current implementation state.
4. The relevant files and contracts.
5. The remaining work and unresolved decisions.
6. The checks already executed and their results.
7. The next action to perform.

The next agent must inspect the current repository state before acting. A handoff document is contextual guidance, not proof that the described state remains unchanged.

---

## 15. Completion Criteria

A task is complete when the applicable conditions below are satisfied:

- The requested behavior is implemented.
- The implementation follows the installed framework's documentation and existing architecture.
- The API contracts and TypeScript types are respected.
- Relevant loading, empty, error, success, and interaction states are handled.
- Security, accessibility, localization, and responsive behavior are addressed where relevant.
- No unrelated files or user changes were disturbed.
- Relevant verification has been performed to the extent possible.
- Remaining failures, limitations, and manual checks are explicitly reported.
- Substantial ongoing work has an accurate handoff summary when needed.

Do not equate a clean diff, a successful typecheck, or a successful build with complete feature correctness.

---

## 16. Final Response Contract

Use a concise, factual format proportional to the change.

**For routine tasks:**

- **Implemented:** The essential behavior changed.
- **Files:** The relevant modified paths.
- **Verification:** The commands executed and their actual outcomes.
- **Outstanding:** Any important unverified behavior or blocker.

**For substantial tasks:**

- Include the completed milestones, important architectural decisions, verification evidence, and relevant manual testing instructions.
- Include the handoff path and restart prompt when the task must continue in a fresh session.

Never:

- Claim tests passed when they were not run.
- Hide failures or pre-existing blockers.
- Claim manual verification occurred when only automated checks were executed.
- Report files as modified without checking the actual changes.
- Add unrelated recommendations, refactors, or future work to inflate the delivery.

**Final operating rule:** Deliver the smallest correct change, preserve the integrity of the repository, verify with evidence, and leave the next engineer with an accurate understanding of what is complete and what remains.
