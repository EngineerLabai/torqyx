# SEO H1 Standard

## Rule

- Every route must render exactly one `<h1>` in the final HTML.
- Preferred: define the `<h1>` directly in `page.tsx`.
- If `<h1>` is rendered inside a child component, annotate the page with this comment:

```tsx
/* seo-h1: delegated-to-child */
```

## Review checklist

- `page.tsx` has one `<h1>`, or
- page contains `/* seo-h1: delegated-to-child */` and child component has one `<h1>`.

## Audit

Run:

```bash
node scripts/audit-seo-pages.mjs
```

Then inspect:

`artifacts/seo-audit.json`
