"use client";

import DepartmentPage from "@/libs/atvsld/pages/DepartmentPage";
// import DepartmentPage from "@/libs/atvsld/pages/DepartmentPageDemo2";
import { useState } from "react";

export default function Page() {
  return (
    <div className="pt-20 flex flex-col items-center text-xl text-gray-700 h-full overflow-hidden">
      <DepartmentPage />
    </div>
  );
}
