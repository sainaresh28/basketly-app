import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import type { Category } from '@/types';

interface PhilosophySectionProps {
  categories: Category[];
}

export default function PhilosophySection({ categories }: PhilosophySectionProps) {
  const [tileOne, tileTwo] = categories;

  return (
    <section className="bg-muted">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr]">
        {/* Left — copy */}
        <div className="flex flex-col justify-end p-8 sm:p-10 lg:p-14">
          <span className="section-label mb-6">02 — The Point of View</span>
          <h2 className="font-display font-black uppercase text-display-xl text-foreground leading-[0.88]">
            More<br />
            <span className="text-primary">You.</span><br />
            Less Noise.
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-6 text-muted-foreground">
            Basketly is a little corner for makers, objects and ideas we keep coming back to.
            No endless scroll. Just the good stuff.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 w-fit text-sm font-bold text-foreground border-b-2 border-foreground pb-1 hover:border-primary hover:text-primary transition-colors">
            Meet The Edit
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M7 7h10v10" />
            </svg>
          </Link>
        </div>

        {/* Right — image grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 p-5 sm:p-10">
          {tileOne && (
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <AppImage
                src={tileOne.image}
                alt={tileOne.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover" />
            </div>
          )}
          {tileTwo && (
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <AppImage
                src={tileTwo.image}
                alt={tileTwo.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover" />
            </div>
          )}
          <div className="col-span-2 relative min-h-[190px] rounded-2xl overflow-hidden bg-dark-surface p-6 flex items-end">
            <AppImage
              src="https://img.rocket.new/generatedImages/rocket_gen_img_1dfb1d20c-1786278109737.png"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-40" />
            <div className="relative z-10">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">03 — Small Rituals</span>
              <p className="font-display font-bold uppercase text-2xl sm:text-3xl leading-[0.95] text-white mt-3 max-w-[300px]">
                Make an ordinary Tuesday feel like something.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
