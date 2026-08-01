'use client';
import Link from 'next/link';
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn, formatDate, getArticlePath } from "@/lib/utils";
import type { ArticleFrontmatter } from "@/types";

interface ArticleCardProps {
  article: ArticleFrontmatter;
  featured?: boolean;
}

export function ArticleCard({ article, featured }: ArticleCardProps) {
  const articlePath = getArticlePath(article);

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "group flex flex-col gap-8",
        featured
          ? "lg:flex-row lg:items-stretch lg:gap-0 border border-brand-border bg-white shadow-3xl relative overflow-hidden"
          : "bg-transparent",
      )}
    >
      {featured && (
        <div className="absolute inset-0 bg-engraving opacity-[0.03] pointer-events-none" />
      )}

      <Link href={articlePath}
        className={cn(
          "relative overflow-hidden bg-brand-ink w-full z-10",
          featured
            ? "lg:flex-[1.1] lg:aspect-auto lg:border-r border-brand-border"
            : "aspect-[16/10] border border-brand-border",
        )}
      >
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-6 left-6">
          <span className="bg-brand-ink text-brand-offwhite px-5 py-2 text-[9px] font-sans font-bold uppercase tracking-[0.4em] border border-brand-gold/30">
            {article.category}
          </span>
        </div>
      </Link>

      <div
        className={cn(
          "flex flex-col justify-between relative z-10",
          featured ? "lg:flex-1 p-12 lg:p-20" : "py-6",
        )}
      >
        <div>
          <div className="flex items-center gap-6 text-[9px] font-sans font-bold text-brand-muted uppercase tracking-[0.4em] mb-10">
            <span className="text-brand-gold">{formatDate(article.date)}</span>
            <span className="h-px w-10 bg-brand-border" />
            <span className="text-brand-ink opacity-60">
              Fil. {article.author.split(" ").pop()}
            </span>
          </div>

          <Link href={articlePath}>
            {featured ? (
              <h2 className="font-serif font-normal leading-[1.05] tracking-tighter text-brand-ink text-6xl md:text-8xl mb-12 group-hover:italic transition-all">
                {article.title}
              </h2>
            ) : (
              <h3 className="font-serif font-normal leading-[1.2] tracking-tight text-brand-ink text-4xl mb-8 group-hover:italic transition-all group-hover:text-brand-gold">
                {article.title}
              </h3>
            )}
          </Link>

          <p
            className={cn(
              "font-body text-brand-ink/80 leading-[1.8] font-normal mb-12",
              featured
                ? "text-[1.1875rem] md:text-[1.3125rem] max-w-xl"
                : "text-[1.0625rem] md:text-[1.125rem] line-clamp-3",
            )}
          >
            {article.description}
          </p>
        </div>

        <Link href={articlePath}
          className="inline-flex items-center gap-8 text-[10px] font-sans font-bold uppercase tracking-[0.5em] group/link py-3 mt-auto"
        >
          <span className="text-brand-ink relative">
            Explorar Tratado
            <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-brand-gold scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left" />
          </span>
          <ArrowRight className="h-4 w-4 text-brand-gold transition-transform group-hover/link:translate-x-4" />
        </Link>
      </div>
    </motion.article>
  );
}
