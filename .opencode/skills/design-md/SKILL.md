---
name: design-md
description: Extract a design system DESIGN.md from an existing Stitch screen. Use to capture visual identity (colors, typography, spacing) for consistent multi-page designs.
---

## What I do
- Extract the design system from a Stitch page
- Generate a DESIGN.md file with color palettes, typography scales, spacing, and component rules
- Ensure consistent branding across all pages of a project
- Upload DESIGN.md to Stitch projects for future reference

## When to use me
Use after creating a first design in Stitch that you want to replicate across multiple pages. The DESIGN.md captures the visual DNA so subsequent pages maintain consistency.

## How to use
1. Identify the source screen you want to extract the design from
2. Call `stitch_get_screen` to inspect the design's visual properties
3. Use the Stitch tools to create a design system asset
4. Save the DESIGN.md to the project for future text-to-design prompts

## DESIGN.md format
```yaml
colors:
  surface: '#121212'
  primary: '#C5A059'
  text: '#E5E5E5'
typography:
  h1: { family: 'Playfair Display', size: '2.5rem', weight: '700' }
  body: { family: 'Inter', size: '1rem', weight: '400' }
spacing: { unit: '8px', section: '4rem', card: '1.5rem' }
components:
  card: { radius: '12px', border: '1px solid rgba(197,160,89,0.2)', background: 'rgba(26,26,26,0.8)' }
```

## Tips
- Reference the DESIGN.md in all subsequent text-to-design prompts
- Update DESIGN.md when the visual style evolves
- Use `stitch_upload_design_md` and `stitch_create_design_system_from_design_md` for Stitch integration
