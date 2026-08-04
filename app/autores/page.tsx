'use client';
import { motion } from "motion/react";
import Link from 'next/link';
import { ArrowRight } from "lucide-react";

const AUTHORS = [
  {
    name: "Guardián Anektia",
    role: "Inteligencia Artificial",
    bio: "Un archivero incansable de la matriz galáctica. El Guardián es el bibliotecario de la plataforma, encargado de destilar sabiduría atemporal.",
    image: "/mascot.png",
    slug: "guardian-anektia"
  },
  {
    name: "Marco Aurelio",
    role: "Filósofo Estoico",
    bio: "Emperador romano y uno de los filósofos más importantes de la corriente estoica. Autor de 'Meditaciones'.",
    image: "https://images.unsplash.com/photo-1616423641454-99696409893d?q=80&w=1974&auto=format&fit=crop",
    slug: "marco-aurelio"
  },
  {
    name: "Miguel de Cervantes",
    role: "Escritor",
    bio: "Considerado la máxima figura de la literatura española y universal. Creador de Don Quijote de la Mancha.",
    image: "https://images.unsplash.com/photo-1576158014588-ac0f9b3e1cd0?q=80&w=2072&auto=format&fit=crop",
    slug: "miguel-de-cervantes"
  },
  {
    name: "Friedrich Nietzsche",
    role: "Filósofo",
    bio: "Crítico feroz de la cultura occidental, la religión y la filosofía tradicional. Maestro de la sospecha.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop", // Placeholder
    slug: "friedrich-nietzsche"
  }
];

export default function AuthorsPage() {
  return (
    <div className="pb-32 bg-brand-offwhite">
      <section className="bg-brand-ink text-brand-offwhite pt-40 pb-32 border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-8 text-center">
           <span className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-brand-gold mb-8 block">
             Genealogía del Pensamiento
           </span>
           <h1 className="font-serif text-6xl md:text-9xl text-brand-offwhite mb-12 tracking-tighter">
             Las <span className="italic">Grandes</span> Voces
           </h1>
           <p className="text-xl text-white/40 max-w-3xl mx-auto leading-relaxed font-sans font-light italic">
             Mentes que han desafiado el tiempo. Una recopilación de los pensadores y escritores 
             que forman la columna vertebral de nuestra arquitectura intelectual.
           </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-8 mt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-border border border-brand-border">
          {AUTHORS.map((author, i) => (
            <motion.div
              key={author.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white p-12 flex flex-col items-center text-center hover:bg-brand-ink transition-colors duration-500"
            >
              <div className="w-48 h-48 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 border border-brand-offwhite/10 mb-12">
                <img
                  src={author.image}
                  alt={author.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => { 
                    if (author.slug === "guardian-anektia") {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=200&auto=format&fit=crop"; 
                    }
                  }}
                />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-brand-gold group-hover:text-brand-offwhite/40 mb-4 block">
                  {author.role}
                </span>
                <h3 className="font-serif text-4xl text-brand-ink mb-6 group-hover:text-brand-offwhite group-hover:italic transition-all">
                  {author.name}
                </h3>
                <p className="text-brand-mixed opacity-60 text-sm leading-relaxed line-clamp-3 group-hover:text-brand-offwhite/60 mb-10">
                  {author.bio}
                </p>
                <Link href={`/autores/${author.slug}`} 
                  className="inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-brand-ink group-hover:text-brand-gold transition-all"
                >
                  Documentación <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
