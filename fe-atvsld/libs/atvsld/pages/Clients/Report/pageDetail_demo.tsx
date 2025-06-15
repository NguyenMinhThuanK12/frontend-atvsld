import { ReportSanitationForm } from "@/libs/shared/atvsld/models/report-sanitation.model";
import React, { useState } from "react";
import { FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import ReportDemo from "./components/demo-report2";
import ReviewReportDemo from "./components/demo-reviewReport";
import { defaultReportSanitationForm } from "@/libs/atvsld/components/Client/Report-ATVSLD/handleReportFeature";
import { Box, CircularProgress, Step, StepLabel, Stepper } from "@mui/material";
import { CheckCheck, ChevronRight, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import TextButton from "@/libs/core/components/Button/textBtn";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import { QontoConnector } from "@/libs/core/styles/CustomizedConnector";
import OutlineButton from "@/libs/core/components/Button/outlineBtn";

interface Page {
  title: string;
  content: (
    formData: ReportSanitationForm,
    handleSubmit?: UseFormHandleSubmit<ReportSanitationForm>,
    errors?: FieldErrors<ReportSanitationForm> | null
  ) => React.JSX.Element;
}

const ReportDetail = () => {
  const [loading, setLoading] = useState(false); // Add loading state
  const [activeStep, setActiveStep] = useState(0);
  const [value, setValue] = useState<ReportSanitationForm>(
    defaultReportSanitationForm
  );
  const router = useRouter();

  const steps = ["Khai báo", "Xem khai báo"];

  const pages: Record<number, Page> = {
    0: {
      title: steps[0],
      content: (formData) => <ReportDemo formData={formData} />,
    },
    1: {
      title: steps[1],
      content: (formData) => <ReviewReportDemo formData={formData} />,
    },
  };

  const handleCancel = () => {};

  // handle refresh after success
  const handleRefresh = () => {};

  // handle back to previous step or cancel
  const handleBack = () => {
    if (activeStep === 0) {
      handleCancel();
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleSave = async () => {

  }

  const handleSubmit = async () => {
    console.log("value", value);
  };
  return (
    <div className="w-full min-h-[cal(100vw-2px)] overflow-auto bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-between z-50">
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
              handleCancel();
            }}
            aria-label="Đóng"
          />
        </div>
      </div>
      <div className="w-full h-[80vh] overflow-auto p-4">
        {pages[activeStep as keyof typeof pages].content(value)}
      </div>
      <div className="flex items-center justify-end gap-4 w-full mt-4">
        <TextButton
          content={activeStep === steps.length - 1 ? "Trở lại" : "Hủy bỏ"}
          onClick={() => handleBack()}
          sx={activeStep === 0 ? { color: "#919eab" } : {}}
          aria-label={
            activeStep === steps.length - 1 ? "Quay lại bước trước" : "Hủy bỏ"
          }
        />
        {activeStep === steps.length - 1 && (
          <OutlineButton
            content="Lưu"
            onClick={() => handleSave()}
            icon={ loading ? <CircularProgress size={24} color="inherit" /> : <Save className="h-6 w-6" />}
            aria-label="Lưu báo cáo"
          />
        )}
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
    </div>
  );
};

export default ReportDetail;
