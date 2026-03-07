# Neo-Brutalist Design System: "Sourdough Edition"

This design system is inspired by [Gumroad.com](https://gumroad.com/) and tailored for the 5ciastek baking assistant. It embraces **Neo-Brutalism** to signal honesty, precision, and a "no-nonsense" approach to baking.

---

## 1. Visual Foundation

### Color Palette
High contrast and vibrant accents against a stark "Ink and Paper" background.

| Name | Hex | Usage |
| :--- | :--- | :--- |
| **Crust (Black)** | `#000000` | Borders, Text, Hard Shadows |
| **Flour (White)** | `#FFFFFF` | Primary Background |
| **Sourdough Yellow** | `#FFD338` | Primary CTA, Hero Highlights |
| **Starter Pink** | `#FF90E8` | Secondary CTA, Interaction Accents |
| **Ferment Green** | `#05FF00` | Success States, "Ready" Indicators |
| **Dough Grey** | `#F0F0F0` | Secondary Backgrounds, Disabled States |

### Typography
Bold, mechanical, and highly legible.

- **Primary Headings:** `Mabry Pro` (or `Roboto Mono` as fallback). Weight: **900 (Black)**.
- **Secondary Headings:** `Roboto Mono`. Weight: **700 (Bold)**.
- **Body Text:** `Inter` or System Sans-Serif. Weight: **400/500**.
- **Data/Monospace:** `Roboto Mono`. Used for all numerical data, fermentation times, and technical labels.

---

## 2. Core Components

### The "Boxy" Card
All containers must use thick borders and hard shadows.

```css
.card {
  background: var(--white);
  border: 3px solid var(--black);
  box-shadow: 6px 6px 0px var(--black); /* Hard shadow, no blur */
  padding: 24px;
  transition: transform 0.1s ease;
}

.card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0px var(--black);
}
```

### Neo-Brutalist Buttons
Buttons should feel physical and "clickable."

- **Normal State:** 2px solid black border, hard shadow (4px).
- **Hover State:** Background changes to a vibrant accent (Yellow/Pink), shadow deepens.
- **Active (Pressed) State:** Button "sinks"—shadow offset goes to 0, button translates down/right by 4px.

### Input Fields
- **Border:** 2px solid black.
- **Focus State:** Background changes to `Sourdough Yellow` (`#FFD338`).
- **Label:** Always visible, bold black text above the input.

---

## 3. Layout Principles

- **Visible Grids:** Use thick horizontal/vertical lines (`2px solid black`) to separate sections in the header and sidebar.
- **Strict Alignment:** All text should be left-aligned to reinforce the mechanical feel.
- **High Density:** Information is organized into "cells" (boxes), making the calculator feel like a technical manual.

---

## 4. Visual Elements

- **Icons:** Use `lucide-react` with a stroke width of `2.5px` to match the border thickness.
- **Illustrations:** Hand-drawn style with thick black outlines (resembling comic book art).

---

## 5. Implementation Roadmap (GEMINI.md Integration)

1. **Refactor `src/styles.css`:** Define the neo-brutalist variables.
2. **Update `Button.module.css`:** Implement the hard shadow and sinking interaction.
3. **Update `InputField.module.css`:** Add high-contrast borders and yellow focus state.
4. **Header/Sidebar Update:** Apply thick black borders and remove soft shadows.
