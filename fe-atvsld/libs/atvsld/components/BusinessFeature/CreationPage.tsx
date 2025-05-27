import { Business } from "@/libs/shared/atvsld/models/business.model";
import React, { useEffect, useState } from "react";
import InputForm from "./InputForm";
import ReviewSubmit from "./ReviewSubmit";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { Box, Step, StepLabel, Stepper } from "@mui/material";
import { CheckCheck, ChevronRight, X } from "lucide-react";
import TextButton from "@/libs/core/components/Button/textBtn";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import { QontoConnector } from "@/libs/core/styles/CustomizedConnector";
import { FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { updateBusiness } from "../../services/api/businessApi";
import { UpdateBusinessRequest } from "@/libs/shared/atvsld/dto/request/updateBusinessRequest";

interface CreationPageProps {
  onComeBack: () => void;
  initialFormData?: Business | null;
  mode: "create" | "update";
  onRefresh?: () => void;
}

interface Page {
  title: string;
  content: (
    formData: Business | null,
    setFormData: React.Dispatch<React.SetStateAction<Business | null>>,
    mode?: "create" | "update",
    handleSubmit?: UseFormHandleSubmit<Business>,
    errors?: FieldErrors<Business> | null
  ) => React.JSX.Element;
}

export default function CreationPage({
  onComeBack,
  onRefresh,
  initialFormData = null,
  mode = "create",
}: CreationPageProps) {
  // show alert
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const showAlert = (
    content: string,
    type: "success" | "error" | "warning" | "info",
    duration = 2000
  ) => {
    setAlert({ content, type });
    setTimeout(() => setAlert(null), duration);
  };

  const [formData, setFormData] = useState<Business | null>(initialFormData);
  const [activeStep, setActiveStep] = useState(0);
  const [formErrors, setFormErrors] = useState<FieldErrors<Business> | null>(
    null
  );
  const [handleSubmitForm, setHandleSubmitForm] =
    useState<UseFormHandleSubmit<Business> | null>(null);
  const [isFormReady, setIsFormReady] = useState(false);
  const [triggerValidation, setTriggerValidation] = useState<
    (() => Promise<boolean>) | null
  >(null);
  const steps = ["Thông tin doanh nghiệp", "Xác nhận đăng ký"];

  //   useEffect(() => {
  //     console.log("Initial form data:", initialFormData);
  //     console.log("Form data state:", formData);
  //   }, [initialFormData, formData]);

  const pages: Record<number, Page> = {
    0: {
      title: steps[0],
      content: (formData, setFormData, triggerValidation) => (
        <InputForm
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          setFormErrors={setFormErrors}
          setHandleSubmit={(handleSubmit) => {
            setHandleSubmitForm(() => handleSubmit);
            setIsFormReady(true); // Mark form as ready once handleSubmit is set
          }}
        />
      ),
    },
    1: {
      title: steps[1],
      content: (formData) => <ReviewSubmit formData={formData} />,
    },
  };

  useEffect(() => {
    console.log(
      "Form data after file upload, trigger from Creation page:",
      formData
    );
  }, [formData]);

  // handle next
  const handleNext = async () => {
    if (!isFormReady || !handleSubmitForm) {
      showAlert("Biểu mẫu chưa sẵn sàng. Vui lòng chờ một chút.", "warning");
      return;
    }

    await handleSubmitForm(
      (data) => {
        console.log("Form submitted successfully:", data); // it contains new value from form
        console.log("Form data before update:", formData); // it contains files which I have uploaded but don't contains values from form

        const updatedFormData = {
          ...formData, // Preserve existing file data
          ...data, // Override with validated form data
          establishedDate: data.establishedDate
            ? format(new Date(data.establishedDate), "yyyy-MM-dd")
            : null,
          businessLicenseFile: formData?.businessLicenseFile || null,
          otherDocumentFile: formData?.otherDocumentFile || null,
        };

        console.log("Updated form data:", updatedFormData); // can not merge, because when logging I see businessLicenseFile and otherDocumentFile are null

        setFormData(updatedFormData);
        setActiveStep((prevActiveStep) =>
          Math.min(prevActiveStep + 1, Object.keys(pages).length - 1)
        );
      },
      () => {
        console.log("Validation failed:", formErrors);
        showAlert("Vui lòng điền đầy đủ thông tin bắt buộc.", "error");
      }
    )();
  };

  // handle previous
  const handleBack = () => {
    if (activeStep === 0) {
      console.log("Closing CreationPage and navigating back");

      onComeBack();
    } else {
      setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
    }
  };

  // handle submit
    const handleSubmit = async () => {
      
    if (!formData) {
      showAlert("Vui lòng điền đầy đủ thông tin doanh nghiệp.", "error");
      return;
    } else if (mode === "create") {
      // Call API to create business
      showAlert("Đăng ký doanh nghiệp thành công!", "success");
    } else if (mode === "update") {
        const updatedBusiness: UpdateBusinessRequest = {
          name: formData.name || "",
          establishedDate: formData.establishedDate
            ? format(
                new Date(formData.establishedDate),
                "yyyy-MM-dd'T'HH:mm:ssXXX"
              )
            : null,
            businessType: formData.businessType || "",
          mainBusinessField: formData.mainBusinessField || "",
          registrationCity: formData.registrationCity || "",
          registrationDistrict: formData.registrationDistrict || "",
          registrationWard: formData.registrationWard || "",
          registrationAddress: formData.registrationAddress || "",
          operationCity: formData.operationCity || "",
          operationDistrict: formData.operationDistrict || "",
          operationWard: formData.operationWard || "",
          operationAddress: formData.operationAddress || "",
          foreignName: formData.foreignName || "",
          email: formData.email || "",
          phoneNumber: formData.phoneNumber || "",
          representativeName: formData.representativeName || "",
          representativePhone: formData.representativePhone || "",
          businessLicenseFile: formData.businessLicenseFile || null,
          otherDocumentFile: formData.otherDocumentFile || null,
        };
        try {
            const response = await updateBusiness(
              formData.id || "",
              updatedBusiness
            );
            showAlert("Cập nhật doanh nghiệp thành công!", "success");
            onComeBack();
            if (onRefresh) onRefresh();
      } catch (error) {
          showAlert("Lỗi khi cập nhật doanh nghiệp.", "error");
            console.error("Error updating business:", error);
      }

      showAlert("Cập nhật doanh nghiệp thành công!", "success");
    }
    // onComeBack();
    // if (onRefresh) onRefresh();
  };

  const router = useRouter();

  return (
    <div className="w-full h-screen overflow-auto bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-between z-50">
      <div className="flex items-center justify-center w-full relative px-5">
        <Box sx={{ width: "50%", padding: "10px" }}>
          <Stepper activeStep={activeStep} connector={<QontoConnector />}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <div className="h-7 w-7 cursor-pointer absolute right-0 top-0">
          <X
            onClick={(e) => {
              console.log(
                "Closing CreationPage and navigating back to businesses"
              );
              e.preventDefault();
              router.push("/dashboard/businesses");
            }}
            aria-label="Đóng"
          />
        </div>
      </div>
      <div className="w-full h-full overflow-auto p-4">
        {pages[activeStep as keyof typeof pages].content(
          formData,
          setFormData,
          mode,
          undefined,
          formErrors
        )}
      </div>
      <div className="flex items-center justify-end gap-4 w-full mt-4">
        <TextButton
          content={activeStep === steps.length - 1 ? "Trở lại" : "Hủy bỏ"}
          onClick={() => handleBack()}
          aria-label={
            activeStep === steps.length - 1 ? "Quay lại bước trước" : "Hủy bỏ"
          }
        />
        <PrimaryButton
          content={activeStep === steps.length - 1 ? "Hoàn tất" : "Tiếp theo"}
          icon={
            activeStep === steps.length - 1 ? <CheckCheck /> : <ChevronRight />
          }
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          aria-label={
            activeStep === steps.length - 1 ? "Hoàn tất đăng ký" : "Tiếp tục"
          }
        />
      </div>
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
