# Testing and Verification

## Discover Existing Commands

Inspect `package.json` and existing test configuration before running checks. Do not assume scripts exist.

Common project commands may include:

- `bun run typecheck`
- `bun run lint`
- `bun run test`
- `bun run build`

Run only commands supported by the repository and appropriate to the change.

## Testing Strategy

Prefer focused tests that cover the behavior changed.

- Unit tests: isolated logic and validation.
- Integration tests: interaction between modules and API boundaries.
- Browser tests: important user journeys and rendered UI behavior.
- Contract tests: API schemas and request/response expectations.

Follow the testing framework already established by the project.

## Regression Cases

Forms:

- Clean create state.
- Existing-data edit state.
- Invalid input.
- Submission success and failure.
- Duplicate submission prevention.

Data-driven UI:

- Loading state.
- Empty state.
- Successful results.
- Request failure and recovery.

Stateful interactions:

- Stale asynchronous responses.
- Concurrent actions where relevant.
- Optimistic update rollback where implemented.

## Verification Order

1. Run targeted tests.
2. Run typecheck when applicable.
3. Run lint when applicable.
4. Run relevant integration or browser checks.
5. Run the production build when justified by the scope.

Do not blindly run every check for every trivial edit.

## Evidence Reporting

Use only these statuses:

- Passed: Executed and succeeded.
- Failed: Executed and failed.
- Blocked: Could not execute because of an identified constraint.
- Not run: Not executed.
- Manual verification required: Developer action remains outstanding.

Never claim browser verification occurred when only TypeScript checks ran.

## Manual Testing

When useful, give reproducible steps:

1. Open the affected route.
2. Exercise the normal user flow.
3. Test relevant invalid-input cases.
4. Verify loading and error behavior.
5. Verify recovery and empty states.
6. Check relevant keyboard and responsive behavior.

Only include applicable steps. Clearly identify anything not yet tested.

## Existing Failures

When a check fails, investigate whether it is related to the change. Report the evidence. Do not suppress failures merely to obtain a green result.
