import Sidebar from "@/libs/atvsld/components/Sidebar";

export default function MainLayout({children}: {children: React.ReactNode}) {
    return (
      <html lang="en">
        <body className={`antialiased`}>
          <Sidebar />
          {children}
        </body>
      </html>
    );
}