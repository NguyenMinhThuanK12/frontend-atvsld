import { CreationBusinessRequest } from "@/libs/shared/atvsld/dto/request/creationBussinessRequest";
import { UpdateBusinessRequest } from "@/libs/shared/atvsld/dto/request/updateBusinessRequest";
import { Business } from "@/libs/shared/atvsld/models/business.model";
import { BusinessType } from "@/libs/shared/core/enums/businessType";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Controller,
  FieldErrors,
  useForm,
  UseFormHandleSubmit,
} from "react-hook-form";
import wardsData from "@/public/json/wards.json";
import {
  cityOptions,
  districtOptions,
  getWardOptions,
} from "../../utils/fetchProvinceJson";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import LicenseTable from "./LicenseTable";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { isValid, parse } from "date-fns";

interface InputFormProps {
  formData: Business | null;
  setFormData: React.Dispatch<React.SetStateAction<Business | null>>;
  mode: "create" | "update";
  setTriggerValidation?: (trigger: () => Promise<boolean>) => void;
  setFormErrors?: React.Dispatch<
    React.SetStateAction<FieldErrors<Business> | null>
  >;
  setHandleSubmit?: (handleSubmit: UseFormHandleSubmit<Business>) => void;
}

const businessTypeOptions = Object.keys(BusinessType).map((key) => ({
  key: key,
  value: BusinessType[key as keyof typeof BusinessType],
}));

export default function InputForm({
  formData,
  setFormData,
  mode,
  setHandleSubmit,
  setFormErrors,
}: InputFormProps) {
    let parsedEstablishedDate: Date | null = null;
    if (formData?.establishedDate) {
      if (typeof formData.establishedDate === "string") {
        parsedEstablishedDate = parse(
          formData.establishedDate,
          "yyyy-MM-dd",
          new Date()
        );
        if (!isValid(parsedEstablishedDate)) {
          parsedEstablishedDate = null; // Fallback if parsing fails
        }
      } else if (formData.establishedDate instanceof Date) {
        parsedEstablishedDate = formData.establishedDate;
      }
    }
  const {
    control,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<Business>({
    defaultValues: {
      ...formData,
      establishedDate: parsedEstablishedDate,
    },
    mode: "onChange",
  });

  // Pass handleSubmit to parent
  useEffect(() => {
    if (setHandleSubmit) {
      setHandleSubmit(handleSubmit);
    }
  }, [setHandleSubmit, handleSubmit]);

  // Pass errors to parent
  useEffect(() => {
    setFormErrors?.(errors);
  }, [errors, setFormErrors]);

  // show alert
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

  // create a label with asterisk
  const renderLabelWithAsterisk = (label: string, required: boolean) => (
    <span>
      {label}
      {required && <span style={{ color: "red" }}> *</span>}
    </span>
  );

  // get data province from json
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

  // handle file upload
  const handleFileUpload = (id: number, file: File | null) => {
    console.log("File uploaded:", file, "for ID:", id); // Keep the log
    setFormData((prevFormData) => {
      if (!prevFormData) return prevFormData;

      //  new object to avoid mutating the previous state directly
      const updatedFormData = { ...prevFormData };

      // Update the appropriate field based on id
      if (id === 1) {
        updatedFormData.businessLicenseFile = file; // id 1 maps to businessLicenseFile
      } else if (id === 2) {
        updatedFormData.otherDocumentFile = file; // id 2 maps to otherDocumentFile
      }

      return updatedFormData;
    });
    };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <form className="flex flex-col gap-6 w-full overflow-auto py-4">
        <div className="border rounded-lg p-4 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">
            {mode === "update"
              ? "Cập nhật thông tin doanh nghiệp"
              : "Thông tin doanh nghiệp"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Tên doanh nghiệp là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={renderLabelWithAsterisk("Tên doanh nghiệp", true)}
                  variant="outlined"
                  fullWidth
                  value={field.value || ""}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  aria-required="true"
                />
              )}
            />
            <Controller
              name="taxCode"
              control={control}
              rules={{ required: "Mã số thuế là bắt buộc" }}
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
              rules={{ required: "Loại hình kinh doanh là bắt buộc" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.businessType}>
                  <InputLabel>
                    {renderLabelWithAsterisk("Loại hình kinh doanh", true)}
                  </InputLabel>
                  <Select
                    {...field}
                    label="Loại hình kinh doanh"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
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
              rules={{ required: "Ngành nghề kinh doanh chính là bắt buộc" }}
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
                  error={!!errors.mainBusinessField}
                  helperText={errors.mainBusinessField?.message}
                />
              )}
            />
            <Controller
              name="establishedDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value ? new Date(field.value) : null}
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
              rules={{ required: "Tỉnh/Thành phố ĐKKD là bắt buộc" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.registrationCity}>
                  <InputLabel>
                    {renderLabelWithAsterisk("Tỉnh/Thành phố ĐKKD", true)}
                  </InputLabel>
                  <Select
                    {...field}
                    label="Tỉnh/Thành phố ĐKKD"
                    onChange={(e) => {
                      console.log("Selected City:", e.target.value);

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
              rules={{ required: "Quận/Huyện ĐKKD là bắt buộc" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.registrationDistrict}>
                  <InputLabel>
                    {renderLabelWithAsterisk("Quận/Huyện ĐKKD", true)}
                  </InputLabel>
                  <Select
                    {...field}
                    label="Quận/Huyện ĐKKD"
                    disabled={
                      !registrationCity || registrationCity === "Tất cả"
                    }
                    onChange={(e) => {
                      setSelectedRegistrationDistrict(e.target.value);
                      field.onChange(e);
                      setValue("registrationWard", "");
                    }}
                    value={field.value || ""}
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
              rules={{ required: "Phường/Xã ĐKKD là bắt buộc" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.registrationWard}>
                  <InputLabel>
                    {renderLabelWithAsterisk("Phường/Xã ĐKKD", true)}
                  </InputLabel>
                  <Select
                    {...field}
                    label="Phường/Xã ĐKKD"
                    disabled={
                      !registrationDistrict || registrationDistrict === "Tất cả"
                    }
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    value={field.value || ""}
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
              rules={{
                required: "Email là bắt buộc",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email không hợp lệ",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={renderLabelWithAsterisk("Email", true)}
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={field.value || ""}
                  error={!!errors.email}
                  helperText={errors.email?.message}
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
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
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
                    disabled={!operationCity || operationCity === "Tất cả"}
                    onChange={(e) => {
                      setSelectedOperationDistrict(e.target.value);
                      field.onChange(e);
                      setValue("operationWard", "");
                    }}
                  >
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
                    disabled={
                      !operationDistrict || operationDistrict === "Tất cả"
                    }
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    value={field.value || ""}
                  >
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

      {/* Notify */}
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
