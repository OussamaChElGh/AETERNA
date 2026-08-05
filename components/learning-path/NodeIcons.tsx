import React from 'react'

/* ─── Shared SVG wrapper ─── */
function IconWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {children}
    </svg>
  )
}

/* ───────── 1. Guía Maestra ───────── */
export function IconGuiaMaestra({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <path d="M10 12h12l4 4v20a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M22 12v4a2 2 0 0 0 2 2h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M14 22h12M14 28h8M14 32h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </IconWrap>
  )
}

/* ───────── 2. Piensa un Físico ───────── */
export function IconPiensaFisico({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <circle cx="24" cy="18" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M24 26v3M18 38h12M15 42h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="18" cy="14" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="28" cy="16" r="1.5" fill="currentColor" opacity="0.5" />
      <path d="M28 22l2-2M20 22l-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M30 12l2 2M18 12l-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </IconWrap>
  )
}

/* ───────── 3. Cinemática ───────── */
export function IconCinematica({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <path d="M8 34h32M8 34v-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="14" cy="28" r="2.5" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="24" cy="22" r="2.5" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="34" cy="16" r="2.5" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M14 28l10-6 10-6" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" opacity="0.5" />
      <path d="M10 12l4 2M36 12l4-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </IconWrap>
  )
}

/* ───────── 4. Materia y Energía ───────── */
export function IconMateriaEnergia({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <path d="M24 8v4M24 36v4M8 24h4M36 24h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="24" cy="24" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M24 10l-14 14M24 38l14-14M10 24l14 14M38 24L24 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </IconWrap>
  )
}

/* ───────── 5. Método Científico ───────── */
export function IconMetodoCientifico({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <path d="M20 10h12a2 2 0 0 1 2 2v16l-4-4-4 4-4-4-4 4V12a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M16 18h8M16 22h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <circle cx="16" cy="30" r="3" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
    </IconWrap>
  )
}

/* ───────── 6. Vectores ───────── */
export function IconVectores({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <path d="M8 24h28l-6-6M36 24l-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 8v28l-6-6M24 36l6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 20l8-8M28 28l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </IconWrap>
  )
}

/* ───────── 7. Leyes de Newton ───────── */
export function IconNewton({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <circle cx="22" cy="16" r="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M22 20v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 38h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 14l6-4M28 20l8-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M14 10l4 6M12 18l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </IconWrap>
  )
}

/* ───────── 8. Trabajo y Energía ───────── */
export function IconTrabajoEnergia({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <path d="M24 6v18M24 6l-8 12h16l-8-12z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M16 30l4 10M32 30l-4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M12 28h24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M28 6l4-2M20 6l-4-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </IconWrap>
  )
}

/* ───────── 9. Momentum ───────── */
export function IconMomentum({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <circle cx="16" cy="22" r="5" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="32" cy="22" r="5" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M26 26v-3l-1-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M10 12l6 5M38 12l-6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M24 14v-4M24 36v4M14 36l-4 4M34 36l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
    </IconWrap>
  )
}

/* ───────── 10. Movimiento Circular ───────── */
export function IconOrbital({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <ellipse cx="24" cy="24" rx="14" ry="6" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 2" opacity="0.5" transform="rotate(-20 24 24)" />
      <circle cx="10" cy="20" r="2.5" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M10 20a14 6 0 0 1 14-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </IconWrap>
  )
}

/* ───────── 11. Torque ───────── */
export function IconTorque({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <circle cx="24" cy="24" r="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M24 24v-12M24 12l4 4M24 12l-4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 24l14 8M38 32l-4 2M38 32l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <path d="M24 24a14 14 0 1 0 4 1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" fill="none" />
    </IconWrap>
  )
}

/* ───────── 12. Termodinámica ───────── */
export function IconTermodinamica({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <path d="M18 10h12a2 2 0 0 1 2 2v6h-16v-6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M18 18v10a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M12 26l-4 4M36 26l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M16 14l-3-3M32 14l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </IconWrap>
  )
}

/* ───────── 13. Electromagnetismo ───────── */
export function IconElectromagnetismo({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <path d="M12 34V14a2 2 0 0 1 2-2h4v22H14a2 2 0 0 1-2-2zM30 12h4a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2h-4V12z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      <path d="M18 8l16 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M18 18h12M18 24h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M10 10l4 4M38 38l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
    </IconWrap>
  )
}

/* ───────── 14. Ondas y Óptica ───────── */
export function IconOndas({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <path d="M6 24Q14 8 24 24T42 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M8 30Q16 18 24 30T40 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M10 36Q18 28 24 36T38 36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" />
      <path d="M34 10l6 6M14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </IconWrap>
  )
}

/* ───────── 15. Mecánica Cuántica ───────── */
export function IconCuantica({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <path d="M24 6L40 16v16L24 42 8 32V16L24 6z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="24" cy="22" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="24" cy="22" r="1.5" fill="currentColor" opacity="0.5" />
      <path d="M12 18l4 4M36 30l-4-4M12 30l4-4M36 18l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
    </IconWrap>
  )
}

/* ───────── 16. Relatividad Especial ───────── */
export function IconRelatividad({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M24 10v14l10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2" fill="currentColor" opacity="0.5" />
      <path d="M10 16l3 3M38 32l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </IconWrap>
  )
}

/* ───────── 17. Relatividad General ───────── */
export function IconRelatividadGeneral({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <path d="M24 6a14 10 0 1 0 0 28" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M24 6a14 10 0 1 1 0 28" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      <circle cx="34" cy="14" r="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M34 14l2-4M38 10l-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </IconWrap>
  )
}

/* ───────── 18. Física Atómica y Nuclear ───────── */
export function IconAtomica({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="24" cy="24" r="1" fill="currentColor" />
      <ellipse cx="24" cy="24" rx="14" ry="5" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(0 24 24)" />
      <ellipse cx="24" cy="24" rx="14" ry="5" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="14" ry="5" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(-60 24 24)" />
      <circle cx="10" cy="24" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
      <circle cx="38" cy="24" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
    </IconWrap>
  )
}

/* ───────── 19. Física de Partículas ───────── */
export function IconParticulas({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <path d="M16 16l12 12M32 16L20 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="34" cy="34" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="34" cy="14" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="14" cy="34" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M30 6l2 6M42 18l-6 2M18 42l-2-6M6 30l6-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </IconWrap>
  )
}

/* ───────── 20. Teoría del Todo ───────── */
export function IconTeoriaDelTodo({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M24 12a6 12 0 0 1 0 24 6 12 0 0 1 0-24" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="30" cy="22" r="2" fill="currentColor" />
      <circle cx="18" cy="22" r="2" fill="currentColor" />
      <path d="M12 12l4 4M36 36l-4-4M36 12l-4 4M12 36l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
    </IconWrap>
  )
}

/* ───────── 21. Cosmología ───────── */
export function IconCosmologia({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <circle cx="24" cy="20" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M24 10a14 14 0 1 0 0 28" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" strokeDasharray="3 2" />
      <circle cx="18" cy="16" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="28" cy="18" r="1.5" fill="currentColor" opacity="0.3" />
      <circle cx="22" cy="26" r="1" fill="currentColor" opacity="0.3" />
      <path d="M14 8l2 2M38 8l-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </IconWrap>
  )
}

/* ───────── 22. Fluidos ───────── */
export function IconFluidos({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <path d="M16 8h16a2 2 0 0 1 2 2v8H14v-8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M14 18a10 6 0 0 0 20 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M14 28a10 6 0 0 0 20 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M24 18v-4M20 14l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
    </IconWrap>
  )
}

/* ───────── 23. Electromagnetismo Avanzado ───────── */
export function IconElectroAvanzado({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <path d="M12 16h24l-8 16H20l-8-16z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="16" cy="12" r="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="32" cy="12" r="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M24 16v20M18 36h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M10 10l3 3M38 10l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
    </IconWrap>
  )
}

/* ───────── 24. Ondas y Óptica Práctica ───────── */
export function IconOpticaPractica({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <path d="M10 24a6 4 0 0 1 6-4h16a6 4 0 0 1 0 8H16a6 4 0 0 1-6-4z" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="24" cy="24" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="24" cy="24" r="1" fill="currentColor" opacity="0.5" />
      <path d="M6 16l4 4M42 16l-4 4M6 32l4-4M42 32l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
    </IconWrap>
  )
}

/* ───────── 25. Relatividad Especial Práctica ───────── */
export function IconRelatividadPractica({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <path d="M8 24l12-8v16L8 24z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M20 16l12-8v16l-12-8z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M20 32l16 8V24l-16 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4" />
      <path d="M44 8l-4 2M44 40l-4-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </IconWrap>
  )
}

/* ───────── 26. Física + Tecnología ───────── */
export function IconFisicaTecnologia({ className }: { className?: string }) {
  return (
    <IconWrap className={className}>
      <rect x="10" y="14" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M18 38h16a2 2 0 0 0 2-2v-6h-8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
      <path d="M18 22v4M20 26h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <circle cx="14" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
      <circle cx="14" cy="10" r="1" fill="currentColor" opacity="0.3" />
    </IconWrap>
  )
}

/* ───────── Mapa de slugs a íconos ───────── */
export function getNodeIcon(slug: string): React.ComponentType<{ className?: string }> {
  const map: Record<string, React.ComponentType<{ className?: string }>> = {
    'guia-maestra-de-fisica': IconGuiaMaestra,
    'como-piensa-un-fisico': IconPiensaFisico,
    'cinematica': IconCinematica,
    'materia-y-energia': IconMateriaEnergia,
    'metodo-cientifico': IconMetodoCientifico,
    'vectores': IconVectores,
    'leyes-newton-movimiento': IconNewton,
    'trabajo-energia': IconTrabajoEnergia,
    'momentum-colisiones': IconMomentum,
    'movimiento-circular-satelites': IconOrbital,
    'torque-momento-angular': IconTorque,
    'termodinamica': IconTermodinamica,
    'electromagnetismo': IconElectromagnetismo,
    'ondas-y-optica': IconOndas,
    'mecanica-cuantica': IconCuantica,
    'relatividad-especial': IconRelatividad,
    'relatividad-general': IconRelatividadGeneral,
    'fisica-atomica-y-nuclear': IconAtomica,
    'fisica-particulas': IconParticulas,
    'teoria-del-todo': IconTeoriaDelTodo,
    'cosmologia': IconCosmologia,
    'fluidos': IconFluidos,
    'electromagnetismo-avanzado': IconElectroAvanzado,
    'ondas-y-optica-practica': IconOpticaPractica,
    'relatividad-especial-practica': IconRelatividadPractica,
    'fisica-tecnologia': IconFisicaTecnologia,
  }
  return map[slug] || IconGuiaMaestra
}

export const NODE_ICON_MAP = {
  'guia-maestra-de-fisica': IconGuiaMaestra,
  'como-piensa-un-fisico': IconPiensaFisico,
  'cinematica': IconCinematica,
  'materia-y-energia': IconMateriaEnergia,
  'metodo-cientifico': IconMetodoCientifico,
  'vectores': IconVectores,
  'leyes-newton-movimiento': IconNewton,
  'trabajo-energia': IconTrabajoEnergia,
  'momentum-colisiones': IconMomentum,
  'movimiento-circular-satelites': IconOrbital,
  'torque-momento-angular': IconTorque,
  'termodinamica': IconTermodinamica,
  'electromagnetismo': IconElectromagnetismo,
  'ondas-y-optica': IconOndas,
  'mecanica-cuantica': IconCuantica,
  'relatividad-especial': IconRelatividad,
  'relatividad-general': IconRelatividadGeneral,
  'fisica-atomica-y-nuclear': IconAtomica,
  'fisica-particulas': IconParticulas,
  'teoria-del-todo': IconTeoriaDelTodo,
  'cosmologia': IconCosmologia,
  'fluidos': IconFluidos,
  'electromagnetismo-avanzado': IconElectroAvanzado,
  'ondas-y-optica-practica': IconOpticaPractica,
  'relatividad-especial-practica': IconRelatividadPractica,
  'fisica-tecnologia': IconFisicaTecnologia,
} as const
