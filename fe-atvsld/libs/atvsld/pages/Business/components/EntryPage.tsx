"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Business } from "@/libs/shared/atvsld/models/business.model";
import { Controller, useForm, UseFormHandleSubmit } from "react-hook-form";
import {
  newCityOptions,
  newDistrictOptions,
  newWardOptions,
} from "../../../utils/fetchProvinceJson";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";
import PrimaryTextField from "@/libs/core/components/FormFields/primaryTextInput";
import { renderLabelWithAsterisk } from "../../../utils/commonFunction";
import PrimarySelectField from "@/libs/core/components/FormFields/primarySelectField";
import { businessTypeOptions } from "../../../utils/fetchEnum";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { debounce } from "lodash";
import {
  checkDuplicatedEmail,
  checkDuplicatedTaxCode,
} from "../../../components/BusinessFeature/handleBusinessFeatures";
import LicenseTable from "./LicenseTable";

interface EntryPageProps {
  formData: Business;
  mode: "create" | "update";
  setHandleSubmit?: (handleSubmit: UseFormHandleSubmit<Business>) => void;
}

const EntryPage = (props: EntryPageProps) => {
  const { formData, mode, setHandleSubmit } = props;

  const {
    control,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
    reset,
  } = useForm<Business>({
    defaultValues: formData,
    mode: "onChange",
  });

  // ensure default values are set correctly
  useEffect(() => {
    if (formData) {
      reset(formData);
    }
  }, [formData, reset]);

  // Pass handleSubmit to parent
  useEffect(() => {
    if (setHandleSubmit) {
      setHandleSubmit(handleSubmit);
    }
  }, [setHandleSubmit, handleSubmit]);

  // get data province from json
  const registrationCity = watch("registrationCity");
  const registrationDistrict = watch("registrationDistrict");
  const operationCity = watch("operationCity");
  const operationDistrict = watch("operationDistrict");

  const [selectedRegistrationDistrict, setSelectedRegistrationDistrict] =
    useState<string>(formData?.registrationDistrict || "");
  const [selectedOperationDistrict, setSelectedOperationDistrict] =
    useState<string>(formData?.operationDistrict || "");

  // handle file upload
  const handleFileUpload = (id: number, file: File | null) => {
    id === 1 && file
      ? setValue("businessLicenseFile", file)
      : setValue("businessLicenseFile", null);

    id === 2 && file
      ? setValue("otherDocumentFile", file)
      : setValue("otherDocumentFile", null);
  };

  // Debounced check functions
  const debouncedCheckTaxCode = useCallback(
    debounce(async (taxCode: string) => {
      if (!taxCode) {
        clearErrors("taxCode");
        return;
      }
      const isDuplicate = await checkDuplicatedTaxCode(taxCode);
      if (isDuplicate) {
        setError("taxCode", {
          type: "manual",
          message: "Mã số thuế đã tồn tại",
        });
      } else {
        clearErrors("taxCode");
      }
    }, 800),
    [setError, clearErrors]
  );

  const debouncedCheckEmail = useCallback(
    debounce(async (email: string) => {
      if (!email) {
        clearErrors("email");
        return;
      }
      const isDuplicate = await checkDuplicatedEmail(email);
      if (isDuplicate) {
        setError("email", {
          type: "manual",
          message: "Email đã tồn tại",
        });
      } else {
        clearErrors("email");
      }
    }, 800),
    [setError, clearErrors]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <form className="flex flex-col gap-6 w-full overflow-auto py-4">
        <div className="border rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            {mode === "update"
              ? "Cập nhật thông tin doanh nghiệp"
              : "Thêm mới doanh nghiệp"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 gap-x-6">
            {/* Tên doanh nghiệp */}
            <Controller
              name="name"
              control={control}
              rules={{ required: "Tên doanh nghiệp là bắt buộc" }}
              render={({ field }) => (
                <PrimaryTextField
                  {...field}
                  label={renderLabelWithAsterisk("Tên doanh nghiệp", true)}
                  size="small"
                  value={field.value || ""}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            {/* mã số thuế */}
            <Controller
              name="taxCode"
              control={control}
              rules={{ required: "Mã số thuế là bắt buộc" }}
              render={({ field }) => (
                <PrimaryTextField
                  label={renderLabelWithAsterisk("Mã số thuế", true)}
                  size="small"
                  value={field.value || ""}
                  error={!!errors.taxCode}
                  helperText={errors.taxCode?.message}
                  disabled={mode === "update"}
                  onChange={(e) => {
                    field.onChange(e);
                    if (mode !== "update") {
                      debouncedCheckTaxCode(e.target.value);
                    }
                  }}
                />
              )}
            />

            {/* loại hình kinh doanh */}
            <Controller
              name="businessType"
              control={control}
              rules={{ required: "Loại hình kinh doanh là bắt buộc" }}
              render={({ field }) => (
                <PrimarySelectField
                  label={renderLabelWithAsterisk("Loại hình kinh doanh", true)}
                  size="small"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={!!errors.businessType}
                  options={businessTypeOptions}
                  helperText={errors.businessType?.message}
                />
              )}
            />

            {/* Ngành nghề chính */}
            <Controller
              name="mainBusinessField"
              control={control}
              rules={{ required: "Ngành nghề kinh doanh chính là bắt buộc" }}
              render={({ field }) => (
                <PrimaryTextField
                  label={renderLabelWithAsterisk(
                    "Ngành nghề kinh doanh chính",
                    true
                  )}
                  size="small"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={!!errors.mainBusinessField}
                  helperText={errors.mainBusinessField?.message}
                />
              )}
            />

            {/* Ngày cấp GPKD */}
            <Controller
              name="establishedDate"
              control={control}
              rules={{ required: "Ngày cấp GPKD là bắt buộc" }}
              render={({ field }) => (
                <DatePicker
                  label={renderLabelWithAsterisk("Ngày cấp GPKD", true)}
                  value={field.value ? new Date(field.value) : null}
                  slotProps={{
                    textField: {
                      size: "small",
                      error: !!errors.establishedDate,
                      helperText: errors.establishedDate?.message,
                    },
                  }}
                  onChange={field.onChange}
                />
              )}
            />

            {/* Thành phố đăng ký GPKD */}
            <Controller
              name="registrationCity"
              control={control}
              rules={{ required: "Tỉnh/Thành phố ĐKKD là bắt buộc" }}
              render={({ field }) => (
                <PrimarySelectField
                  label={renderLabelWithAsterisk("Tỉnh/Thành phố ĐKKD", true)}
                  size="small"
                  value={field.value || ""}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setSelectedRegistrationDistrict("");
                    setValue("registrationDistrict", "");
                    setValue("registrationWard", "");
                  }}
                  error={!!errors.registrationCity}
                  options={newCityOptions}
                  helperText={errors.registrationCity?.message}
                />
              )}
            />

            {/* quận đăng ký GPKD */}
            <Controller
              name="registrationDistrict"
              control={control}
              rules={{ required: "Quận/Huyện ĐKKD là bắt buộc" }}
              render={({ field }) => (
                <PrimarySelectField
                  label={renderLabelWithAsterisk("Quận/Huyện ĐKKD", true)}
                  size="small"
                  value={field.value || ""}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setSelectedRegistrationDistrict(e.target.value);
                    setValue("registrationWard", "");
                  }}
                  error={!!errors.registrationDistrict}
                  options={newDistrictOptions}
                  helperText={errors.registrationDistrict?.message}
                  disabled={!registrationCity}
                />
              )}
            />

            {/* Phường/Xã đăng ký GPKD */}
            <Controller
              name="registrationWard"
              control={control}
              render={({ field }) => (
                <PrimarySelectField
                  label={renderLabelWithAsterisk("Phường/Xã ĐKKD", true)}
                  size="small"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={!!errors.registrationWard}
                  options={newWardOptions(selectedRegistrationDistrict)}
                  helperText={errors.registrationWard?.message}
                  disabled={!registrationDistrict}
                />
              )}
            />

            {/* Địa chỉ đăng ký GPKD */}
            <Controller
              name="registrationAddress"
              control={control}
              rules={{ required: "Địa chỉ ĐKKD là bắt buộc" }}
              render={({ field }) => (
                <PrimaryTextField
                  label={renderLabelWithAsterisk("Địa chỉ ĐKKD", true)}
                  size="small"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={!!errors.registrationAddress}
                  helperText={errors.registrationAddress?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Thông tin hoạt động</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 gap-x-6">
            {/* Tên nước ngoài */}
            <Controller
              name="foreignName"
              control={control}
              render={({ field }) => (
                <PrimaryTextField
                  label={renderLabelWithAsterisk(
                    "Tên doanh nghiệp (tiếng nước ngoài)",
                    false
                  )}
                  size="small"
                  value={field.value || ""}
                  error={!!errors.foreignName}
                  helperText={errors.foreignName?.message}
                />
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email là bắt buộc",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email không hợp lệ",
                },
              }}
              render={({ field }) => (
                <PrimaryTextField
                  label={renderLabelWithAsterisk("Email", true)}
                  size="small"
                  value={field.value || ""}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    debouncedCheckEmail(e.target.value);
                  }}
                />
              )}
            />

            {/* Phone Number */}
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                pattern: {
                  value: /^\d+$/,
                  message: "Số điện thoại không hợp lệ",
                },
              }}
              render={({ field }) => (
                <PrimaryTextField
                  label={renderLabelWithAsterisk(
                    "Số điện thoại cơ quan",
                    false
                  )}
                  size="small"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
              )}
            />

            {/* Tỉnh hoạt động KD */}
            <Controller
              name="operationCity"
              control={control}
              render={({ field }) => (
                <div className="mb-6">
                  <PrimarySelectField
                    label={renderLabelWithAsterisk(
                      "Tỉnh/TP hoạt động KD",
                      false
                    )}
                    size="small"
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setSelectedOperationDistrict("");
                      setValue("operationDistrict", "");
                      setValue("operationWard", "");
                    }}
                    options={newCityOptions}
                  />
                </div>
              )}
            />

            {/* Quận hoạt động KD */}
            <Controller
              name="operationDistrict"
              control={control}
              render={({ field }) => (
                <div className="mb-6">
                  <PrimarySelectField
                    label={renderLabelWithAsterisk(
                      "Quận/Huyện hoạt động KD",
                      false
                    )}
                    size="small"
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setSelectedOperationDistrict(e.target.value);
                      setValue("operationWard", "");
                    }}
                    options={newDistrictOptions}
                    disabled={!operationCity}
                  />
                </div>
              )}
            />

            {/* Xã hoạt động KD */}
            <Controller
              name="operationWard"
              control={control}
              render={({ field }) => (
                <div className="mb-6">
                  <PrimarySelectField
                    label={renderLabelWithAsterisk(
                      "Phường/Xã hoạt động KD",
                      false
                    )}
                    size="small"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    options={newWardOptions(selectedOperationDistrict)}
                    disabled={!operationDistrict}
                  />
                </div>
              )}
            />

            {/* Địa chỉ hoạt động KD */}
            <Controller
              name="operationAddress"
              control={control}
              render={({ field }) => (
                <PrimaryTextField
                  label={renderLabelWithAsterisk(
                    "Địa chỉ hoạt động kinh doanh",
                    false
                  )}
                  size="small"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={!!errors.operationAddress}
                  helperText={errors.operationAddress?.message}
                />
              )}
            />

            {/* Tên người đại diện */}
            <Controller
              name="representativeName"
              control={control}
              render={({ field }) => (
                <PrimaryTextField
                  label={renderLabelWithAsterisk(
                    "Tên người đại diện doanh nghiệp",
                    false
                  )}
                  size="small"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={!!errors.representativeName}
                  helperText={errors.representativeName?.message}
                />
              )}
            />

            {/* Số điện thoại người đại diện */}
            <Controller
              name="representativePhone"
              control={control}
              rules={{
                pattern: {
                  value: /^\d+$/,
                  message: "Số điện thoại không hợp lệ",
                },
              }}
              render={({ field }) => (
                <PrimaryTextField
                  label={renderLabelWithAsterisk(
                    "Số điện thoại người đại diện",
                    false
                  )}
                  size="small"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={!!errors.representativePhone}
                  helperText={errors.representativePhone?.message}
                />
              )}
            />
          </div>

          <LicenseTable
            step={1}
            businessLicenseFile={formData?.businessLicenseFile || null}
            otherDocumentFile={formData?.otherDocumentFile || null}
            onFileUpload={handleFileUpload}
          />
        </div>
      </form>
    </LocalizationProvider>
  );
};

export default EntryPage;
