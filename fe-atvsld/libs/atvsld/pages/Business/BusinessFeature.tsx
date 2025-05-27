"use client";

import ReviewSubmit from "@/libs/atvsld/components/BusinessFeature/ReviewSubmit";
import InputForm from "@/libs/atvsld/components/BusinessFeature/InputForm"; // Adjust path if needed
import CreationPage from "@/libs/atvsld/components/BusinessFeature/CreationPage"; // Adjust path if needed
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { CreationBusinessRequest } from "@/libs/shared/atvsld/dto/request/creationBussinessRequest";
import { UpdateBusinessRequest } from "@/libs/shared/atvsld/dto/request/updateBusinessRequest";
import { Business } from "@/libs/shared/atvsld/models/business.model";
import { X } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBusinessById } from "../../services/api/businessApi";

// Assume an API function to fetch business data
// async function fetchBusiness(id: string): Promise<Business | null> {
//   try {
//     const response = await fetch(`/api/businesses/${id}`); // Replace with your API endpoint
//     if (!response.ok) throw new Error("Failed to fetch business");
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching business:", error);
//     return null;
//   }
// }

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

  // Handle close
  const handleClose = () => {
    router.push("/dashboard/businesses");
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

  // handle display detail (mode === "view")
  // useEffect(() => {
  //   console.log(
  //     "BusinessFeature useEffect triggered with id:",
  //     id,
  //     "and mode:",
  //     mode
  //   );

  //   if ((mode === "view" || mode === "update") && id !== "new") {
  //     fetchById(id);
  //     console.log("formData after fetch:", formData);
  //   } else {
  //     setFormData(null);
  //     setLoading(false);
  //   }
  // }, [id, mode]); 

  useEffect(() => {
    if ((mode === "view" || mode === "update") && id !== "new") {
      fetchById(id).then(() => {
        console.log("formData after fetch:", formData);
      });
    } else {
      setFormData(null);
      setLoading(false);
    }
  }, [id, mode]);

  useEffect(() => {
    console.log("BusinessFeature re-rendered with id:", id, "and mode:", mode);
  });

  // Handle refresh (e.g., re-fetch data after create/update)
  const handleRefresh = () => {
    // call fetchBusinesses
    showAlert("Đã cập nhật thông tin doanh nghiệp.", "success");
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
          initialFormData={null}
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
