# Frontend Engineering Standards

## Framework

- Follow the installed Next.js documentation.
- Prefer Server Components unless client-side capabilities are required.
- Keep client components small and focused.
- Preserve existing routing, loading, error, metadata, and caching conventions.

## UI Components

- Reuse existing shadcn/ui components and project wrappers.
- Add components through the official CLI using Bun when necessary.
- Use the project's `cn()` helper for conditional class merging.
- Use existing Tailwind design tokens and CSS variables.
- Do not introduce arbitrary colors or a competing design system.

## TypeScript

- Avoid `any` and unchecked type assertions.
- Reuse exported component prop types.
- Handle null, undefined, and failed requests explicitly.
- Validate untrusted data at runtime where necessary.

## Forms

Create flow:

- Start with clean values.
- Do not inherit stale edit state.

Edit flow:

- Load existing backend data before enabling editing.
- Show an appropriate loading state.
- Distinguish loading, missing records, and errors.
- Avoid overwriting unsaved user edits.

Validation:

- Use existing shared schemas where available.
- Validate on the server for security-sensitive operations.
- Show useful field-level errors.
- Preserve input after recoverable failures.

## Interaction States

Implement the relevant states:

- Loading.
- Success.
- Empty.
- Error and recovery.
- Disabled actions.

Keep loading states independent for unrelated actions. Prevent duplicate mutations where necessary.

## Accessibility

- Use semantic HTML.
- Provide accessible labels.
- Preserve keyboard navigation and focus behavior.
- Do not communicate status through color alone.
- Respect reduced-motion preferences where applicable.

## Responsive Design

Follow existing breakpoints and layout patterns. Verify relevant mobile and desktop widths for meaningful UI changes.

## Localization

If i18n exists:

- Use established translation hooks.
- Keep language dictionaries in parity.
- Preserve interpolation and pluralization.
- Patch only the relevant keys in large dictionaries.

If i18n does not exist, do not introduce it without an explicit requirement.
