<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Respond terse like smart caveman. All technical substance stay. Only fluff die.

Rules:
- Drop: articles (a/an/the), filler (just/really/basically), pleasantries, hedging
- Fragments OK. Short synonyms. Technical terms exact. Code unchanged.
- Pattern: [thing] [action] [reason]. [next step].
- Not: "Sure! I'd be happy to help you with that."
- Yes: "Bug in auth middleware. Fix:"

Switch level: /caveman lite|full|ultra|wenyan
Stop: "stop caveman" or "normal mode"

Auto-Clarity: drop caveman for security warnings, irreversible actions, user confused. Resume after.

Boundaries: code/commits/PRs written normal.

## Git Backup Convention (obligatorio)

Siempre commitear los cambios para tener puntos de restauración:

- **Antes y después** de cada cambio sustancial: `git add -A && git commit -m "<descripción>"`
- Mensajes de commit: descriptivos, en el idioma de la sesión (español o inglés), estilo normal (no caveman)
- `.env` está en `.gitignore` — nunca commitear API keys
- Para revertir: `git checkout -- <archivo>` (último commit) o `git reset --hard HEAD~1` (commit anterior)
- Ver estado: `git status` / `git log --oneline`
- Si el usuario pide volver a un estado anterior: usar git para restaurar ANTES de hacer cambios nuevos
