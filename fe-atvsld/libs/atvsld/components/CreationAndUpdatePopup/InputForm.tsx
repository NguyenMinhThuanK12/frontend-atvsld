"use client";

import { Controller, useForm } from "react-hook-form";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { vi } from "date-fns/locale";
import LicenseTable from "./LicenseTable";
import { Department } from "@/libs/shared/atvsld/models/department.model";
import provincesData from "@/public/json/provinces.json";
import districtsData from "@/public/json/districts.json";
import wardsData from "@/public/json/wards.json";
import { BusinessType } from "@/libs/shared/core/enums/businessType";
import { province } from "@/libs/core/models/province";
import { district } from "@/libs/core/models/district";
import { Ward } from "@/libs/core/models/ward";
import { parseISO } from "date-fns";
import Alert from "@/libs/core/components/Alert/primaryAlert";

interface InputFormProps {
  formData: Department | null;
  setFormData: React.Dispatch<React.SetStateAction<Department | null>>;
  mode?: "create" | "edit";
}

const businessTypeOptions = Object.keys(BusinessType).map((key) => ({
  key: key,
  value: BusinessType[key as keyof typeof BusinessType],
}));

const cityOptions = provincesData
  .filter((province: province) => province.code === "79")
  .map((province: province) => ({
    key: province.code,
    value: province.name_with_type,
  }));

const districtOptions = districtsData
  .filter((district: district) => district.parent_code === "79")
  .map((district: district) => ({
    key: district.code,
    value: district.name_with_type,
  }));

const getWardOptions = (
  selectedDistrict: string,
  districtOptions: { key: string; value: string }[],
  wardsData: Ward[]
): { key: string; value: string }[] => {
  const district = districtOptions.find((d) => d.value === selectedDistrict);
  if (!district) {
    return [{ key: "", value: "Chọn quận/huyện trước" }];
  }
  const wards = wardsData
    .filter((ward: Ward) => ward.parent_code === district.key)
    .map((ward: Ward) => ({
      key: ward.code,
      value: ward.name_with_type,
    }));
  return wards.length > 0 ? wards : [{ key: "", value: "Không có phường/xã" }];
};

export default function InputForm({
  formData,
  setFormData,
  mode,
}: InputFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<Department>({
    defaultValues: {
      name: "",
      taxCode: "",
      businessType: "" as BusinessType,
      mainBusinessField: "",
      registrationCity: "",
      registrationDistrict: "",
      registrationWard: "",
      registrationAddress: null,
      operationCity: null,
      operationDistrict: null,
      operationWard: null,
      operationAddress: null,
      foreignName: null,
      email: null,
      phoneNumber: null,
      representativeName: null,
      representativePhone: null,
      businessLicenseFile: null,
      otherDocumentFile: null,
      establishedDate: null,
      ...formData,
    },
    mode: "onChange",
  });

  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const showAlert = useCallback(
    (
      content: string,
      type: "success" | "error" | "warning" | "info",
      duration = 2000
    ) => {
      setAlert({ content, type });
      setTimeout(() => setAlert(null), duration);
    },
    []
  );

  const registrationCity = watch("registrationCity");
  const registrationDistrict = watch("registrationDistrict");
  const operationCity = watch("operationCity");
  const operationDistrict = watch("operationDistrict");

  const [selectedRegistrationDistrict, setSelectedRegistrationDistrict] =
    useState<string>(formData?.registrationDistrict || "");
  const [selectedOperationDistrict, setSelectedOperationDistrict] =
    useState<string>(formData?.operationDistrict || "");

  const registrationWardOptions = useMemo(
    () =>
      getWardOptions(selectedRegistrationDistrict, districtOptions, wardsData),
    [selectedRegistrationDistrict]
  );

  const operationWardOptions = useMemo(
    () => getWardOptions(selectedOperationDistrict, districtOptions, wardsData),
    [selectedOperationDistrict]
  );

  const handleFileUpload = (id: number, file: File | null) => {
    console.log("File uploaded:", file, "for ID:", id);
    setFormData((prev) => {
      const current = prev || {
        id: 0,
        name: "",
        taxCode: "",
        businessType: "" as BusinessType,
        mainBusinessField: "",
        registrationCity: "",
        registrationDistrict: "",
        registrationWard: "",
        registrationAddress: null,
        operationCity: null,
        operationDistrict: null,
        operationWard: null,
        operationAddress: null,
        foreignName: null,
        email: null,
        phoneNumber: null,
        representativeName: null,
        representativePhone: null,
        isActive: true,
        businessLicenseFile: null,
        otherDocumentFile: null,
        establishedDate: null,
      };
      return {
        ...current,
        businessLicenseFile: id === 1 ? file : current.businessLicenseFile,
        otherDocumentFile: id === 2 ? file : current.otherDocumentFile,
      };
    });
    showAlert("Tải lên thành công", "success");
  };

  useEffect(() => {
    console.log("formData in InputForm after update:", formData);
  }, [formData]);

  const renderLabelWithAsterisk = (label: string, required: boolean) => (
    <span>
      {label}
      {required && <span style={{ color: "red" }}> *</span>}
    </span>
  );

  const onSubmit = (data: Department) => {
    setFormData(data);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <form
        onChange={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full overflow-auto py-4"
      >
        <div className="border rounded-lg p-4 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">
            {mode === "edit"
              ? "Cập nhật thông tin doanh nghiệp"
              : "Thông tin doanh nghiệp"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={renderLabelWithAsterisk("Tên doanh nghiệp", true)}
                  variant="outlined"
                  fullWidth
                  value={field.value || ""}
                  aria-required="true"
                />
              )}
            />
            <Controller
              name="taxCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={renderLabelWithAsterisk("Mã số thuế", true)}
                  variant="outlined"
                  fullWidth
                  error={!!errors.taxCode}
                  helperText={errors.taxCode?.message}
                  disabled={!!formData?.id}
                  aria-required="true"
                />
              )}
            />
            <Controller
              name="businessType"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.businessType}>
                  <InputLabel>
                    {renderLabelWithAsterisk("Loại hình kinh doanh", true)}
                  </InputLabel>
                  <Select {...field} label="Loại hình kinh doanh">
                    {businessTypeOptions.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.businessType && (
                    <FormHelperText>
                      {errors.businessType.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="mainBusinessField"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={renderLabelWithAsterisk(
                    "Ngành nghề kinh doanh chính",
                    true
                  )}
                  variant="outlined"
                  fullWidth
                  value={field.value || ""}
                />
              )}
            />
            <Controller
              name="establishedDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Ngày cấp GPKD"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.establishedDate,
                      helperText: errors.establishedDate?.message,
                      "aria-required": "true",
                    },
                  }}
                  onChange={(date) => field.onChange(date)}
                />
              )}
            />
            <Controller
              name="registrationCity"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.registrationCity}>
                  <InputLabel>
                    {renderLabelWithAsterisk("Tỉnh/Thành phố ĐKKD", true)}
                  </InputLabel>
                  <Select
                    {...field}
                    label="Tỉnh/Thành phố ĐKKD"
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    value={field.value || ""}
                  >
                    {cityOptions.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.registrationCity && (
                    <FormHelperText>
                      {errors.registrationCity.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="registrationDistrict"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.registrationDistrict}>
                  <InputLabel>
                    {renderLabelWithAsterisk("Quận/Huyện ĐKKD", true)}
                  </InputLabel>
                  <Select
                    {...field}
                    label="Quận/Huyện ĐKKD"
                    disabled={!registrationCity}
                    onChange={(e) => {
                      setSelectedRegistrationDistrict(e.target.value);
                      field.onChange(e);
                      setValue("registrationWard", "");
                    }}
                  >
                    {districtOptions.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.registrationDistrict && (
                    <FormHelperText>
                      {errors.registrationDistrict.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="registrationWard"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.registrationWard}>
                  <InputLabel>
                    {renderLabelWithAsterisk("Phường/Xã ĐKKD", true)}
                  </InputLabel>
                  <Select
                    {...field}
                    label="Phường/Xã ĐKKD"
                    disabled={!registrationDistrict}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  >
                    {registrationWardOptions.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.registrationWard && (
                    <FormHelperText>
                      {errors.registrationWard.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="registrationAddress"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Địa chỉ"
                  variant="outlined"
                  fullWidth
                  value={field.value || ""}
                />
              )}
            />
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">Thông tin liên hệ</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Controller
              name="foreignName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên viết bằng tiếng nước ngoài"
                  variant="outlined"
                  fullWidth
                  value={field.value || ""}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={renderLabelWithAsterisk("Email", true)}
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={field.value || ""}
                />
              )}
            />
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                pattern: {
                  value: /^\d+$/,
                  message: "Số điện thoại chỉ được chứa chữ số",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Số điện thoại cơ quan"
                  variant="outlined"
                  fullWidth
                  value={field.value || ""}
                />
              )}
            />
            <Controller
              name="operationCity"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Tỉnh/TP hoạt động KD</InputLabel>
                  <Select
                    {...field}
                    label="Tỉnh/TP hoạt động KD"
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  >
                    {cityOptions.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="operationDistrict"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Quận/Huyện hoạt động KD</InputLabel>
                  <Select
                    {...field}
                    label="Quận/Huyện hoạt động KD"
                    value={field.value || ""}
                    disabled={!operationCity}
                    onChange={(e) => {
                      setSelectedOperationDistrict(e.target.value);
                      field.onChange(e);
                      setValue("operationWard", "");
                    }}
                  >
                    <MenuItem value="">Không chọn</MenuItem>
                    {districtOptions.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="operationWard"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Phường/Xã hoạt động KD</InputLabel>
                  <Select
                    {...field}
                    label="Phường/Xã hoạt động KD"
                    disabled={!operationDistrict}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  >
                    <MenuItem value="">Không chọn</MenuItem>
                    {operationWardOptions.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="operationAddress"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Địa điểm kinh doanh"
                  variant="outlined"
                  fullWidth
                  value={field.value || ""}
                />
              )}
            />
            <Controller
              name="representativeName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Người đứng đầu doanh nghiệp"
                  variant="outlined"
                  fullWidth
                  value={field.value || ""}
                />
              )}
            />
            <Controller
              name="representativePhone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="SĐT liên hệ người đứng đầu"
                  variant="outlined"
                  fullWidth
                  value={field.value || ""}
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
      {alert && (
        <Alert
          content={alert.content}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </LocalizationProvider>
  );
}
