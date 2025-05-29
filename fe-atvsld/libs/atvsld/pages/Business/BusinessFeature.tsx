"use client";

import ReviewSubmit from "@/libs/atvsld/components/BusinessFeature/ReviewSubmit";
import CreationPage from "@/libs/atvsld/components/BusinessFeature/CreationPage"; // Adjust path if needed
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { Business } from "@/libs/shared/atvsld/models/business.model";
import { X } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBusinessById } from "../../services/api/businessApi";
import { BusinessType } from "@/libs/shared/core/enums/businessType";

export default function BusinessFeature() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const mode =
    (searchParams.get("mode") as "view" | "update" | "create") || "view";

  const [formData, setFormData] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  // Notify
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  // Show alert
  const showAlert = (
    content: string,
    type: "success" | "error" | "warning" | "info",
    duration = 2000
  ) => {
    setAlert({ content, type });
    setTimeout(() => setAlert(null), duration);
  };

  const fetchById = async (id: string) => {
    try {
      const response = await getBusinessById(id);
      if (response.data) {
        setFormData(response.data);
        setLoading(false);
      } else {
        showAlert("Không tìm thấy doanh nghiệp với ID: " + id, "error");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching business:", error);
      showAlert("Không tìm thấy doanh nghiệp với ID: " + id, "error");
      return null;
    }
  };

  useEffect(() => {
    if ((mode === "view" || mode === "update") && id !== "new") {
      fetchById(id);
    } else {
      // mode === "create"
      setFormData({
        id: "", // Provide a default or placeholder ID if required
        name: "",
        establishedDate: null,
        businessType: BusinessType.PRIVATE, // Default to the first option
        registrationCity: "",
        registrationDistrict: "",
        registrationWard: "",
        registrationAddress: null,
        operationCity: null,
        operationDistrict: null,
        operationWard: null,
        operationAddress: null,
        foreignName: null,
        email: "",
        phoneNumber: null,
        representativeName: null,
        representativePhone: null,
        businessLicenseFile: null,
        otherDocumentFile: null,
        taxCode: "",
        isActive: true,
        mainBusinessField: "",
      });
      setLoading(false);
    }
  }, [id, mode]);

  // Handle refresh if declaring successfully
  const handleRefresh = () => {
    router.push("/dashboard/businesses?declaration=success");
  };

  // Handle close if users want to go back
  const handleClose = () => {
    router.push("/dashboard/businesses");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container w-full flex flex-col items-center justify-between h-full">
      {mode === "view" && formData && (
        <div className="w-full h-scree relative overflow-auto bg-white rounded-lg shadow-md py-4 px-8 flex flex-col items-center justify-between z-50">
          {/* Close button */}
          <div className="flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer absolute top-2 right-2 z-50">
            <X
              className="text-2xl text-black"
              onClick={(e) => {
                e.preventDefault();
                handleClose();
              }}
            />
          </div>

          <ReviewSubmit formData={formData} />
        </div>
      )}

      {mode === "update" && formData && (
        <CreationPage
          onComeBack={handleClose}
          initialFormData={formData}
          mode="update"
          onRefresh={handleRefresh}
        />
      )}
      {mode === "create" && (
        <CreationPage
          onComeBack={handleClose}
          initialFormData={formData}
          mode="create"
          onRefresh={handleRefresh}
        />
      )}
      {(mode === "view" || mode === "update") && !formData && (
        <div>Không tìm thấy thông tin doanh nghiệp.</div>
      )}

      {/* Alert */}
      {alert && (
        <Alert
          content={alert.content}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
