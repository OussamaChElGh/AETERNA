---
name: stitch-loop
description: Automated design-to-code loop that iterates through Stitch screens, generates React components, and writes them to the project. Use for building entire multi-page sites from Stitch designs.
---

## What I do
- Loop through all screens in a Stitch project
- For each screen, analyze the design and generate React/Tailwind code
- Write components to the appropriate project directories
- Run builds to verify code compiles
- Create routes/pages for each screen

## When to use me
Use when the user wants to convert an entire Stitch project into working code. This is the main "generate my site" workflow after designs are finalized.

## Workflow
1. List all screens in the target Stitch project (`stitch_list_screens`)
2. For each screen:
   a. Get screen details (`stitch_get_screen`)
   b. Extract the screenshot URL and download the image
   c. Analyze the design: layout, colors, components, text
   d. Generate a React component with Tailwind CSS matching the design
   e. Write the component file to the project
   f. Create a route page if needed
3. Run `npm run build` to verify all components compile
4. Fix any import/type errors
5. Report which pages were created and where

## Code generation rules
- Use `'use client'` where needed (state, hooks, event handlers)
- Import from: react, next/link, motion/react, lucide-react, @/lib/utils
- Use Tailwind CSS v4 classes
- Match exact colors from the design (extract hex values)
- Match typography (serif titles, mono labels)
- Use cn() for conditional classes
- Export as named or default function matching the screen title
- Handle responsive sizing (desktop-first with md: breakpoints)

## Directory conventions
- Page components: `app/<route>/page.tsx`
- Shared components: `components/<category>/<Name>.tsx`
- Stitch-generated pages: `app/stitch/<screen-name>/page.tsx`
