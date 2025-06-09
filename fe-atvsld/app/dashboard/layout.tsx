"use client";

import { useAdminMenuItems } from "@/libs/atvsld/components/AuthFeature/handleAuthFeature";
import Sidebar from "@/libs/atvsld/components/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  
    const menuItems = useAdminMenuItems();
  
  return (
    <>
      <Sidebar menuItems={menuItems} />
      <main className="pl-80 bg-[url('/img/background.jpg')] bg-cover bg-no-repeat bg-center h-screen">
        {children}
      </main>
    </>
  );
}
