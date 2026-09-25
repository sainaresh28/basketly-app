'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './ui/AdminSidebar';
import AdminTopbar from './ui/AdminTopbar';

export default function AdminShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <AdminSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} userName={userName} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminTopbar userName={userName} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
