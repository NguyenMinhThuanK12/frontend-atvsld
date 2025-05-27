"use client";

import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import TextButton from "@/libs/core/components/Button/textBtn";
import {
  Box,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
  styled,
} from "@mui/material";
import { CheckCheck, ChevronRight, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import InputForm from "./InputForm";
import ReviewSubmit from "./ReviewSubmit";
import { Department } from "@/libs/shared/atvsld/models/department.model";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import {
  createDepartment,
  updateDepartment,
} from "../../services/api/departmentApi";
import { BusinessType } from "@/libs/shared/core/enums/businessType";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { UpdateDepartmentRequest } from "@/libs/shared/atvsld/dto/request/updateDepartmentRequest";

interface Page {
  title: string;
  content: (
    formData: Department | null,
    setFormData: React.Dispatch<React.SetStateAction<Department | null>>,
    mode?: "create" | "edit"
  ) => React.JSX.Element;
}

interface OverallPopupProps {
  onClose: () => void;
  initialFormData?: Department | null;
  mode?: "create" | "edit";
  onRefresh?: () => void;
}

export default function OverallPopup({
  onClose,
  initialFormData = null,
  mode = "create",
  onRefresh = () => {},
}: OverallPopupProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Department | null>(
    initialFormData
    // || {
    //   id: 0,
    //   name: "",
    //   taxCode: "",
    //   businessType: "" as BusinessType,
    //   mainBusinessField: "",
    //   registrationCity: "",
    //   registrationDistrict: "",
    //   registrationWard: "",
    //   registrationAddress: null,
    //   operationCity: null,
    //   operationDistrict: null,
    //   operationWard: null,
    //   operationAddress: null,
    //   foreignName: null,
    //   email: null,
    //   phoneNumber: null,
    //   representativeName: null,
    //   representativePhone: null,
    //   isActive: true,
    //   businessLicenseFile: null,
    //   otherDocumentFile: null,
    //   establishedDate: null,
    // }
  );
  const steps = ["Thông tin doanh nghiệp", "Xác nhận đăng ký"];

  const pages: Record<number, Page> = {
    0: {
      title: steps[0],
      content: (formData, setFormData) => (
        <InputForm formData={formData} setFormData={setFormData} mode={mode} />
      ),
    },
    1: {
      title: steps[1],
      content: (formData, setFormData) => (
        <ReviewSubmit
          formData={formData as Department}
          setFormData={setFormData}
        />
      ),
    },
  };

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

  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 16,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: theme.palette.primary.main,
        transition: "all 0.4s ease-in-out",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: theme.palette.primary.main,
        transition: "all 1s ease-in-out",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: "#ccc",
      borderRadius: 1,
      transition: "all 0.4s ease-in-out",
    },
  }));

  const handleNext = () => {
    console.log("Current form data:", formData);
    console.log("Business License:", formData?.businessLicenseFile);
    console.log("Other Document File:", formData?.otherDocumentFile);
    setActiveStep((prevActiveStep) =>
      Math.min(prevActiveStep + 1, Object.keys(pages).length - 1)
    );
  };

  const handleBack = () => {
    if (activeStep === 0) {
      onClose();
    } else {
      setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
    }
  };

  const handleSubmit = async () => {
    console.log("Submitted data:", formData);
    try {
      if (!formData) {
        throw new Error(
          "Dữ liệu biểu mẫu trống. Vui lòng điền đầy đủ thông tin."
        );
      }

      // Prepare formData with establishedDate as Date or null
      const formattedFormData: Department = {
        ...formData,
        establishedDate: formData.establishedDate
          ? new Date(formData.establishedDate)
          : null,
      };

      if (mode === "create") {
        const response = await createDepartment(formattedFormData);
        console.log("Create Response:", response);
        showAlert("Khai báo thành công!", "success");
      } else {
        const id = formData.id;
        if (!id) throw new Error("ID không hợp lệ để cập nhật.");
        // create Update department Request
        const updateRequest: UpdateDepartmentRequest = {
          name: formattedFormData.name || "",
          establishedDate: formattedFormData.establishedDate
            ? format(new Date(formattedFormData.establishedDate), "yyyy-MM-dd")
            : null,
          businessType: formattedFormData.businessType || "",
          mainBusinessField: formattedFormData.mainBusinessField || "",
          registrationCity: formattedFormData.registrationCity || "",
          registrationDistrict: formattedFormData.registrationDistrict || "",
          registrationWard: formattedFormData.registrationWard || "",
          registrationAddress: formattedFormData.registrationAddress || "",
          operationCity: formattedFormData.operationCity || "",
          operationDistrict: formattedFormData.operationDistrict || "",
          operationWard: formattedFormData.operationWard || "",
          operationAddress: formattedFormData.operationAddress || "",
          foreignName: formattedFormData.foreignName || "",
          email: formattedFormData.email || "",
          phoneNumber: formattedFormData.phoneNumber || "",
          representativeName: formattedFormData.representativeName || "",
          representativePhone: formattedFormData.representativePhone || "",
          businessLicenseFile: formattedFormData.businessLicenseFile || null,
          otherDocumentFile: formattedFormData.otherDocumentFile || null,
        };
        const response = await updateDepartment(id, updateRequest);
        if (response.status !== 200) {
          showAlert(response.message, "error");
          return;
        }
        console.log("Update Response:", response);
        showAlert("Khai báo thành công!", "success");
      }

      /*
      // Optional: If your API requires FormData for file uploads, use this instead
      const formDataToSend = new FormData();
      formDataToSend.append("id", String(formData.id));
      formDataToSend.append("name", formData.name || "");
      formDataToSend.append("taxCode", formData.taxCode || "");
      formDataToSend.append("businessType", formData.businessType || "");
      formDataToSend.append("mainBusinessField", formData.mainBusinessField || "");
      formDataToSend.append("registrationCity", formData.registrationCity || "");
      formDataToSend.append("registrationDistrict", formData.registrationDistrict || "");
      formDataToSend.append("registrationWard", formData.registrationWard || "");
      formDataToSend.append("registrationAddress", formData.registrationAddress || "");
      formDataToSend.append("operationCity", formData.operationCity || "");
      formDataToSend.append("operationDistrict", formData.operationDistrict || "");
      formDataToSend.append("operationWard", formData.operationWard || "");
      formDataToSend.append("operationAddress", formData.operationAddress || "");
      formDataToSend.append("foreignName", formData.foreignName || "");
      formDataToSend.append("email", formData.email || "");
      formDataToSend.append("phoneNumber", formData.phoneNumber || "");
      formDataToSend.append("representativeName", formData.representativeName || "");
      formDataToSend.append("representativePhone", formData.representativePhone || "");
      formDataToSend.append("isActive", String(formData.isActive));
      if (formData.establishedDate) {
        formDataToSend.append(
          "establishedDate",
          format(new Date(formData.establishedDate), "yyyy-MM-dd")
        );
      }
      if (formData.businessLicenseFile instanceof File) {
        formDataToSend.append("businessLicenseFile", formData.businessLicenseFile);
      } else if (typeof formData.businessLicenseFile === "string") {
        formDataToSend.append("businessLicense", "");
      }
      if (formData.otherDocumentFile instanceof File) {
        formDataToSend.append("otherDocumentFile", formData.otherDocumentFile);
      } else if (typeof formData.otherDocumentFile === "string"){
        formDataToSend.append("otherFile", "");
      }

      if (mode === "create") {
        const response = await createDepartment(formDataToSend);
        console.log("Create Response:", response);
        showAlert("Khai báo thành công!", "success");
      } else {
        const id = formData.id;
        if (!id) throw new Error("ID không hợp lệ để cập nhật.");
        const response = await updateDepartment(id, formDataToSend);
        if (response.status !== 200) {
          showAlert(response.message, "error");
          return;
        }
        console.log("Update Response:", response);
        showAlert("Khai báo thành công!", "success");
      }
      */
    } catch (error) {
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} department:`,
        error
      );
      showAlert(
        `Có lỗi xảy ra khi ${mode === "create" ? "tạo" : "cập nhật"} đơn vị.`,
        "error"
      );
    }
    setTimeout(() => {
      onClose();
      if (onRefresh) {
        onRefresh();
      }
    }, 2000);
  };

  return (
    <div className="w-[80vw] max-h-[90vh] overflow-auto bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-between z-50">
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
          <X onClick={onClose} aria-label="Đóng" />
        </div>
      </div>
      <div className="w-full h-full overflow-auto p-4">
        {pages[activeStep as keyof typeof pages].content(formData, setFormData)}
      </div>
      <div className="flex items-center justify-end gap-4 w-full mt-4">
        <TextButton
          content={activeStep === steps.length - 1 ? "Trở lại" : "Hủy bỏ"}
          onClick={handleBack}
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
