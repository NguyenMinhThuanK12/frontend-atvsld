import Sidebar from "@/libs/atvsld/components/Sidebar";
import DepartmentPage from "@/libs/atvsld/pages/DepartmentPage";

export default function Page() {
  return (
    <div className="flex flex-col items-center min-h-screen p-24 text-xl text-gray-700">
      <Sidebar />
      <DepartmentPage />
    </div>
  );
}
