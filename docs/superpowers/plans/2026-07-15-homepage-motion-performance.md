# Homepage Motion Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the approved homepage motion optimization with descriptive company links, stable hero CTA contrast, and a clean lint/type/build baseline.

**Architecture:** A reusable asynchronous `LazyMotion` provider loads `domAnimation` after hydration, while homepage and globally mounted homepage components import lightweight `m` elements from `framer-motion/m`. Native pointer events preserve carousel swipe behavior without `domMax`; animated media and content layers are separated so hero CTA contrast never inherits a background crossfade.

**Tech Stack:** Next.js 16.2.10, React 19.2, TypeScript 5, Framer Motion 12.38, Tailwind CSS 4, ESLint 9.

## Global Constraints

- Preserve the existing page structure, brand styling, controls, swipe behavior, and high-value motion.
- Scope motion migration to modules mounted by the homepage, including global header/navigation and cookie consent modules that enter the homepage client graph.
- Use visible `Explore {company name}` labels for the eight company cards.
- Preserve keyboard controls, focus indicators, touch targets, and `prefers-reduced-motion` behavior.
- Exclude `.agents`, `.artifacts`, `.claude`, `.impeccable.md`, `.junie`, and `skills-lock.json` from release commits.

---

### Task 1: Establish Motion Boundary and Focused Red Checks

**Files:**
- Create: `src/components/motion/lazy-motion-provider.tsx`
- Create: `src/lib/motion-features.ts`
- Create: `scripts/verify-homepage-quality.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `LazyMotionProvider({ children }: PropsWithChildren): ReactElement`
- Produces: default asynchronous `domAnimation` feature bundle.
- Produces: `npm run verify:homepage` source-level regression check.

- [ ] **Step 1: Add a source verification script that fails while generic links, full `motion` imports, or missing contrast-safe CTA classes remain**

The script reads the homepage-mounted source files, asserts there is no `Learn More` company CTA, asserts migrated modules do not import `{ motion }` from `framer-motion`, asserts `LazyMotion` uses `strict`, and asserts the hero CTA does not sit inside a parent opacity transition.

- [ ] **Step 2: Run the focused check and confirm RED**

Run: `npm.cmd run verify:homepage`
Expected: non-zero exit identifying generic links and missing lazy-motion architecture.

- [ ] **Step 3: Add the asynchronous feature module and provider**

`motion-features.ts` default-exports `domAnimation`. `lazy-motion-provider.tsx` imports `LazyMotion`, defines `loadFeatures = () => import("@/lib/motion-features").then(({ default: features }) => features)`, and renders `<LazyMotion features={loadFeatures} strict>{children}</LazyMotion>`.

- [ ] **Step 4: Add `verify:homepage` to `package.json` and run TypeScript**

Run: `npx.cmd tsc --noEmit`
Expected: exit 0.

### Task 2: Preserve Homepage UX with Lightweight Motion

**Files:**
- Modify: `src/app/home-client.tsx`
- Modify: `src/components/home-hero.tsx`
- Modify: `src/components/companies-carousel.tsx`
- Modify: `src/components/featured-company.tsx`
- Modify: `src/components/cta-carousel.tsx`

**Interfaces:**
- Consumes: `LazyMotionProvider` from Task 1.
- Produces: the same public component props currently used by the homepage.

- [ ] **Step 1: Wrap homepage content in one strict lazy-motion boundary**

Import `LazyMotionProvider` and place it around the homepage fragment. Replace homepage `motion.*` elements with `m.*` imported from `framer-motion/m`; keep `AnimatePresence` only where exit orchestration is meaningful.

- [ ] **Step 2: Migrate hero motion and isolate CTA contrast**

Replace full `motion` elements with `m`. Keep background crossfades on their own absolute media layer. Do not apply opacity animation to the CTA container or any ancestor shared by the CTA; use transform-only CTA movement and a solid `bg-primary text-primary-foreground hover:bg-[#511010]` surface. Keep title/description orchestration and the YouTube facade.

- [ ] **Step 3: Replace carousel pan features with pointer swipe detection**

Track pointer-down X in a ref, compare it on pointer-up, and call the existing previous/next handlers at the 50px threshold. Add `touch-pan-y` so vertical page scrolling remains native. Keep the spring track animation through `m.div` and preserve buttons/dots.

- [ ] **Step 4: Migrate featured sections and CTA carousel to `m`**

Retain entrance/exit timing, switch to exponential ease-out curves where explicit timing exists, and ensure animations remain transform/opacity-only.

- [ ] **Step 5: Run the focused source check**

Run: `npm.cmd run verify:homepage`
Expected: exit 0.

### Task 3: Migrate Homepage-Global Motion Modules

**Files:**
- Modify: `src/components/layout/header.tsx`
- Modify: `src/components/ui/navbar-menu.tsx`
- Modify: `src/components/cookie-consent.tsx`

**Interfaces:**
- Consumes: `LazyMotionProvider` from Task 1.
- Produces: unchanged `Header`, navbar-menu, and `CookieConsent` public APIs.

- [ ] **Step 1: Wrap Header and CookieConsent motion trees**

Wrap each independent globally mounted tree in `LazyMotionProvider`; migrate descendants from `motion.*` to `m.*`. Navbar-menu inherits the Header boundary and imports lightweight `m` elements.

- [ ] **Step 2: Fix render-created feed icons**

Replace `const Icon = getFeedIcon(...)` with a module-level `FeedIcon` component whose switch returns the correct icon element. This gives React a stable component identity.

- [ ] **Step 3: Fix cookie visibility initialization without synchronous effect state**

Keep the hydration-safe false initial state, read storage in the effect, schedule `setVisible(true)` through `requestAnimationFrame`, and cancel the frame during cleanup.

- [ ] **Step 4: Run ESLint on the migrated modules**

Run: `npx.cmd eslint src/components/layout/header.tsx src/components/ui/navbar-menu.tsx src/components/cookie-consent.tsx`
Expected: exit 0 with no warnings.

### Task 4: Resolve Accessibility Copy and Repository Lint Findings

**Files:**
- Modify: `src/components/companies-carousel.tsx`
- Modify: `src/app/companies/companies-client.tsx`
- Modify: `src/app/companies/[slug]/company-client.tsx`
- Modify: `src/app/contact/contact-client.tsx`
- Modify: `src/app/home-client.tsx`
- Modify: `src/components/featured-company.tsx`
- Modify: `src/components/layout/map-section.tsx`

**Interfaces:**
- Produces: unique visible company link labels and zero ESLint findings.

- [ ] **Step 1: Replace generic company CTAs**

Render `Explore {company.name}` in both company-card implementations and remove the hidden-name workaround and generic comments.

- [ ] **Step 2: Remove effect-derived carousel state**

Clamp `currentIndex` when calculating the rendered index and update it inside the resize callback only when the new card count changes the maximum. Remove the synchronous state-setting effect.

- [ ] **Step 3: Clear deterministic lint findings**

Remove unused imports/variables/parameters, use the provided `ctaText` prop, change the hero embed URL binding to `const`, remove the unused map variant, and encode JSX apostrophes/quotes in the company detail copy.

- [ ] **Step 4: Run full lint and type checking**

Run: `npm.cmd run lint`
Expected: exit 0 with zero errors and zero warnings.

Run: `npx.cmd tsc --noEmit`
Expected: exit 0.

### Task 5: Production and Browser Verification

**Files:**
- Verify only; modify scoped files only if a verified regression is found.

- [ ] **Step 1: Run production build**

Run: `npm.cmd run build`
Expected: optimized build, TypeScript, and all static routes complete with exit 0.

- [ ] **Step 2: Inspect generated chunks**

Compare generated homepage-related chunk sizes and search for asynchronously split motion feature code. Record evidence without claiming a synthetic Lighthouse score that was not rerun.

- [ ] **Step 3: Browser-check desktop and mobile**

Verify hero autoplay/manual navigation, stable CTA surface during crossfade, YouTube facade activation, company arrow/dot/swipe navigation, CTA carousel, mobile overflow, keyboard focus, and reduced-motion emulation.

- [ ] **Step 4: Re-run all release gates after browser fixes**

Run: `npm.cmd run verify:homepage`, `npm.cmd run lint`, `npx.cmd tsc --noEmit`, and `npm.cmd run build`.
Expected: all exit 0.

### Task 6: Commit and Push Staging

**Files:**
- Stage only intended tracked source/config/docs/script files.

- [ ] **Step 1: Refresh remote staging and verify divergence**

Run: `git fetch origin staging`, then compare `HEAD` and `origin/staging`.
Expected: no remote-only commits, or resolve safely before push.

- [ ] **Step 2: Review staged diff and commit**

Exclude local tooling artifacts. Commit the validated implementation with a concise performance/accessibility message.

- [ ] **Step 3: Push normally**

Run: `git push origin staging`.
Expected: fast-forward update; never force-push.

- [ ] **Step 4: Verify final pointers and clean intended state**

Confirm `HEAD`, `staging`, and `origin/staging` match, while excluded local tooling files remain untracked.
