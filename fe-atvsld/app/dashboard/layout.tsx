"use client";

import Sidebar from "@/libs/atvsld/components/Sidebar";
import { AuthProvider } from "@/libs/atvsld/services/context/AuthContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  
  return (
    <>
      <Sidebar />
      <main className="pl-80 bg-[url('/img/background.jpg')] bg-cover bg-no-repeat bg-center h-screen">
        {children}
      </main>
    </>
  );
}
