'use client';
import Link from 'next/link';
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  path: string;
  count: number;
}

export function CategoryCard({
  title,
  description,
  image,
  path,
  count,
}: CategoryCardProps) {
  return (
    <Link href={path}
      className="group relative block bg-white border border-brand-border h-[400px]"
    >
      <div className="h-full w-full relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-all duration-700 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 bg-gradient-to-t from-brand-offwhite via-brand-offwhite/20 to-transparent">
          <span className="mb-4 text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-brand-gold">
            {count} Entradas de Conocimiento
          </span>
          <h3 className="mb-4 font-serif text-[2.25rem] md:text-[2.5rem] tracking-tight text-brand-ink group-hover:italic transition-all">
            {title}
          </h3>
          <p className="font-body text-[1.0625rem] md:text-[1.125rem] text-brand-ink/80 leading-[1.6] max-w-[280px] transition-opacity group-hover:opacity-100">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
