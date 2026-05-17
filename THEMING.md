# EAXY STORE Theme System

## Overview
The application uses a modular theming system that allows you to switch between completely different visual styles by changing a **single import statement**.

## Architecture

```
src/
├── App.css                    (Main stylesheet - imports theme)
└── styles/
    ├── theme.css             (Theme entry point - change which theme to use)
    └── themes/
        ├── theme-default.css (Default: Dark green & gold)
        └── theme-minimal.css (Minimal: Light & subdued)
```

## How to Switch Themes

1. Open `src/styles/theme.css`
2. Change the import line to your desired theme:

```css
/* To use the default dark theme */
@import './themes/theme-default.css';

/* To use the minimal light theme */
@import './themes/theme-minimal.css';
```

3. Run `npm start` or `npm run build` - the entire site instantly updates

## Creating a New Theme

1. Create a new file in `src/styles/themes/` named `theme-custom.css`
2. Copy this template:

```css
/* Theme Name - Brief Description */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap');

:root {
  /* Colors - Customize these */
  --bg: #0f1115;              /* Main background */
  --panel: #1a1f2b;           /* Card/panel background */
  --text: #f5f7fa;            /* Primary text */
  --muted: rgba(245, 247, 250, 0.68);  /* Secondary text */
  --green: #0f6b53;           /* Primary brand color */
  --gold: #d4af37;            /* Accent/secondary color */
  --border: rgba(255, 255, 255, 0.12); /* Border color */

  /* Typography - Keep these unless you have new fonts */
  --font-sans: 'Inter', sans-serif;
  --font-display: 'Space Grotesk', sans-serif;

  /* Spacing - Adjust to make layout more/less airy */
  --section-padding: 5.5rem 0;
  --section-padding-mobile: 4rem 0;
  --gap-sm: 0.4rem;
  --gap-md: 0.65rem;
  --gap-lg: 1rem;
  --gap-xl: 2.2rem;

  /* Radii - Control border-radius roundness */
  --radius-sm: 0.55rem;
  --radius-md: 0.72rem;
  --radius-lg: 1rem;
  --radius-xl: 1.3rem;

  /* Shadows - Adjust shadow depth */
  --shadow-sm: 0 8px 25px rgba(15, 107, 83, 0.35);
  --shadow-md: 0 24px 52px rgba(0, 0, 0, 0.35);
}

body {
  background: radial-gradient(circle at 20% 0%, #1f2938 0%, var(--bg) 38%);
  color: var(--text);
  font-family: var(--font-sans);
}

h1,
h2,
h3,
h4,
strong,
.brand-text {
  font-family: var(--font-display);
}

/* Gradient tokens for theme */
.gradient-text {
  background: linear-gradient(92deg, var(--green), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gradient-button {
  background: linear-gradient(140deg, var(--green), var(--gold));
}

.gradient-icon {
  background: linear-gradient(145deg, var(--gold), #f0d684);
}
```

3. Update `src/styles/theme.css`:

```css
@import './themes/theme-custom.css';
```

## CSS Variable Reference

| Variable | Purpose | Usage |
|----------|---------|-------|
| `--bg` | Main background color | Body background |
| `--panel` | Card/panel background | `.glass-card`, `.card-grid` items |
| `--text` | Primary text color | Body text, headings |
| `--muted` | Secondary text color | Smaller text, labels |
| `--green` | Primary brand color | Main action color, brand split |
| `--gold` | Accent color | Secondary actions, accent split |
| `--border` | Border/divider color | `.glass-card` borders |
| `--shadow-sm` | Small shadow | Subtle depth on cards |
| `--shadow-md` | Medium shadow | Larger depth on modals |
| `--radius-*` | Border radius | Corner roundness |
| `--gap-*` | Spacing unit | Padding/margin values |

## Theme Design Tips

- **Dark Themes**: A very dark background (`#0f1115`) with slightly lighter panels (`#1a1f2b`) creates contrast
- **Light Themes**: A light background (`#f8f9fa`) with white panels (`#ffffff`) works best
- **Color Harmony**: The `--green` and `--gold` pair should complement each other. Use tools like [Coolors.co](https://coolors.co) to find harmonious palettes
- **Contrast**: Ensure `--text` has enough contrast against `--bg` (aim for 4.5:1 ratio minimum)
- **Shadows**: Lighter themes typically need darker/softer shadows; dark themes need more saturated/glowing shadows

## Examples

### Dark Professional
```css
--bg: #0a0e27;
--panel: #16213e;
--text: #e0e0e0;
--green: #0d6efd;
--gold: #ffc107;
```

### Neon
```css
--bg: #0a0a0a;
--panel: #1a1a2e;
--text: #00ff88;
--green: #00ff88;
--gold: #ff00ff;
```

### Corporate
```css
--bg: #f5f5f5;
--panel: #ffffff;
--text: #333333;
--green: #1e40af;
--gold: #dc2626;
```

## Testing Your Theme

After changing the theme:
1. Run `npm start` to see live updates
2. Check contrast ratios using browser DevTools > Accessibility panel
3. Test on mobile (responsive should look good at all sizes)
4. Verify animations look smooth with the new colors via `@keyframes fadeLift` and `@keyframes pulseGlow`

## Current Themes

- **theme-default.css** - Dark green & gold (original design)
- **theme-minimal.css** - Light & subdued (modern minimal)

