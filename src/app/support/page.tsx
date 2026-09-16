import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import FaqAccordion from './components/FaqAccordion';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Support — Basketly',
  description: 'FAQs, shipping, returns, order tracking and how to reach the Basketly team.',
};

const FAQS = [
  {
    question: 'How long does delivery take?',
    answer: 'Most orders ship within 1-2 business days and arrive within 3-6 business days depending on your location. You\u2019ll get a tracking link by email as soon as your order leaves the warehouse.',
  },
  {
    question: 'Is shipping really free?',
    answer: 'Yes — shipping is free on all orders over \u20b9999. Orders below that threshold have a flat \u20b979 shipping charge, shown at checkout before you pay.',
  },
  {
    question: 'What is your return policy?',
    answer: 'You can return most items within 7 days of delivery, as long as they\u2019re unused, unwashed and in their original packaging. Refunds are issued to your original payment method once the return is received.',
  },
  {
    question: 'How do I track my order?',
    answer: 'Log in and go to Account \u2192 Orders to see live status, or use the tracking link sent to your email. You can also reach out to us directly with your order number.',
  },
  {
    question: 'Can I change or cancel an order after placing it?',
    answer: 'Orders can be cancelled from the Orders page as long as they haven\u2019t shipped yet. Once an order is out for delivery it can no longer be changed, but you can still return it after it arrives.',
  },
  {
    question: 'Which payment methods do you accept?',
    answer: 'We accept all major cards, UPI and net banking through Razorpay, as well as cash on delivery on eligible orders.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Right now we only ship within India. We\u2019re working on international shipping and will announce it on our socials when it\u2019s live.',
  },
];

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[7.5rem] min-h-screen">
        {/* Hero */}
        <section className="px-4 sm:px-6 lg:px-10 pb-10">
          <div className="max-w-[1440px] mx-auto">
            <span className="section-label mb-2 block">We&rsquo;re here to help</span>
            <h1 className="font-display font-black text-display-xl uppercase text-foreground leading-none">
              Support
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-lg">
              Answers to common questions about shipping, returns and your orders. Can&rsquo;t find what you need? Reach out and we&rsquo;ll get back to you.
            </p>
          </div>
        </section>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
          <div className="min-w-0">
            {/* FAQ */}
            <section id="faq" className="scroll-mt-32">
              <h2 className="font-display font-black text-display-md uppercase text-foreground mb-6">
                Frequently Asked Questions
              </h2>
              <FaqAccordion items={FAQS} />
            </section>

            {/* Shipping */}
            <section id="shipping" className="scroll-mt-32 mt-14">
              <h2 className="font-display font-black text-display-md uppercase text-foreground mb-4">
                Shipping
              </h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3 max-w-2xl">
                <p>Free shipping on all orders over ₹999 — a flat ₹79 charge applies below that. Orders are processed within 1-2 business days and typically arrive within 3-6 business days across India.</p>
                <p>You&rsquo;ll receive an email with a tracking link the moment your order ships, and can follow its progress anytime from Account → Orders.</p>
              </div>
            </section>

            {/* Returns */}
            <section id="returns" className="scroll-mt-32 mt-14">
              <h2 className="font-display font-black text-display-md uppercase text-foreground mb-4">
                Returns &amp; Refunds
              </h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3 max-w-2xl">
                <p>Not the right fit? Items can be returned within 7 days of delivery if they&rsquo;re unused, unwashed and in original packaging. Start a return from Account → Orders, or contact us with your order number.</p>
                <p>Once your return is received and inspected, refunds are issued to your original payment method — usually within 5-7 business days.</p>
              </div>
            </section>

            {/* Track order */}
            <section id="track-order" className="scroll-mt-32 mt-14">
              <h2 className="font-display font-black text-display-md uppercase text-foreground mb-4">
                Track Your Order
              </h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3 max-w-2xl">
                <p>The fastest way to check an order&rsquo;s status is Account \u2192 Orders, which shows live updates from processing through delivery.</p>
                <Link href="/orders" className="btn-outline py-3 px-6 text-xs inline-flex mt-2">
                  View My Orders
                </Link>
              </div>
            </section>
          </div>

          {/* Contact sidebar */}
          <aside id="contact" className="scroll-mt-32 lg:sticky lg:top-32 h-fit">
            <div className="rounded-3xl bg-muted p-6 sm:p-8">
              <h3 className="font-display font-black text-lg uppercase text-foreground mb-4">
                Still need help?
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Our team usually responds within one business day.
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Email</p>
                  <a href={`mailto:${BRAND.email}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors break-all">
                    {BRAND.email}
                  </a>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Phone</p>
                  <a href={`tel:${BRAND.phone.replace(/\s+/g, '')}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    {BRAND.phone}
                  </a>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Address</p>
                  <p className="text-sm font-semibold text-foreground">{BRAND.address}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}
