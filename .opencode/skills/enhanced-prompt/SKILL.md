---
name: enhanced-prompt
description: Generate detailed, structured prompts for consistent Stitch design generation. Reads design.md context and crafts prompts that produce visually cohesive results.
---

## What I do
- Generate enhanced text-to-design prompts for Stitch
- Incorporate design system rules (colors, typography, spacing) from DESIGN.md
- Ensure prompt produces visual consistency with existing pages
- Reduce trial-and-error in design generation

## When to use me
Use before calling `stitch_generate_screen_from_text` to create a well-structured prompt. Especially useful when:
- Creating pages that must match an existing design system
- Building multi-page sites where consistency matters
- The initial prompt produced inconsistent results

## Prompt structure
1. **Visual style**: Reference DESIGN.md colors, fonts, mood
2. **Layout**: Describe the page structure (header, sidebar, main, footer)
3. **Components**: List specific UI elements and their content
4. **Text content**: Provide real copy for headings, buttons, labels
5. **Constraints**: Specify target platform, responsive behavior, accessibility

## Example
```
Design a physics lesson page matching the ANEKTIA design system.
- Dark charcoal background (#121212) with gold accents (#C5A059)
- Serif titles (Playfair Display), mono labels, cream text (#E5E5E5)
- Layout: sticky header with logo + streak + XP, main content area with 
  lesson text and interactive exercises, right sidebar with progress
- Components: gold-bordered glassmorphism cards, circular progress ring,
  flame streak icon, ancient coin XP display
- Content: "Lección 3: Las Leyes de Newton" heading, body text sections,
  interactive quiz blocks, "Siguiente lección" button
- Platform: desktop web, responsive to tablet
```
