---
name: Momentum High-Energy System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#5c4037'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#916f65'
  outline-variant: '#e6beb2'
  surface-tint: '#ae3200'
  primary: '#aa3000'
  on-primary: '#ffffff'
  primary-container: '#d43f00'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59e'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e2'
  on-secondary-container: '#646464'
  tertiary: '#006b2d'
  on-tertiary: '#ffffff'
  tertiary-container: '#00873b'
  on-tertiary-container: '#f7fff3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#3a0b00'
  on-primary-fixed-variant: '#852400'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-xl:
    fontFamily: Sora
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  data-mono:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  container-max: 1280px
---

## Brand & Style

The design system is engineered for high-stakes public accountability, targeting solo founders who thrive on pressure and progress. The aesthetic is **High-Contrast / Modern** with a focus on "Electric Minimalism." It balances a clean, professional canvas with explosive pops of color to signal urgency and achievement.

The emotional goal is to evoke **unstoppable momentum**. While the backgrounds remain clinical and airy to allow for deep focus, the interactive elements use vibrant gradients and chunky typography to create a sense of physical weight and digital "crunch." It feels like a high-performance dashboard crossed with a motivational sports brand.

## Colors

The palette centers on **Electric Orange (#FF4D00)**, a high-visibility hue that demands action. This is paired with a deep "Ink Black" for grounding and a "Velocity Green" for positive reinforcement (success states, streaks, and completed goals).

- **Primary:** Electric Orange. Used for primary CTAs, active progress bars, and critical momentum indicators.
- **Secondary:** Ink Black (#000000). Used for chunky headlines and high-contrast buttons to provide a professional anchor.
- **Surface:** A "Cool Chalk" white (#FFFFFF) for cards, with a soft "Cloud Gray" (#F1F5F9) for the primary application background to reduce eye strain during long sessions.
- **Accents:** Use gradients transitioning from Electric Orange to a Hot Coral (#FF0055) for "Hero" moments like goal completion or confetti bursts.

## Typography

This design system employs a three-tier typographic strategy to separate narrative, data, and action.

1.  **Headlines (Sora):** A chunky, geometric sans-serif that feels modern and aggressive. Use tight letter-spacing for large display text to create a high-impact, editorial look.
2.  **Body (Hanken Grotesk):** A highly legible, sharp grotesque font. It provides a technical yet approachable feel for long-form updates and task descriptions.
3.  **Data/Numbers (Space Mono):** Used exclusively for accountability metrics (days remaining, revenue, streak counts). The monospaced nature emphasizes the "raw data" of public building.

**Scaling:** On mobile, Display-XL scales down to Headline-LG size to maintain readability without overwhelming the viewport.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The system relies on a consistent 8px baseline rhythm.

- **Fluidity:** Containers should expand to fill the grid but maintain a max-width of 1280px for readability.
- **Section Spacing:** Use large vertical gaps (80px - 120px) between major dashboard modules to emphasize focus.
- **Card Padding:** Standardize on 32px padding for desktop cards to create an airy, premium feel, dropping to 20px on mobile.
- **Sidebars:** On desktop, use a fixed-width left navigation (280px) to keep the core workspace centered and stable.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Soft Ambient Shadows**. 

1.  **Level 0 (Base):** The main background (#F1F5F9).
2.  **Level 1 (Cards):** Pure white (#FFFFFF) cards with a 1px border (#E2E8F0) and a very soft, diffused shadow (Y: 4px, Blur: 20px, Opacity: 4%).
3.  **Level 2 (Active/Floating):** Used for modals or hovered cards. Increase shadow spread and add a slight 2px vertical lift.
4.  **Interaction:** Use "Glassmorphism" lightly for navigation overlays—applying a 12px backdrop blur with 80% opacity white—to maintain context of the content beneath.

## Shapes

The shape language is "Friendly-Technical." 

- **Primary Corners:** A standard 16px (rounded-lg) radius is used for all main containers and cards. This softens the "aggressive" color palette and makes the UI feel approachable.
- **Small Elements:** Buttons and input fields use a 12px radius.
- **Indicators:** Progress bars and status tags utilize a full pill-shape (999px) to signify movement and completion.
- **Icons:** Use 2px stroke width with slightly rounded terminals to match the typography weight.

## Components

### Buttons
- **Primary:** Electric Orange background, white text. Bold weight. Apply a subtle inner-glow on hover.
- **Secondary:** Solid Ink Black with white text. Used for "Add Task" or secondary dashboard actions.
- **Ghost:** Transparent background with an Electric Orange border and text.

### Progress Bars
- Use a thick (12px) height. The "track" is a light gray (#E2E8F0), and the "indicator" is a gradient from Electric Orange to Hot Coral.
- **Motion:** Add a "pulse" animation to the indicator for active tasks.

### Cards
- Layered cards are the primary container. Use a subtle 1px border. 
- For "Public Accountability" cards, include a "Spectator Count" label in the top right using `label-caps` in `Space Mono`.

### Input Fields
- High-contrast focus states. When an input is active, the border should transition to 2px Electric Orange with a soft glow (30% opacity orange).

### Success States
- Trigger a "Confetti Burst" micro-interaction when a milestone is checked off. Use a combination of Electric Orange, Velocity Green, and Ink Black particles.