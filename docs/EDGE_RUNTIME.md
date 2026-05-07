**Edge Runtime Audit**

- **Files using Edge runtime**:
  - `app/og/route.tsx` — exports `runtime = "edge"` and uses `next/og`'s `ImageResponse`.

- **Why it's Edge**:
  - `next/og` and `ImageResponse` require Edge runtime to render Open Graph images at request time. The handler returns an `ImageResponse` from a server function.

- **Implications**:
  - Runs on V8/edge runtime (not Node.js). Some Node APIs (fs, child_process) are unavailable.
  - Cold-starts and per-request CPU time can affect performance if images are generated frequently.
  - Depending on hosting, outbound network calls from edge functions may be restricted or have different latency.

- **Recommendations (in order)**:
  1. Add caching headers for the OG image responses to reduce repeated regeneration. Example in `GET` handler:
     ```ts
     return new ImageResponse(..., size, {
       headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' }
     })
     ```
     (Adjust `max-age` to your needs.)

  2. If OG images are stable for known pages, consider pre-generating images at build time and serving from `/public/og/` to avoid runtime work.

  3. Monitor invocation frequency and CPU time in your hosting provider to ensure edge generation is cost-effective.

  4. Ensure any secrets used by edge handlers are available via secure runtime env bindings (Vercel Environment Variables) and not baked into client bundles.

  5. If you need SSR-like features but want Node APIs, migrate the handler to a server function (Node) and pre-generate images with a build-time script.

- **Next actions I can take**:
  - Add cache headers to `app/og/route.tsx` and run a build to validate.
  - Implement a build script to pre-generate OG images for a set of routes.
  - Add runtime checks and telemetry (simple logging) around OG generation frequency.

If you want me to proceed, say which option: (A) add cache headers to the existing edge handler and run `npm run build`, (B) implement a pre-generation build script for OG images, or (C) skip and continue to the next task on the list.