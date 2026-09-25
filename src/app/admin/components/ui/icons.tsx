import React from 'react';

export type IconProps = React.SVGProps<SVGSVGElement>;

const base = (children: React.ReactNode, props: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={18}
    height={18}
    {...props}>
    {children}
  </svg>
);

export const GridIcon = (p: IconProps) =>
  base(
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>,
    p
  );

export const BoxIcon = (p: IconProps) =>
  base(
    <>
      <path d="M21 8 12 3 3 8l9 5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </>,
    p
  );

export const TagIcon = (p: IconProps) =>
  base(
    <>
      <path d="M20.59 13.41 12 22l-9-9 8.59-8.59A2 2 0 0 1 13 4h6a1 1 0 0 1 1 1v6a2 2 0 0 1-.41 1.41Z" />
      <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
    </>,
    p
  );

export const CartIcon = (p: IconProps) =>
  base(
    <>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6" />
    </>,
    p
  );

export const UsersIcon = (p: IconProps) =>
  base(
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c.7-3.6 3.4-5.8 6.5-5.8s5.8 2.2 6.5 5.8" />
      <path d="M16.5 5.2a3.2 3.2 0 0 1 0 6.2" />
      <path d="M16 14.4c2.6.5 4.6 2.5 5.2 5.6" />
    </>,
    p
  );

export const HeartIcon = (p: IconProps) =>
  base(<path d="M12 21s-7.5-4.6-10-9.4C.4 8.1 2.3 4.5 6 4c2.2-.3 4.1.9 6 3.1C13.9 4.9 15.8 3.7 18 4c3.7.5 5.6 4.1 4 7.6C19.5 16.4 12 21 12 21Z" />, p);

export const StoreIcon = (p: IconProps) =>
  base(
    <>
      <path d="M3 9.5 4.2 4h15.6L21 9.5" />
      <path d="M3 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M10 20v-5.5a2 2 0 0 1 4 0V20" />
    </>,
    p
  );

export const SettingsIcon = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </>,
    p
  );

export const SearchIcon = (p: IconProps) =>
  base(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>,
    p
  );

export const BellIcon = (p: IconProps) =>
  base(
    <>
      <path d="M18 8a6 6 0 1 0-12 0c0 5.5-2 7-2 7h16s-2-1.5-2-7Z" />
      <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
    </>,
    p
  );

export const MenuIcon = (p: IconProps) =>
  base(
    <>
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </>,
    p
  );

export const CloseIcon = (p: IconProps) =>
  base(
    <>
      <path d="m18 6-12 12" />
      <path d="m6 6 12 12" />
    </>,
    p
  );

export const ChevronDownIcon = (p: IconProps) => base(<path d="m6 9 6 6 6-6" />, p);

export const ChevronRightIcon = (p: IconProps) => base(<path d="m9 18 6-6-6-6" />, p);

export const ChevronLeftIcon = (p: IconProps) => base(<path d="m15 18-6-6 6-6" />, p);

export const LogoutIcon = (p: IconProps) =>
  base(
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </>,
    p
  );

export const ExternalLinkIcon = (p: IconProps) =>
  base(
    <>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </>,
    p
  );

export const ArrowUpRightIcon = (p: IconProps) =>
  base(
    <>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </>,
    p
  );

export const PlusIcon = (p: IconProps) =>
  base(
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>,
    p
  );

export const ClockIcon = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>,
    p
  );

export const AlertIcon = (p: IconProps) =>
  base(
    <>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.9 1.8 18a1.8 1.8 0 0 0 1.55 2.7h17.3A1.8 1.8 0 0 0 22.2 18L13.7 3.9a1.8 1.8 0 0 0-3.4 0Z" />
    </>,
    p
  );
