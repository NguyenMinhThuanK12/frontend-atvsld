import Sidebar from "@/libs/atvsld/components/Sidebar";
import { ErrorBoundary } from "react-error-boundary";
import Cookies from "js-cookie";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  console.log(Cookies.get("fullname"));
  

    return (
      <html lang="en">
        <body className={`antialiased`}>
          <ErrorBoundary
            fallback={<div>Lỗi hiển thị sidebar, vui lòng thử lại.</div>}
          >
            <Sidebar />
          </ErrorBoundary>
          ;{children}
        </body>
      </html>
    );
}