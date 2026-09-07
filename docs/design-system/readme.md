# Mohamed Weli Jama — Developer Portfolio Design System

A dark-first, technology-forward design system for **Mohamed Weli Jama**, a software and web
developer in Hargeisa. It covers two surfaces: the **public portfolio** (homepage, about, skills,
projects and case studies, services, experience, achievements, blog, contact) and the **private
admin dashboard** (project CMS, technology management, content management, messages, settings).

Positioning line: *a passionate Software Developer and Web Developer building practical digital
solutions.* Mission, used verbatim: **"My mission is to digitalize our Country."**

---

## Sources I was given

| Source | What it contained | How it was used |
| --- | --- | --- |
| `uploads/ChatGPT Image Sep 4, 2026, 10_22_24 AM.png` | The MWJ monogram lockup — mark, wordmark, "SOFTWARE DEVELOPER & WEB DEVELOPER", `</>` ornament, mission line. Raster, 1248×1248, on near-black. | Copied to `assets/logo-lockup.png`. Sole source of the brand mark, the `</>` motif, the tracked-uppercase treatment and the metallic-white/blue pairing. |
| `uploads/download.webp`, `download (1).webp`, `download (2).webp` | Flat colour swatches labelled `#0A84FF`, `#00C3FF`, `#0066FF`. | Copied to `assets/swatch-*.webp`. Confirmed the brand blues. |
| Written brief | The nine-colour palette, the surface list, the key-areas list, the mission. | Drove `tokens/colors.css` verbatim and the two UI kits' scope. |

**No codebase, Figma file, screenshots of a real product, slide deck, or font binaries were
supplied.** Everything below the palette — the type pairing, spacing scale, component inventory
and both UI kits — is authored from the brief and the logo, not recreated from an existing product.
Content in the UI kits (project names, clients, metrics, blog posts) is **placeholder copy written
in the brand's voice** and must be replaced with real work.

---

## Components

Grouped by concern under `components/`. Every component is a self-contained `.jsx` reading
CSS custom properties, with a sibling `.d.ts` (props contract) and `.prompt.md` (usage).

**`components/core/`** — `Icon`, `Button`, `IconButton`, `Badge`, `Tag`, `Card` (+ `CardHeader`),
`Avatar`, `Logo`, `Divider`, `SectionHeading`

**`components/forms/`** — `Input` (+ `Textarea`), `Select`, `Checkbox` (+ `Radio`, `Switch`)

**`components/navigation/`** — `Navbar`, `SidebarNav`, `Tabs`, `Breadcrumbs` (+ `Pagination`), `Footer`

**`components/feedback/`** — `Alert` (+ `Toast`), `Modal`, `Tooltip`, `ProgressBar` (+ `Skeleton`), `EmptyState`

**`components/data/`** — `Table`, `StatCard`, `ProjectCard`, `Timeline`, `SkillMeter`

### Intentional additions
No source defined a component inventory, so this is an authored standard set sized to the brief's
key areas. Four entries go beyond a generic set because the brief names them explicitly:

- `SectionHeading` — the numbered-eyebrow section opener the public site repeats eight times.
- `ProjectCard` — the project gallery tile, the brief's stated main focus.
- `Timeline` — experience, education and achievements.
- `SkillMeter` — the skills-and-technologies section.
- `Icon` — a wrapper over Lucide so no page hand-rolls SVG (see Iconography).

---

## Content fundamentals

**Voice.** First person, past-tense-about-work, present-tense-about-intent. Mohamed speaks as
"I"; the visitor is "you". Plain, declarative, slightly understated — the confidence comes from
specifics, not adjectives. No hype words ("cutting-edge", "passionate about leveraging"),
no exclamation marks.

- Hero: *"Software that actually ships — and gets used."*
- About: *"I care about two things more than anything else: that the thing gets shipped, and that it still works six months after I hand it over."*
- Service: *"Paper intake, spreadsheet tracking, WhatsApp order books — mapped, then replaced with something auditable."*

**Specificity is the house style.** Every claim carries a number or a named constraint.
"Reduced support load" becomes "Support calls −62%". "Fast" becomes "median user is on a shared
3G connection". Skill percentages are framed honestly: *"Percentages reflect how much of my
shipped work leans on each — not a self-assessment."*

**Casing.**
- Sentence case for headings, buttons, labels in prose. *"Selected work"*, not *"Selected Work"*.
- UPPERCASE + `0.22em` tracking, monospace, for eyebrows, table headers, sidebar group labels,
  stat labels and meta. This is the logo's typographic signature carried into the UI.
- The mission line is the one string always set in full tracked uppercase, never paraphrased,
  never sentence-cased, never translated.

**Microcopy.** Buttons name the outcome: "View selected work", "Download résumé", "Send message",
"Save changes", "Delete project" — never "Submit", "Click here" or "Learn more". Empty states
always end in an action. Errors state the rule, not the failure: *"Slug cannot contain spaces."*
Timestamps are relative up to a week ("2 hours ago"), absolute after ("12 Aug 2026").

**Numbers & units.** Monospace for anything countable — metrics, percentages, dates, versions,
slugs, file paths. Body font for prose. Thousands separated with a comma. Deltas signed (`+12.4%`,
`-8%`).

**Emoji: never.** The only decorative glyph in the system is `</>`, taken from the logo, at most
once per view. Unicode arrows are not used as icons — Lucide covers that.

---

## Visual foundations

**Colour.** Three brand blues and three near-blacks, and almost nothing else. `#0A84FF` primary
(CTAs, active states), `#00C2FF` accent (focus, glow, small highlights, links on hover), `#0066FF`
deep (gradient start, light-theme links). Backgrounds step `#05070B` base → `#0B111A` surface →
`#111A27` card → `#16202F` hover; the neutral ramp is blue-shifted slate so nothing reads warm.
Semantic colours are used only for status: `#22D39A`, `#FFB020`, `#FF4D5E`, `#00C2FF`, each with a
12%-alpha surface. Two background colours per view, maximum. Never a hardcoded hex in a component —
always a semantic alias, which is what makes `data-theme="light"` work.

**Gradients.** Exactly three, all defined as tokens. `--gradient-brand` (135°, deep → primary →
accent) on primary buttons, active markers, checked controls and progress fills. `--gradient-text`
on one accent phrase per headline — never a whole heading. `--gradient-hero-glow`, a soft radial
from the top edge, on the hero and the sign-in screen only. No bluish-purple gradients; the ramp
never leaves blue/cyan.

**Type.** `Space Grotesk` display (700, `-0.03em`) / `Manrope` body (400–600) / `JetBrains Mono`
(technical voice). Display for headings and numbers; body 16/1.5 for UI, 18/1.7 for prose at a
640px measure; mono for tags, metrics, table headers, eyebrows and code. 12px floor. Hero is
`clamp(44px, 7vw, 92px)`.

**Backgrounds & texture.** No photography, no illustration, no stock imagery — nothing was
supplied and none is invented. Two textures only: a 28px blueprint grid at
`rgba(30,41,59,.55)`, radially masked so it fades out, and the hero glow. Image slots that have
no asset show the grid plus a mono `SCREENSHOT` label — the placeholder is deliberate and should
stay until real captures exist. Imagery, when added, should be cool-toned, blue-shifted, no grain.

**Spacing & layout.** 4px grid, `--space-1` (4) → `--space-14` (160). 1240px max width, 24px
gutters, 24px card gaps, `clamp(64px, 10vw, 128px)` section padding. Nav 72px and sticky; admin
sidebar 264px, collapsing to a 72px icon rail. Breakpoints 480 / 768 / 1024 / 1280 / 1536: three
project columns at desktop, two at tablet, one at mobile; the admin sidebar becomes an overlay
below 1024. Sibling groups are laid out with flex/grid + `gap`, never margins.

**Corners & borders.** 4 / 6 / 10 / 14 / 20 / 28 / pill. Inputs and buttons 10px, cards 14px,
modals 20px, badges and switches pill. Every border is 1px, `#1E293B` at rest, `#334155` when
raised or hovered, `rgba(10,132,255,.45)` when brand-active. No coloured left-border accent bars —
active state is a 2px gradient marker, an inset tint, or an underline.

**Cards.** `#111A27` fill, 1px `#1E293B` hairline, 14px radius, `--shadow-sm` plus
`inset 0 1px 0 rgba(248,250,252,.06)` — the inset hairline is what makes them read as glass
rather than flat panels. `interactive` cards lift `translateY(-3px)`, swap the hairline to brand
blue and deepen to `--shadow-lg`. Card shadows never stack; nest with `padding="none"` and a
divider instead.

**Shadows & glow.** Two systems. Shadows are cool (`rgba(2,6,16,…)`), low-opacity, generous blur,
negative spread — depth, not drop shadow. Glow is brand-coloured and reserved: primary buttons,
focus rings, the active nav marker, one featured card, the sign-in card. Glow on more than two
elements per view flattens the hierarchy.

**Animation.** 140ms for tints and icon colour, 220ms for lifts and borders, 380ms for modal
rise, 640ms for progress fills. `cubic-bezier(.2,.6,.2,1)` is the standard curve;
`cubic-bezier(.16,1,.3,1)` for entrances; the spring curve is used only on the switch knob.
Fades and short rises — no bounces on layout, no parallax, no scroll-jacking, no looping
ambient motion. `prefers-reduced-motion` collapses everything to ~0ms.

**States.**
- *Hover:* lift 2px + brighter surface + hairline strengthens. Ghost buttons pick up a surface tint. Links go primary → accent.
- *Press:* `scale(.985)`, no colour change.
- *Focus:* never removed — a 2px background offset plus a 2px `#00C2FF` ring. Inputs use a brand border plus a 3px 18%-alpha halo.
- *Active/selected:* 2px gradient marker (nav, tabs, sidebar, message list) plus a 12%-alpha brand tint.
- *Disabled:* opacity 0.45, `not-allowed`, no colour change.

**Transparency & blur.** Sparingly, and only where something scrolls beneath: the sticky navbar
(78% base + 16px blur, transparent until scrolled), modal overlays (72% base + 16px blur), and
toasts. Never on static cards.

**Accessibility.** Body text on the base clears 4.5:1 (`#F8FAFC` ≈ 16:1, `#94A3B8` ≈ 6.4:1);
`#00C2FF` on `#05070B` ≈ 9.9:1. Primary buttons use white on the gradient, not the accent cyan.
Icon-only controls always carry a label. 44px minimum hit target on mobile. Both themes are
maintained in parallel — light theme flips semantic aliases only and deepens blues to `#0066FF`
for contrast on white.

---

## Iconography

**Lucide, loaded from CDN** (`unpkg.com/lucide@0.454.0`) at **1.75px stroke, round caps, 24px
grid, 20px default box**. Access it only through the `Icon` component, which loads the library
once and hydrates placeholders — no page in this system hand-rolls an SVG path.

⚠️ **Substitution flagged.** No icon set, sprite or icon font was supplied. Lucide was chosen
because its thin geometric line work is the closest free match to the logo's `</>` ornament and
circular sweep. If a real icon set exists, drop it into `assets/icons/` and rewrite `Icon.jsx` to
read from it — the prop surface (`name`, `size`, `stroke`, `color`) can stay identical.

Icons in regular use: `code-2`, `terminal`, `server`, `database`, `layers`, `folder-git-2`,
`layout-dashboard`, `file-text`, `graduation-cap`, `briefcase`, `milestone`, `trophy`, `award`,
`mail`, `send`, `github`, `linkedin`, `arrow-up-right`, `external-link`, `plus`, `pencil`,
`trash-2`, `search`, `settings`, `sun`, `moon`, `chevron-*`.

- **Icons never appear without a text label** except in `IconButton`, which requires `label`.
- **Brand/social marks** (GitHub, LinkedIn, X) use Lucide's brand glyphs at the same weight.
- **`</>`** is a typeset glyph in JetBrains Mono, not an icon — it is the one ornament allowed.
- **No emoji, no unicode arrows or bullets as icons, no PNG icons.**

---

## Repository index

| Path | What it is |
| --- | --- |
| `styles.css` | Global entry point — `@import` list only. Consumers link this one file. |
| `tokens/fonts.css` | Google Fonts import for the three families. |
| `tokens/colors.css` | Brand ramps, neutrals, semantics, aliases, gradients + the `[data-theme="light"]` scope. |
| `tokens/typography.css` | Families, 11-step scale, line-heights, weights, tracking. |
| `tokens/spacing.css` | 4px scale, layout maxima, nav/sidebar sizes, breakpoint reference values. |
| `tokens/radius.css` | Corner radii and border widths. |
| `tokens/elevation.css` | Shadows, inset hairlines, brand glows, focus ring, blurs. |
| `tokens/motion.css` | Durations, easings, hover-lift and press-scale transforms. |
| `tokens/base.css` | Reset, element defaults, link colours, focus-visible, scrollbar, reduced-motion. |
| `components/{core,forms,navigation,feedback,data}/` | The 22 component families listed above, each with `.jsx` + `.d.ts` + `.prompt.md`, and one `@dsCard` showcase per directory. |
| `ui_kits/portfolio/` | Public site recreation — `index.html`, `Sections.jsx`, `data.js`, `README.md`. |
| `ui_kits/dashboard/` | Admin dashboard recreation — `index.html`, `Screens.jsx`, `data.js`, `README.md`. |
| `guidelines/*.html` | 22 foundation specimen cards (Colors, Type, Spacing, Brand) rendered in the Design System tab. |
| `assets/logo-lockup.png` | The supplied brand lockup. The only real brand asset. |
| `assets/swatch-*.webp` | The supplied colour swatches. |
| `thumbnail.html` | Homepage tile for this design system. |
| `SKILL.md` | Agent-skill front matter so this folder works as a Claude Code skill. |

## Open substitutions

1. **Fonts.** No binaries supplied. `Space Grotesk` / `Manrope` / `JetBrains Mono` are Google
   Fonts stand-ins — Space Grotesk approximates the logo's wide geometric technical sans.
   If licensed files exist, drop them in `assets/fonts/` and swap the `@import` in
   `tokens/fonts.css` for `@font-face` rules.
2. **Icons.** Lucide substituted, as above.
3. **Imagery.** No photography, screenshots or illustrations supplied. All image slots render the
   deliberate grid placeholder.
4. **Real content.** Every project, client, metric, testimonial and blog post in the UI kits is
   placeholder copy in the brand's voice.
