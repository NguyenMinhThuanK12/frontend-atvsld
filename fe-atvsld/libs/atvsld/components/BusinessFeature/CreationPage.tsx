import { Business } from "@/libs/shared/atvsld/models/business.model";
import React, { useEffect, useState } from "react";
import InputForm from "./InputForm";
import ReviewSubmit from "./ReviewSubmit";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { Box, CircularProgress, Step, StepLabel, Stepper } from "@mui/material";
import { CheckCheck, ChevronRight, X } from "lucide-react";
import TextButton from "@/libs/core/components/Button/textBtn";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import { QontoConnector } from "@/libs/core/styles/CustomizedConnector";
import { FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { format } from "date-fns";
import { createBusiness, updateBusiness } from "../../services/api/businessApi";
import { UpdateBusinessRequest } from "@/libs/shared/atvsld/dto/request/business/updateBusinessRequest";
import { CreationBusinessRequest } from "@/libs/shared/atvsld/dto/request/business/creationBussinessRequest";

interface CreationPageProps {
  onComeBack: () => void;
  initialFormData: Business | null;
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
    duration?: number; // Duration in milliseconds
  } | null>(null);

  const showAlert = (
    content: string,
    type: "success" | "error" | "warning" | "info",
    duration = 2000
  ) => {
    setAlert({ content, type, duration });
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
  const steps = ["Thông tin doanh nghiệp", "Xác nhận đăng ký"];

  const pages: Record<number, Page> = {
    0: {
      title: steps[0],
      content: (formData, setFormData) => (
        <InputForm
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          setFormErrors={setFormErrors}
          setHandleSubmit={(handleSubmit) => {
            setHandleSubmitForm(() => handleSubmit);
            setIsFormReady(true);
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
    console.log("Form Data after changing:", formData);
  }, [initialFormData]);

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
      (errors) => {
        console.error("Form submission errors:", errors);

        // const errorMessages = [];
        // if (errors.taxCode?.message) errorMessages.push(errors.taxCode.message);
        // if (errors.email?.message) errorMessages.push(errors.email.message);
        // showAlert(
        //   errorMessages.length > 0
        //     ? errorMessages.join(", ")
        //     : "Vui lòng điền đầy đủ thông tin bắt buộc.",
        //   "error"
        // );
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

  const [loading, setLoading] = useState(false); // Add loading state
  const [success, setSuccess] = useState(false); // Existing success state

  // handle submit
  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(false);
    if (!formData) {
      setLoading(false);
      showAlert("Vui lòng điền đầy đủ thông tin doanh nghiệp.", "error");
      return;
    } else if (mode === "create") {
      const creationBusiness: CreationBusinessRequest = {
        name: formData.name || "",
        taxCode: formData.taxCode || "",
        establishedDate: formData.establishedDate || "",
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
        const response = await createBusiness(creationBusiness);
        if (response.status !== 201) {
          showAlert("Không thể cập nhật doanh nghiệp.", "error");
          console.log("message from backend: ", response.message);
          setLoading(false);
          return;
        }
        setSuccess(true);
      } catch (error) {
        showAlert("Lỗi khi tạo doanh nghiệp.", "error");
        console.error("Error creating business:", error);
        setLoading(false);
        return;
      }
    } else if (mode === "update") {
      const updatedBusiness: UpdateBusinessRequest = {
        name: formData.name || "",
        establishedDate: formData.establishedDate || "",
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
        if (response.status !== 200) {
          showAlert("Không thể cập nhật doanh nghiệp.", "error");
          console.log("message from backend: ", response.message);
          setLoading(false);
          return;
        }
        setSuccess(true);
      } catch (error) {
        showAlert("Lỗi khi cập nhật doanh nghiệp.", "error");
        console.error("Error updating business:", error);
        setLoading(false);
      }
    }
    setLoading(false);
    if (onRefresh) {
      onRefresh();
    }
  };

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
              e.preventDefault();
              onComeBack();
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
            activeStep === steps.length - 1 ? (
              loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <CheckCheck />
              )
            ) : (
              <ChevronRight />
            )
          }
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          aria-label={
            activeStep === steps.length - 1 ? "Hoàn tất đăng ký" : "Tiếp tục"
          }
          disabled={loading}
        />
      </div>
      {alert && (
        <Alert
          content={alert.content}
          type={alert.type}
          duration={alert.duration}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
