---
name: stitch-design
description: Generate UI designs from text prompts using Stitch (Google's design-to-image tool). Use for creating initial page designs, landing pages, or any visual UI from a description.
---

## What I do
- Generate new Stitch screens from text descriptions
- Edit existing screens with modified prompts
- Create multi-page designs with consistent styling
- Handle Stitch project management (create, list, get projects and screens)

## When to use me
Use when the user asks to design a page, create a UI mockup, or generate a visual design from a description. Also use for editing existing Stitch screens.

## How to use
1. Call `stitch_list_projects` to see available projects (or `stitch_create_project` to make a new one)
2. Use `stitch_generate_screen_from_text` with a detailed prompt describing the design
3. For multi-page sites, generate each page separately
4. Use `stitch_get_screen` to verify the generated design

## Prompt guidelines
- Describe the visual style first (colors, typography, mood)
- List specific sections and their content
- Specify layout (sidebar? grid? cards?)
- Mention target platform (desktop/mobile)
- Reference the ANEKTIA brand: dark academia, gold accents (#C5A059), serif fonts, parchment textures

## Example prompts
"Design a physics learning dashboard with a dark academia theme, gold accents, parchment textures. Show a learning path with golden emblem nodes, user stats with circular progress ring, and a sidebar with achievements and leaderboard."

"Create a mobile lesson view for a physics article with serif typography, gold headings, dark charcoal background, and glassmorphism cards."

## API notes
- Stitch tools use Geminis model - results may take 30-60 seconds
- Check for completion with `stitch_get_screen` if generation times out
- Delete unwanted screens to keep project clean
