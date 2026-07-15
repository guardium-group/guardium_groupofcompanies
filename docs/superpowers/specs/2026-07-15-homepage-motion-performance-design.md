# Homepage Motion Performance Design

## Objective

Preserve the homepage's polished transitions and interaction quality while reducing the initial JavaScript and main-thread cost attributed to Framer Motion. The same release also resolves the current lint/type-check failures, replaces generic company link names, and prevents hero-transition snapshots from producing misleading contrast failures.

## Scope

- Apply the motion optimization to the homepage and the components it mounts: the hero, company carousel, featured-company sections, Guardium Advantage section, FAQ entrance, and CTA carousel.
- Preserve the existing page structure, brand styling, carousel controls, swipe behavior, and visual timing unless a timing change is required to prevent concurrent main-thread work.
- Fix every repository lint error and TypeScript/build failure encountered during final verification, including existing errors in files already within the release change set.
- Leave unrelated routes and local tooling artifacts outside the release commit.

## Motion Architecture

The homepage will own one strict `LazyMotion` boundary. Animated homepage components will use Framer Motion's lightweight `m` elements rather than the full `motion` proxy. Features will load asynchronously so the animation engine is not part of the critical initial module graph.

Meaningful motion remains in Framer Motion: hero content transitions, carousel track movement, CTA slide transitions, and coordinated section entrances. Simple ambient effects such as hover transforms, color transitions, and continuously moving logo presentation remain CSS-driven. Below-fold entrances activate only when their section enters the viewport, and all motion respects `prefers-reduced-motion`.

If pan gestures require the heavier feature bundle, the company carousel will use pointer/touch swipe detection while Framer Motion continues to animate the resulting track position. This preserves touch UX without loading drag/pan machinery for the entire homepage.

## Accessibility and SEO

The eight company carousel links will use visible, destination-specific copy in the form `Explore {company name}`. This removes the literal generic phrase Lighthouse flags and gives every link a unique accessible name without relying on visually hidden text.

Hero background media may crossfade, but the readable content layer and CTA surface will not inherit transient opacity from that background transition. CTA text remains high-contrast against its solid brand-red surface throughout every animation frame. Focus styles, keyboard controls, descriptive carousel labels, and minimum touch targets remain intact.

Reduced-motion users receive immediate state changes or restrained opacity transitions without continuous or spatially large movement.

## Lint and Type Safety

Each reported lint failure will be resolved at its source:

- Remove unused imports, variables, and callback parameters.
- Escape JSX punctuation where required.
- Replace synchronous effect-derived state updates with initialization, event callbacks, or derived/clamped render values.
- Move dynamically selected component references out of render-time component creation patterns.
- Correct constness and other deterministic static-analysis findings.

The production build remains the authoritative TypeScript check because the Next.js build runs TypeScript for this repository. A direct `tsc --noEmit` run will also be used when compatible with the project configuration.

## Verification

- Establish failing lint and focused source/performance checks before implementation.
- Verify descriptive link copy and the absence of generic `Learn More` company links.
- Verify homepage files use the strict lazy motion boundary and do not import the full `motion` proxy.
- Run ESLint with zero errors and zero warnings.
- Run TypeScript checking and the production Next.js build.
- Inspect the built client chunks to confirm the motion engine is split from the critical homepage module graph where supported by the bundler output.
- Browser-check desktop and mobile homepage behavior, carousel swipe/navigation, hero transitions, reduced motion, and static CTA contrast.

## Success Criteria

The homepage retains its current high-value animation and interaction cues, but avoids eagerly mounting the full Framer Motion engine across every homepage section. All company links are visibly descriptive, the hero CTA maintains static-state contrast throughout transitions, lint and type checks are clean, the production build passes, and only intended project files are committed and pushed to `staging`.
