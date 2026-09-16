export const BRAND = {
  name: 'Basketly',
  tagline: 'Modern Lifestyle Marketplace',
  description: 'Curated products for modern everyday living.',
  email: 'basketly.vercel.app@gmail.com',
  phone: '+9109876 54321',
  address: 'Berhampur, Odisha',
  socials: {
    instagram: '#',
    twitter: '#',
    facebook: '#',
    youtube: '#',
  },
  nav: {
    main: [
      { label: 'Home', href: '/' },
      { label: 'New Arrivals', href: '/new-arrivals' },
      { label: 'Sale', href: '/sale' },
      { label: 'Categories', href: '/products' },
      { label: 'Support', href: '/support' },
    ],
    footer: {
      shop: [
        { label: 'All Products', href: '/products' },
        { label: 'New Arrivals', href: '/new-arrivals' },
        { label: 'Best Sellers', href: '/products?sort=popular' },
        { label: 'Sale', href: '/sale' },
      ],
      help: [
        { label: 'FAQ', href: '/support#faq' },
        { label: 'Shipping', href: '/support#shipping' },
        { label: 'Returns', href: '/support#returns' },
        { label: 'Track Order', href: '/support#track-order' },
      ],
      company: [
        { label: 'About', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
  },
} as const;