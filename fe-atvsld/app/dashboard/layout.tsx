import Sidebar from "@/libs/atvsld/components/Sidebar";
import Cookies from "js-cookie";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  console.log(Cookies.get("fullname"));
  

    return (
      <html lang="en">
        <body className="">
          <Sidebar />
          <main className="pl-80 bg-[url('/img/background.jpg')] bg-cover bg-no-repeat bg-center h-screen">
            {children}
          </main>
        </body>
      </html>
    );
}