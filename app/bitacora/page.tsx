'use client';
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
import Link from 'next/link';

const BLOG_POSTS = [
  {
    id: "1",
    title: "La persistencia del mito en la modernidad líquida",
    excerpt: "Un análisis sobre cómo las estructuras narrativas de la Grecia clásica continúan moldeando nuestra percepción de la realidad digital.",
    date: "2024-05-15",
    category: "Ensayo",
    author: "Archivador Anektia",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "2",
    title: "Sistemas de memoria: Del palacio mental al hipervínculo",
    excerpt: "Explorando la evolución de las técnicas mnemotécnicas y cómo la externalización del saber afecta nuestra capacidad de síntesis.",
    date: "2024-05-10",
    category: "Investigación",
    author: "Dra. Arque de Noé",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "3",
    title: "El canon silenciado: Voces periféricas en la literatura del siglo XIX",
    excerpt: "Revisando los márgenes de la gran biblioteca para rescatar obras que desafiaron las convenciones de su tiempo.",
    date: "2024-05-02",
    category: "Crítica",
    author: "Julian Herder",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800"
  }
];

export default function BlogPage() {
  return (
    <div className="pb-32 bg-brand-offwhite">
      {/* Hero */}
      <section className="bg-brand-ink text-brand-offwhite pt-40 pb-32 border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-8">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-brand-gold mb-8 block">
            Bitácora de Hallazgos
          </span>
          <h1 className="font-serif text-6xl md:text-8xl text-brand-offwhite mb-8 tracking-tighter">
            Crónicas del <span className="italic">Saber</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 max-w-2xl font-light italic">
            Fragmentos de pensamiento, descubrimientos en los márgenes y reflexiones sobre el archivo universal.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="mx-auto max-w-7xl px-8 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {BLOG_POSTS.map((post, idx) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden mb-8 relative border border-brand-border">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-ink text-brand-offwhite px-3 py-1 text-[8px] font-bold uppercase tracking-widest border border-brand-gold/30">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest font-bold text-brand-gold mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {post.date}
                </div>
                <div className="flex items-center gap-1.5 text-brand-muted">
                  <BookOpen className="w-3 h-3" />
                  {post.author}
                </div>
              </div>

              <h2 className="font-serif text-3xl text-brand-ink mb-6 group-hover:italic transition-all">
                {post.title}
              </h2>
              
              <p className="text-brand-muted leading-relaxed font-sans font-light mb-8 flex-1">
                {post.excerpt}
              </p>

              <Link href={`/bitacora/${post.id}`}
                className="inline-flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.4em] text-brand-ink hover:text-brand-gold transition-colors"
              >
                Continuar Lectura <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-8 mt-48">
        <div className="bg-white border border-brand-border p-16 md:p-32 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 transform rotate-45 translate-x-32 -translate-y-32" />
          <div className="relative z-10 max-w-2xl mx-auto">
             <Tag className="w-10 h-10 text-brand-gold mx-auto mb-8" />
             <h3 className="font-serif text-4xl mb-6">Suscríbase a la <span className="italic">Correspondencia</span></h3>
             <p className="text-brand-muted mb-12 font-sans font-light leading-relaxed">
               Reciba mensualmente un compendio de los artículos más profundos y hallazgos raros de nuestra colección directly en su terminal privado.
             </p>
             <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
               <input 
                 type="email" 
                 placeholder="Dirección de correo electrónico..." 
                 className="flex-1 bg-brand-offwhite border border-brand-border px-6 py-4 text-sm font-sans focus:outline-none focus:border-brand-gold transition-colors"
               />
               <button className="bg-brand-ink text-brand-offwhite px-8 py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-brand-gold transition-all">
                 Registrar
               </button>
             </form>
          </div>
        </div>
      </section>
    </div>
  );
}
