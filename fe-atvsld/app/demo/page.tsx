"use client";

// import { testMenuConfig } from "@/libs/atvsld/components/AuthFeature/handleAuthFeature";
// import { defaultReportSanitationForm } from "@/libs/atvsld/components/Client/Report-ATVSLD/handleReportFeature";
import Header from "@/libs/atvsld/components/Header";
// import { PDFDocument, PDFViewer } from "@/libs/atvsld/components/pdf";
import Sidebar from "@/libs/atvsld/components/Sidebar";
// import ReportSanitationPage from "@/libs/atvsld/pages/Clients/Report";
// import ReportDemo from "@/libs/atvsld/pages/Clients/Report/components/demo-report2";
import ReportDetail from "@/libs/atvsld/pages/Clients/Report/pageDetail_demo";

import React from "react";

export default function page() {
  return (
    <>
      <Header
        title="Chi tiết báo cáo ATVSLD"
        creationPermission={false}
      />
      <Sidebar />
      <main className="pl-80 bg-[url('/img/background.jpg')] bg-cover bg-no-repeat bg-center h-screen">
        <div className="pt-20 flex flex-col items-center text-xl text-gray-700 h-full overflow-hidden">
          <ReportDetail />
        </div>
      </main>
    </>
  );
}
