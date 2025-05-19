// app/dashboard/department/page.tsx
"use client";

import React, { useState, useCallback } from "react";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { getDepartments } from "@/libs/atvsld/services/api/departmentApi";
import { Department } from "@/libs/shared/atvsld/models/department.model";

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
    const [loading, setLoading] = useState(false);
    
    const showAlert = useCallback((
        content: string,
        type: "success" | "error" | "warning" | "info",
        duration = 2000
    ) => {
        setAlert({ content, type });
        const timer = setTimeout(() => setAlert(null), duration);
        return () => clearTimeout(timer);
    }, []);

  const handleGetDepartments = async () => {
    setLoading(true);
    try {
      const response = await getDepartments();
      console.log("Departments response:", response);
      if (response.length) {
        setDepartments(response);
        showAlert("Lấy danh sách đơn vị thành công.", "success");
      } else {
        showAlert("Không có đơn vị nào được tìm thấy.", "error");
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setAlert({
        content: "Lỗi khi lấy danh sách đơn vị. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-24 text-xl text-gray-700">
      <h1 className="text-2xl font-semibold mb-6">Department Management</h1>

      {alert && (
        <Alert
          content={alert.content}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <PrimaryButton
        content={loading ? "Loading..." : "Get Departments"}
        type="button"
        onClick={handleGetDepartments}
        disabled={loading}
      />

      {departments.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-lg font-medium mb-2">Danh sách đơn vị:</h2>
          <ul className="border rounded-lg divide-y divide-gray-200">
            {departments.map((dept) => (
              <li key={dept.id} className="p-4">
                <span className="font-medium">{dept.name}</span> (ID: {dept.id})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
