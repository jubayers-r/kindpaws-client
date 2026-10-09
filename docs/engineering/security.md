# Application Security Standards

## Secrets

- Never read or print secret values from `.env`, `.env.local`, or secret managers.
- Reference environment variables by name in code.
- Never expose private server environment variables to client modules.
- Use `NEXT_PUBLIC_` only for values intentionally exposed to the browser.
- Never commit credentials, access tokens, private keys, or sensitive production data.

## Authorization

- Enforce authorization on the server for protected operations.
- Verify tenant and resource ownership where applicable.
- Do not trust client-supplied user IDs, roles, permissions, or resource ownership.
- Hiding a button or route is not an authorization mechanism.

## Input Validation

- Treat browser input, URL parameters, uploaded data, and external API responses as untrusted.
- Validate security-sensitive inputs on the server.
- Reuse established schemas.
- Avoid unsafe dynamic SQL, shell execution, and unvalidated path construction.

## Server and Client Boundaries

- Keep database clients, secrets, and privileged services out of client bundles.
- Use the existing server-side mutation and API patterns.
- Return only the data required by the client.
- Do not expose internal errors or sensitive implementation details.

## External Services

- Set appropriate timeouts and bounded retries.
- Validate external responses.
- Avoid logging credentials or sensitive payloads.
- Apply rate limits and abuse controls where relevant.

## Sensitive Data

- Minimize the collection and retention of sensitive information.
- Redact sensitive data from logs, traces, and error reports.
- Never use real customer secrets or private production records in test fixtures.

## Change Safety

- Do not execute destructive commands without explicit confirmation.
- Preserve existing user modifications.
- Obtain approval before major architectural changes or external dependency changes.
