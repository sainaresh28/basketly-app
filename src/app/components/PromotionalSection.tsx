import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

export default function PromotionalSection() {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left — dark editorial */}
          <div className="relative rounded-3xl overflow-hidden bg-dark-surface min-h-[420px] flex flex-col justify-end p-8 sm:p-10">
            <AppImage
              src="https://img.rocket.new/generatedImages/rocket_gen_img_1d2462a3d-1785312006865.png"
              alt="Model wearing relaxed fit hoodie in dark studio, moody atmospheric lighting, deep shadows"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-50" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-dark-surface/40 to-transparent" />
            <div className="relative z-10">
              <span className="badge-sale mb-3 inline-block">Up to 30% Off</span>
              <h2 className="font-display font-black text-white text-display-md uppercase leading-none mb-3">
                Season<br />End Sale
              </h2>
              <p className="text-white/60 text-sm mb-6 max-w-xs">Premium essentials at unbeatable prices. Limited time only.</p>
              <Link href="/sale" className="btn-primary py-3 px-6 text-xs">
                Shop Sale
              </Link>
            </div>
          </div>

          {/* Right — light editorial */}
          <div className="relative rounded-3xl overflow-hidden bg-secondary min-h-[420px] flex flex-col justify-end p-8 sm:p-10">
            <AppImage
              src="https://img.rocket.new/generatedImages/rocket_gen_img_170d15885-1772227833235.png"
              alt="Premium watch on warm amber background, bright studio lighting, clean product photography"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-70" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/30 to-transparent" />
            <div className="relative z-10">
              <span className="badge-new mb-3 inline-block">New Arrivals</span>
              <h2 className="font-display font-black text-foreground text-display-md uppercase leading-none mb-3">
                Timepieces<br />& Accessories
              </h2>
              <p className="text-foreground/70 text-sm mb-6 max-w-xs">Curated watches and everyday carry for the modern person.</p>
              <Link href="/products?category=watches" className="btn-dark py-3 px-6 text-xs">
                Explore Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>);

}