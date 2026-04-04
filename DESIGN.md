# Design System Specification: Promptly

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Architect."** This system moves away from the cluttered "dashboard" aesthetic to an editorial, high-end marketplace environment. It is designed to feel authoritative, cinematic, and incredibly precise. 

We achieve this by embracing **Intentional Asymmetry** and **Monolithic Typography**. By pairing deep, obsidian surfaces with high-contrast Manrope headlines, the UI feels less like a tool and more like a premium publication. The interface should feel like it is "emerging" from the shadows, using vibrant purple accents not just as decoration, but as a heat map for user intent.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a deep, absolute black (`#0e0e0e`), contrasted by a highly saturated, luminous purple (`#c899ff`).

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited for sectioning. Structural boundaries must be defined solely through background tonal shifts. Use `surface-container-low` (`#131313`) against the base `background` (`#0e0e0e`) to create distinction. This creates a seamless, "liquid" transition between content blocks.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of "Obsidian Glass." 
- **Base Layer:** `surface` (`#0e0e0e`) for the main canvas.
- **Secondary Sectioning:** `surface-container-low` (`#131313`) for large layout blocks.
- **Component Containers:** `surface-container` (`#191919`) or `surface-container-high` (`#1f1f1f`) for cards and inputs.
- **Nesting:** When a card sits inside a section, the card must be at least one tier "brighter" than its parent to create natural optical lift.

### The "Glass & Gradient" Rule
For primary actions and high-impact elements, use semi-transparent `primary` (`#c899ff`) with a 12px `backdrop-blur`. For hero text or primary CTAs, apply a subtle linear gradient from `primary` (`#c899ff`) to `primary-container` (`#be86ff`) at a 135-degree angle to add "soul" and depth to the flat digital space.

---

## 3. Typography
Typography is our primary tool for hierarchy. We utilize a dual-font strategy: **Manrope** for authoritative, geometric headlines and **Inter** for high-legibility utility.

*   **Display Scale (Manrope):** Use `display-lg` (3.5rem) for hero moments. Tighten letter-spacing to -0.02em to create a "compact" editorial feel.
*   **Headline Scale (Manrope):** `headline-lg` (2rem) and `headline-md` (1.75rem) serve as the primary anchors for content sections.
*   **Body & Utility (Inter):** `body-md` (0.875rem) is the workhorse. Use `label-md` (0.75rem) in All Caps with 0.05em tracking for metadata and categories to signify "Technical/System" status.
*   **High-Contrast Emphasis:** Use `primary` (`#c899ff`) for key terms within headlines to draw the eye immediately to the value proposition.

---

## 4. Elevation & Depth
In this design system, shadows are light, and surfaces are heavy. 

### The Layering Principle
Depth is achieved via **Tonal Stacking**. A card (`surface-container-highest`: `#262626`) placed on a background (`surface`: `#0e0e0e`) creates immediate perceived elevation without a single pixel of shadow.

### Ambient Shadows
If a floating element (like a dropdown or modal) requires a shadow, it must be an **Ambient Shadow**:
- **Color:** `#000000` at 40% opacity.
- **Blur:** 40px to 60px.
- **Spread:** -10px (to keep the shadow "tucked" under the element).

### The "Ghost Border" Fallback
If a container lacks sufficient contrast against its parent, use a **Ghost Border**: `outline-variant` (`#484848`) at 20% opacity. This provides a "suggestion" of a boundary rather than a hard line.

---

## 5. Components

### Buttons
- **Primary:** Background: `primary` (`#c899ff`), Text: `on_primary` (`#44007f`). Roundedness: `lg` (0.5rem). Use for the main CTA (e.g., "Connect Wallet").
- **Secondary (The Dark Button):** Background: `surface-container-highest` (`#262626`), Text: `on_surface` (`#ffffff`). Use for secondary actions like "View Leaderboard."
- **Tertiary/Ghost:** Text: `on_surface_variant` (`#ababab`). No background. Underline on hover only.

### Cards & Marketplace Items
Cards must never use dividers. Use `surface-container` (`#191919`) as the base. Content within cards should be separated by vertical white space (use the `1.5rem` spacing increment).
- **Interactive State:** On hover, shift background to `surface-container-highest` (`#262626`) and apply the "Ghost Border" at 40% opacity.

### Input Fields (Command Bar)
The main prompt input is a signature component.
- **Base:** `surface-container-low` (`#131313`).
- **Border:** Ghost Border (`outline-variant` at 20%).
- **Focus State:** Border color shifts to `primary` (`#c899ff`) at 100% opacity with a 4px soft glow.
- **Iconography:** Use `on_surface_variant` for inactive icons, shifting to `primary` on interaction.

### Chips (Trending Tags)
- **Style:** Small, pill-shaped (`full` roundedness).
- **Border:** 1px Ghost Border (`outline-variant` at 20%).
- **Text:** `label-sm` (0.6875rem) in All Caps.

---

## 6. Do's and Don'ts

### Do
- **Do** use intentional white space. Let the `display-lg` typography breathe; it is the center of the experience.
- **Do** use `primary` (`#c899ff`) sparingly. It is a laser, not a paint bucket.
- **Do** utilize "Tonal Layering" for all card-to-background relationships.
- **Do** ensure all interactive elements have a clear `surface-bright` hover state.

### Don't
- **Don't** use 1px solid white or high-contrast borders. It breaks the "Digital Architect" aesthetic.
- **Don't** use standard "Drop Shadows" with 0 blur. 
- **Don't** use dividers or horizontal rules. Use 24px, 32px, or 48px vertical gaps to separate concepts.
- **Don't** use pure white text for body copy; use `on_surface_variant` (`#ababab`) to reduce eye strain and maintain the dark-mode atmosphere. Use pure white only for `display` and `headline` levels.