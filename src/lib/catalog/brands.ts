import type { Brand, Product } from '@/types';
import { slugify } from '../../utils/format';

/** Short, deliberately generic category descriptors — no marketing claims or unverifiable specifics. */
const BRAND_DESCRIPTIONS: Record<string, string> = {
  'Fabindia': 'Indian lifestyle brand known for handcrafted ethnic wear and home products.',
  'Allen Solly': 'Indian apparel brand for smart-casual and formal menswear and womenswear.',
  'Peter England': 'Indian menswear brand focused on formal and casual shirts and trousers.',
  'Raymond': 'Indian textile and apparel company known for suiting fabrics and formal wear.',
  'W for Woman': 'Indian womenswear brand focused on ethnic and contemporary fashion.',
  'Biba': 'Indian womenswear brand specialising in ethnic and fusion styles.',
  'Manyavar': 'Indian ethnic menswear brand focused on festive and wedding wear.',
  'Bata': 'Footwear brand with a long-standing retail presence across India.',
  'Woodland': 'Indian outdoor and casual footwear and apparel brand.',
  'Red Tape': 'Indian footwear and accessories brand for formal and casual wear.',
  'Campus': 'Indian sports and casual footwear brand.',
  'Liberty': 'Indian footwear manufacturer and retailer.',
  'boAt': 'Indian consumer electronics brand focused on audio and wearables.',
  'Noise': 'Indian consumer electronics brand known for smartwatches and audio products.',
  'pTron': 'Indian consumer electronics brand for mobile accessories and audio.',
  'Zebronics': 'Indian computer peripherals and consumer electronics brand.',
  'Portronics': 'Indian brand for mobile and computer accessories.',
  'Mivi': 'Indian audio brand focused on earbuds and speakers.',
  'Wildcraft': 'Indian outdoor gear brand known for backpacks and travel equipment.',
  'Baggit': 'Indian fashion accessories brand focused on women\u2019s handbags.',
  'Hidesign': 'Indian leather goods brand for bags, wallets and accessories.',
  'Safari': 'Indian luggage and travel gear brand.',
  'Skybags': 'Indian luggage and backpack brand.',
  'Nilkamal': 'Indian furniture and storage products manufacturer.',
  'Home Centre': 'Indian home furnishings and decor retail brand.',
  'Wakefit': 'Indian home and sleep products brand.',
  'Fabindia Home': 'Home furnishings and decor line from Fabindia.',
  'Titan': 'Indian watch and eyewear brand from Titan Company.',
  'Fastrack': 'Youth-focused accessories and watch brand from Titan Company.',
  'Sonata': 'Value-focused watch brand from Titan Company.',
  'Nivia': 'Indian sports equipment and footwear brand.',
  'Cosco': 'Indian sports goods manufacturer.',
  'Vector X': 'Indian sportswear and sports accessories brand.',
  'SG': 'Indian cricket equipment manufacturer.',
  'Mamaearth': 'Indian personal care brand focused on natural-ingredient skincare and haircare.',
  'Biotique': 'Indian skincare and haircare brand with an Ayurveda-inspired range.',
  'WOW Skin Science': 'Indian personal care brand for skin and haircare.',
  'Plum': 'Indian skincare and beauty brand focused on plant-based formulations.',
  'Forest Essentials': 'Indian luxury Ayurvedic skincare and beauty brand.',
  'Prestige': 'Indian kitchen appliances and cookware brand.',
  'Hawkins': 'Indian pressure cookers and cookware brand.',
  'Milton': 'Indian insulated bottles, flasks and home products brand.',
  'Borosil': 'Indian glassware and kitchen appliances brand.',
  'Cello': 'Indian housewares, storage and dinnerware brand.',
  'Havells': 'Indian electrical equipment and home appliances brand.',
  'Voltas': 'Indian air conditioning and cooling appliances brand.',
  'Bajaj': 'Indian home appliances and electricals brand.',
  'Crompton': 'Indian home appliances, fans and lighting brand.',
  'V-Guard': 'Indian electrical products, water heaters and stabilisers brand.',
  'Funskool': 'Indian toys and games company.',
  'LuvLap': 'Indian baby products and gear brand.',
  'Mee Mee': 'Indian baby care and feeding products brand.',
  'Ok Play': 'Indian toys and play equipment manufacturer.',
  'Ant Esports': 'Indian gaming peripherals and accessories brand.',
  'iBall': 'Indian computer accessories and consumer electronics brand.',
  'Lapcare': 'Indian laptop and computer accessories brand.',
};

/** Derives a real Brand record for every distinct brand used across the catalog. */
export function buildBrandRecords(products: Product[]): Brand[] {
  const names = Array.from(new Set(products.map((p) => p.brand))).sort();
  return names.map((name) => {
    const slug = slugify(name);
    return {
      id: `brand-${slug}`,
      slug,
      name,
      description: BRAND_DESCRIPTIONS[name],
    };
  });
}
