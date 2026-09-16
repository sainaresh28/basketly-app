'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import type { Category } from '@/types';

type HeroSlide = { desktop: string; mobile?: string };

const NEW_ARRIVALS_SLIDES: HeroSlide[] = [
  { desktop: '/reference/hero/new-arrivals-desktop.png', mobile: '/reference/hero/new-arrivals-mobile.png' },
  { desktop: '/reference/fashion.jpg', mobile: '/reference/fashion.jpg' },
];
const FOOTWEAR_SLIDES: HeroSlide[] = [
  { desktop: '/reference/hero/footwear-desktop.png', mobile: '/reference/hero/footwear-mobile.png' },
  { desktop: '/reference/hero/footwear-category.png', mobile: '/reference/hero/footwear-mobile.png' },
];
const ACCESSORIES_SLIDES: HeroSlide[] = [
  { desktop: '/reference/hero/accessories-desktop.png', mobile: '/reference/hero/accessories-mobile.png' },
  { desktop: '/reference/watch.jpg', mobile: '/reference/watch.jpg' },
];
const SHOP_ALL_SLIDES: HeroSlide[] = [
  { desktop: '/reference/hero/shop-all-desktop.png', mobile: '/reference/hero/shop-all-mobile.png' },
  { desktop: '/reference/cart.jpg', mobile: '/reference/cart.jpg' },
];

const HERO_CATEGORIES = [
  { slug: 'fashion', label: 'Clothing', image: '/reference/hero/clothing.png' },
  { slug: 'lifestyle', label: 'Footwear', image: '/reference/hero/footwear-category.png' },
  { slug: 'lifestyle', label: 'Electronics', image: '/reference/hero/electronics.png' },
  { slug: 'lifestyle', label: 'Bags', image: '/reference/hero/bags.png' },
  { slug: 'home', label: 'Home & Living', image: '/reference/hero/home-living.png' },
];

function ChevronLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
function ArrowRightIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg className="w-[31px] h-[31px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9.5" strokeWidth={1.4} />
      <path d="M10.5 9l4.5 3-4.5 3V9z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Faithful port of the reference app's HeroVisualTile: cycles through a fixed
 *  set of slides, crossing each new one in with a slide or flip animation.
 *  Renders the dedicated mobile crop below `lg` and the dedicated desktop
 *  crop at `lg` and up, since each has its own baked-in caption/copy. */
function HeroVisualTile({
  href,
  label,
  slides,
  transition,
  className = '',
  priority = false,
  sizesMobile = '100vw',
  sizesDesktop = '34vw',
}: {
  href: string;
  label: string;
  slides: HeroSlide[];
  transition: 'slide' | 'flip';
  className?: string;
  priority?: boolean;
  sizesMobile?: string;
  sizesDesktop?: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const slide = slides[active];
  const animationClass = transition === 'slide' ? 'hero-media-slide' : 'hero-media-flip';

  return (
    <Link
      href={href}
      aria-label={`${label} collection`}
      className={`bento-card group relative block w-full bg-foreground ${className}`}>
      <div key={`${label}-${active}`} className={`absolute inset-0 ${animationClass}`}>
        <div className="absolute inset-0 lg:hidden">
          <AppImage
            src={slide.mobile || slide.desktop}
            alt={`${label} collection`}
            fill
            sizes={sizesMobile}
            priority={priority}
            className="object-cover w-full h-full" />
        </div>
        <div className="absolute inset-0 hidden lg:block">
          <AppImage
            src={slide.desktop}
            alt={`${label} collection`}
            fill
            sizes={sizesDesktop}
            priority={priority}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
        </div>
      </div>
    </Link>
  );
}

function StatItem({ value, label, border = true }: { value: string; label: string; border?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 min-w-0 ${border ? 'border-r border-foreground/20 pr-3 lg:pr-[18px]' : ''}`}>
      <strong className="font-display font-black text-sm lg:text-base leading-none text-foreground">{value}</strong>
      <small className="text-[7px] lg:text-[8px] font-semibold uppercase leading-tight tracking-wide text-muted-foreground">{label}</small>
    </div>
  );
}

interface HeroProps {
  categories: Category[];
}

export default function Hero({ categories }: HeroProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const totalSlides = 3;

  return (
    <section className="pt-24 lg:pt-28 pb-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-none mx-auto">
        {/* Feature grid — intro + rotating visual tiles.
            Mobile: 2-col grid — intro sits beside New Arrivals in row 1, Footwear
            beside Accessories in row 2, Shop All full-width in row 3. Row heights
            are driven by each tile's own aspect ratio, so it scales cleanly across
            phone widths.
            Desktop (lg+): bento grid — intro | tall new-arrivals | 3 stacked tiles. */}
        <div
          className="grid grid-cols-2 gap-2
                     lg:grid-cols-[minmax(220px,0.9fr)_minmax(390px,1.2fr)_minmax(240px,0.82fr)]
                     lg:grid-rows-[repeat(3,minmax(150px,1fr))] lg:min-h-[590px]">

          {/* Intro */}
          <div className="col-start-1 row-start-1 lg:col-start-1 lg:row-start-1 lg:row-span-3 flex flex-col justify-between min-w-0 py-1">
            <div>
              <div className="flex items-center gap-2 lg:gap-3.5 text-[8px] lg:text-[10px] font-semibold tracking-[0.22em] uppercase text-foreground/70">
                <i className="section-rule w-5 lg:w-8" /> Everyday essentials
              </div>
              <h1 className="mt-4 lg:mt-[22px] font-display font-black uppercase text-foreground leading-[0.78] tracking-tight text-[clamp(2.35rem,9.7vw,3.65rem)] lg:text-[clamp(4.25rem,5.4vw,6.35rem)]">
                Discover<br />
                <span className="text-primary whitespace-nowrap">what&apos;s next.</span>
              </h1>
              <p className="mt-3 lg:mt-[18px] text-[13px] lg:text-[15px] leading-tight text-foreground/80 max-w-[280px]">
                Everyday essentials<br className="hidden sm:block" /> for a better everyday life.
              </p>
              <div className="flex items-center gap-2.5 lg:gap-[18px] mt-3.5 lg:mt-[18px]">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2.5 lg:gap-[15px] rounded-full bg-foreground text-background pl-4 pr-2.5 py-2.5 lg:pl-[22px] lg:pr-[11px] lg:py-[11px] text-[9px] lg:text-[11px] font-bold uppercase hover:bg-primary transition-colors">
                  Shop now
                  <span className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-background/15 flex items-center justify-center">
                    <ArrowRightIcon className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                  </span>
                </Link>
                <button
                  type="button"
                  aria-label="Watch our story"
                  className="hidden lg:flex items-center gap-2 text-foreground hover:text-primary transition-colors text-left"
                >
                  <PlayIcon />
                  <span className="text-[8px] font-semibold uppercase leading-tight">
                    Watch<br />our story
                  </span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-stretch gap-2 lg:gap-[18px] mt-6 lg:mt-7">
                <StatItem value="50+" label={'Curated items'} />
                <StatItem value="100+" label={'Happy customers'} />
                <StatItem value="Free" label={'India-wide shipping'} border={false} />
              </div>
              <div className="flex items-center justify-between mt-6 lg:mt-[34px] pr-1 lg:pr-[3px]">
                <span className="flex items-center gap-1.5 lg:gap-[9px] text-[8px] lg:text-[9px] font-semibold text-foreground/70">
                  {String(slideIndex + 1).padStart(2, '0')}
                  <i className="inline-block w-[30px] lg:w-[42px] h-[2px] bg-primary" />
                  {String(totalSlides).padStart(2, '0')}
                </span>
                <span className="flex gap-1.5 lg:gap-2.5">
                  <button
                    type="button"
                    aria-label="Previous hero item"
                    onClick={() => setSlideIndex((i) => (i - 1 + totalSlides) % totalSlides)}
                    className="w-7 h-7 lg:w-8 lg:h-8 rounded-full border border-foreground/20 flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <ChevronLeftIcon />
                  </button>
                  <button
                    type="button"
                    aria-label="Next hero item"
                    onClick={() => setSlideIndex((i) => (i + 1) % totalSlides)}
                    className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-primary border border-primary flex items-center justify-center text-white"
                  >
                    <ChevronRightIcon />
                  </button>
                </span>
              </div>
            </div>
          </div>

          {/* New Arrivals — beside intro in row 1 on mobile, tall center column on desktop */}
          <HeroVisualTile
            href="/new-arrivals"
            label="New arrivals"
            slides={NEW_ARRIVALS_SLIDES}
            transition="slide"
            priority
            sizesMobile="50vw"
            sizesDesktop="34vw"
            className="col-start-2 row-start-1 aspect-[384/548] lg:aspect-auto lg:col-start-2 lg:row-start-1 lg:row-span-3"
          />

          {/* Footwear — beside Accessories in row 2 on mobile, top-right on desktop */}
          <HeroVisualTile
            href="/products?category=footwear"
            label="Footwear"
            slides={FOOTWEAR_SLIDES}
            transition="flip"
            sizesMobile="50vw"
            sizesDesktop="34vw"
            className="col-start-1 row-start-2 aspect-[392/272] lg:aspect-auto lg:col-start-3 lg:row-start-1"
          />

          {/* Accessories — beside Footwear in row 2 on mobile, middle-right on desktop */}
          <HeroVisualTile
            href="/products?category=electronics"
            label="Accessories"
            slides={ACCESSORIES_SLIDES}
            transition="slide"
            sizesMobile="50vw"
            sizesDesktop="34vw"
            className="col-start-2 row-start-2 aspect-[394/272] lg:aspect-auto lg:col-start-3 lg:row-start-2"
          />

          {/* Shop All — full-width row 3 on mobile, bottom-right on desktop */}
          <HeroVisualTile
            href="/products"
            label="Shop all"
            slides={SHOP_ALL_SLIDES}
            transition="flip"
            sizesMobile="100vw"
            sizesDesktop="34vw"
            className="col-span-2 row-start-3 aspect-[805/210] lg:aspect-auto lg:col-span-1 lg:col-start-3 lg:row-start-3"
          />
        </div>
      </div>

      {/* Browse Categories — lives only inside the Hero section */}
      <div className="max-w-none mx-auto mt-5 lg:mt-8 pb-5 lg:pb-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/70">
              <i className="section-rule" /> Browse
            </span>
            <h2 className="mt-1 font-display font-black uppercase leading-[0.82] text-4xl sm:text-5xl text-foreground">Categories</h2>
          </div>
          <Link href="/products" className="flex items-center gap-1 pb-1 text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors">
            View all <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 lg:gap-2 mt-5">
          {(categories.length ? categories.slice(0, 5) : []).map((cat, i) => {
            const fallback = HERO_CATEGORIES[i];
            const image = fallback?.image || cat.image;
            const label = fallback?.label || cat.name;
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                aria-label={label}
                className="group relative overflow-hidden rounded-md lg:rounded-lg bg-muted aspect-[1.3] sm:aspect-[1.1] lg:aspect-[1.6]">
                <AppImage
                  src={image}
                  alt={label}
                  fill
                  sizes="(max-width: 640px) 33vw, 20vw"
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                <span className="sr-only">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
