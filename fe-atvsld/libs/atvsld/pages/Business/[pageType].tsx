"use client";

import { NextPage } from "next";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getBusinessById } from "../../services/api/businessApi";
import { Business } from "@/libs/shared/atvsld/models/business.model";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { CheckCheck, ChevronRight, X } from "lucide-react";
import {
  defaultBusiness,
  handleCreateBusiness,
  handleUpdateBusiness,
} from "../../components/BusinessFeature/handleBusinessFeatures";
import { Box, CircularProgress, Step, StepLabel, Stepper } from "@mui/material";
import TextButton from "@/libs/core/components/Button/textBtn";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import { QontoConnector } from "@/libs/core/styles/CustomizedConnector";
import { FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import EntryPage from "./components/EntryPage";
import ReviewPage from "./components/ReviewPage";

interface Page {
  title: string;
  content: (
    formData: Business,
    handleSubmit?: UseFormHandleSubmit<Business>,
    errors?: FieldErrors<Business> | null
  ) => React.JSX.Element;
}

const BusinessDetail: NextPage = () => {
  const { pageType } = useParams() as { pageType?: string };
  const isCreate = pageType === "create";
  const isUpdate = pageType === "update";
  const isView = pageType === "view";
  const [selectedId, setSelectedId] = useState<string>("");
  const [value, setValue] = useState<Business>(defaultBusiness);
  const query = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Add loading state
  const [activeStep, setActiveStep] = useState(0);
  const [handleSubmitForm, setHandleSubmitForm] =
    useState<UseFormHandleSubmit<Business> | null>(null);

  // Notify
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
    duration?: number;
  } | null>(null);

  const showAlert = (
    content: string,
    type: "success" | "error" | "warning" | "info",
    duration = 2000
  ) => setAlert({ content, type, duration });

  // multi-step form
  const steps = ["Thông tin doanh nghiệp", "Xác nhận đăng ký"];

  const pages: Record<number, Page> = {
    0: {
      title: steps[0],
      content: (formData) => (
        <EntryPage
          formData={formData}
          mode={selectedId ? "update" : "create"}
          setHandleSubmit={(handleSubmit) => {
            setHandleSubmitForm(() => handleSubmit);
          }}
        />
      ),
    },
    1: {
      title: steps[1],
      content: (formData) => <ReviewPage formData={formData} />,
    },
  };

  // get by id
  useEffect(() => {
    const id = query.get("id");
    if (id) {
      setSelectedId(id);
      getDetail(id);
    }
  }, [selectedId]);

  const getDetail = async (id: string) => {
    try {
      const response = await getBusinessById(id);
      if (!response.data || response.status !== 200) {
        showAlert(`Không tìm thấy doanh nghiệp với ID: ${id}`, "error");
        return;
      }
      setValue(response.data);
    } catch (error) {
      console.error("Error fetching business detail:", error);
      showAlert("Đã xảy ra lỗi khi lấy thông tin doanh nghiệp.", "error");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/businesses");
  };

  // handle refresh after success
  const handleRefresh = () => {
    setSelectedId("");
    router.push("/dashboard/businesses?declaration=success");
  };

  // handle back to previous step or cancel
  const handleBack = () => {
    if (activeStep === 0) {
      handleCancel();
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  // handle update value and send to review page
  const handleNext = async () => {
    if (!handleSubmitForm) {
      console.error("handleSubmitForm is not set");
      showAlert("Đã xảy ra lỗi khi xử lý biểu mẫu.", "error");
      return;
    }
    // transfer data to review page
    await handleSubmitForm(
      (data) => {
        console.log("prepared form:", data);
        setValue(data);
        setActiveStep((prevActiveStep) =>
          Math.min(prevActiveStep + 1, Object.keys(pages).length - 1)
        );
      },
      (errors) => {
        console.error("Form submission errors:", errors);
        showAlert("Vui lòng điền đầy đủ thông tin bắt buộc.", "error");
      }
    )();
  };

  const handleSubmit = async () => {
    console.log("Submitting form with data:", value);

    setLoading(true);
    const success = selectedId
      ? await handleUpdateBusiness(value)
      : await handleCreateBusiness(value);

    setLoading(false);
    if (success) {
      handleRefresh();
      return;
    }
    showAlert("Khai báo thất bại !", "error", 2000);
  };

  return (
    <div>
      <div className="w-full h-full flex flex-col items-center justify-between">
        {isView && (
          <div className="w-full h-screen relative overflow-auto bg-white rounded-lg shadow-md py-4 px-8 flex flex-col items-center justify-between z-50">
            <div className="flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer absolute top-2 right-2 z-50">
              <X
                className="text-2xl text-black"
                onClick={(e) => {
                  e.preventDefault();
                  handleCancel();
                }}
              />
            </div>
            <ReviewPage formData={value} />
          </div>
        )}

        {(isUpdate || isCreate) && (
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
                    handleCancel();
                  }}
                  aria-label="Đóng"
                />
              </div>
            </div>
            <div className="w-full h-full overflow-auto p-4">
              {pages[activeStep as keyof typeof pages].content(value)}
            </div>
            <div className="flex items-center justify-end gap-4 w-full mt-4">
              <TextButton
                content={activeStep === steps.length - 1 ? "Trở lại" : "Hủy bỏ"}
                onClick={() => handleBack()}
                aria-label={
                  activeStep === steps.length - 1
                    ? "Quay lại bước trước"
                    : "Hủy bỏ"
                }
              />
              <PrimaryButton
                content={
                  activeStep === steps.length - 1 ? "Hoàn tất" : "Tiếp theo"
                }
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
                onClick={
                  activeStep === steps.length - 1 ? handleSubmit : handleNext
                }
                aria-label={
                  activeStep === steps.length - 1
                    ? "Hoàn tất đăng ký"
                    : "Tiếp tục"
                }
                disabled={loading}
              />
            </div>
          </div>
        )}

        {(isView || isUpdate) && value === null && (
          <div>Không tìm thấy thông tin doanh nghiệp.</div>
        )}

        {alert && (
          <Alert
            content={alert.content}
            type={alert.type}
            duration={alert.duration}
            onClose={() => setAlert(null)}
          />
        )}
      </div>
    </div>
  );
};

export default BusinessDetail;
