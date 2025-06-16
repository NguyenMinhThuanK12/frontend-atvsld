import {
  checkDuplicateYearFeature,
  createReportConfigurationFeature,
  defaultReport,
  getReportConfigurationByIdFeature,
  updateReportConfigurationFeature,
} from "@/libs/atvsld/components/ReportFeature/handleReportFeature";
import { renderLabelWithAsterisk } from "@/libs/atvsld/utils/commonFunction";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import { Report } from "@/libs/shared/atvsld/models/report.model";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
} from "@mui/material";
import { Save, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import PrimarySelectField from "@/libs/core/components/FormFields/primarySelectField";
import {
  ReportingPeriodOptions,
  ReportTypeOptions,
} from "@/libs/atvsld/utils/fetchEnum";
import { Controller, useForm } from "react-hook-form";
import PrimaryDatePicker from "@/libs/core/components/DatePicker/PrimaryDatePicker";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { debounce } from "lodash";

interface ReportConfigDetailProps {
  openModal: boolean;
  onClose: () => void;
  onSave: () => void;
  selectedId?: string;
}

export default function ReportConfigDetail(props: ReportConfigDetailProps) {
  const { openModal, onClose, onSave, selectedId } = props;
  const [selectedReport, setSelectedReport] = useState<Report>(defaultReport);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    control,
    watch,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
  } = useForm<Report>({
    defaultValues: selectedReport,
    mode: "onSubmit",
  });

  // debugging

  // notify
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
    duration?: number; // optional duration for the alert
  } | null>(null);

  const showAlert = (
    content: string,
    type: "success" | "error" | "warning" | "info",
    duration = 2000
  ) => {
    setAlert({ content, type, duration });
    setTimeout(() => {
      setAlert(null);
    }, duration);
  };

  useEffect(() => {
    if (selectedId) {
      getDetail(selectedId);
    } else {
      reset(defaultReport);
    }
  }, [selectedId]);

  const getDetail = async (id: string) => {
    try {
      const response = await getReportConfigurationByIdFeature(id);
      if (!response) {
        throw new Error("No report configuration found with the given ID");
      }
      console.log("Fetched report configuration:", response);

      setSelectedReport(response);
      setIsActive(response.isActive);
      reset(response);
    } catch (error) {
      console.error("Error fetching report configuration:", error);
    }
  };

  const handleToggleActiveStatus = () => {
    setValue("isActive", !isActive);
    setIsActive((prev) => !prev);
  };

  // create debounced functions for checking duplicate year
  const debouncedCheckDuplicateYear = useCallback(
    debounce(async (reportName: string, year: string) => {
      if (!year || !reportName) {
        clearErrors("year");
        return;
      }
      const isDuplicate = await checkDuplicateYearFeature(reportName, year);
      console.log("Duplicate year check result:", isDuplicate);

      if (isDuplicate) {
        setError("year", {
          type: "manual",
          message: "Báo cáo cho năm này đã tồn tại",
        });
        console.log("Duplicate year found:", year);
        
      } else {
        clearErrors("year");
      }
    }, 1000),
    []
  );

  const yearVal = watch("year");
  const reportName = watch("reportName");

  // check duplicate year
  useEffect(() => {
    if (yearVal && reportName && !selectedId) {
      console.log("Checking for duplicate year:", yearVal, reportName);

      debouncedCheckDuplicateYear(reportName, yearVal.toString());
    }
  }, [yearVal, reportName]);

  const handleCreateReportConfiguration = async (report: Report) => {
    try {
      const response = await createReportConfigurationFeature(report);

      if (!response) {
        throw new Error("Failed to create report configuration");
      }

      return !!response;
    } catch (error) {
      console.error("Error creating report configuration:", error);
      return false;
    }
  };

  const handleUpdateReportConfiguration = async (report: Report) => {
    try {
      const response = await updateReportConfigurationFeature(report);

      if (!response) {
        throw new Error("Failed to update report configuration");
      }

      return !!response;
    } catch (error) {
      console.error("Error updating report configuration:", error);
      return false;
    }
  };

  const onSubmit = async (data: Report) => {
    const isValid = await trigger();

    if (!isValid) {
      showAlert("Vui lòng kiểm tra lại thông tin đã nhập", "error");
      return;
    }

    setLoading(true);
    const success = selectedId
      ? await handleUpdateReportConfiguration(data)
      : await handleCreateReportConfiguration(data);

    setLoading(false);
    if (success) {
      reset(defaultReport);
      onSave();
    }
  };

  return (
    <Dialog
      open={openModal}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {selectedId
              ? "Chỉnh sửa cấu hình báo cáo"
              : "Thêm mới cấu hình báo cáo"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </DialogTitle>
      <Divider
        sx={{
          borderColor: "#e6e6e6",
          borderBottomWidth: 2,
          mx: "auto",
          width: "97%",
        }}
      />
      {/* Context */}
      <DialogContent sx={{ pt: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)} className="h-full w-full">
          <div className="flex flex-col space-y-6">
            {/* Report name */}
            <Controller
              name="reportName"
              control={control}
              rules={{ required: "Tên báo cáo là bắt buộc" }}
              render={({ field }) => (
                <PrimarySelectField
                  label={renderLabelWithAsterisk("Tên báo cáo", true)}
                  options={ReportTypeOptions}
                  value={field.value || ""}
                  error={!!errors.reportName}
                  helperText={errors.reportName?.message}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  disabled={!!selectedId} // Disable if editing
                />
              )}
            />

            <Grid container spacing={4}>
              {/* Year */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="year"
                  control={control}
                  rules={{
                    required: "Năm là bắt buộc",
                    validate: (value) => value > 1900 || "Năm không hợp lệ",
                  }}
                  render={({ field }) => (
                    <PrimaryDatePicker
                      label={renderLabelWithAsterisk("Năm", true)}
                      value={field.value ? new Date(field.value, 0) : null}
                      onChange={(date: Date | null) => {
                        field.onChange(date ? date.getFullYear() : null);
                      }}
                      views={["year"]}
                      format="yyyy"
                      error={!!errors.year}
                      helperText={errors.year?.message}
                      disabled={!!selectedId}
                    />
                  )}
                />
              </Grid>

              {/* Reporting period */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="reportingPeriod"
                  control={control}
                  rules={{
                    required: "Kỳ báo cáo là bắt buộc",
                  }}
                  render={({ field }) => (
                    <PrimarySelectField
                      label={renderLabelWithAsterisk("Kỳ báo cáo", true)}
                      options={ReportingPeriodOptions}
                      value={field.value || ""}
                      error={!!errors.reportingPeriod}
                      helperText={errors.reportingPeriod?.message}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                      disabled={!!selectedId}
                    />
                  )}
                />
              </Grid>

              {/* Start Date */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{
                    required: "Ngày bắt đầu là bắt buộc",
                  }}
                  render={({ field }) => (
                    <PrimaryDatePicker
                      label={renderLabelWithAsterisk("Ngày bắt đầu", true)}
                      value={field.value || null}
                      onChange={(date: Date | null) => field.onChange(date)}
                      error={!!errors.startDate}
                      helperText={errors.startDate?.message}
                    />
                  )}
                />
              </Grid>

              {/* End Date */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="endDate"
                  control={control}
                  rules={{
                    required: "Ngày kết thúc là bắt buộc",
                    validate: (value: Date | null) => {
                      const startDate = watch("startDate");
                      if (!value) return true;
                      if (startDate && value <= startDate) {
                        return "Ngày kết thúc phải sau ngày bắt đầu";
                      }
                      if (value < new Date() && !selectedId) {
                        return "Ngày kết thúc không được trong quá khứ";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <PrimaryDatePicker
                      label={renderLabelWithAsterisk("Ngày kết thúc", true)}
                      value={field.value || null}
                      onChange={(date: Date | null) => field.onChange(date)}
                      error={!!errors.endDate}
                      helperText={errors.endDate?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <div className="w-full flex items-center justify-between">
              {/* Active toggle */}
              {selectedId ? (
                <div className="w-[10vw] px-2 flex items-center justify-between">
                  <span className="text-md font-medium text-gray-700">
                    Trạng thái
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleActiveStatus}
                    className={`relative inline-flex h-4 w-10 items-center rounded-full transition-colors ${
                      isActive ? "bg-[#93b0ff]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-primary transition-transform ${
                        isActive ? "translate-x-5" : "-translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ) : (
                <div></div>
              )}

              {/* submit button */}
              <PrimaryButton
                content="Lưu"
                disabled={loading}
                icon={
                  loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )
                }
                size="medium"
                type="submit"
                className="bg-blue-600 text-white px-6 py-1.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              />
            </div>
          </div>
        </form>
        {alert && (
          <Alert
            content={alert.content}
            type={alert.type}
            duration={alert.duration}
            onClose={() => setAlert(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
