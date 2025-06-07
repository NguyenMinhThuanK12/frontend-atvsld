"use client";

import { fetchBusinesses } from "@/libs/atvsld/components/BusinessFeature/handleBusinessFeatures";
import { fetchRoles } from "@/libs/atvsld/components/RoleFeature/handleRoleFeatures";
import { validateImageFile } from "@/libs/atvsld/services/validation/globalValidation";
import { renderLabelWithAsterisk } from "@/libs/atvsld/utils/commonFunction";
import { genderOptions, userTypeOptions } from "@/libs/atvsld/utils/fetchEnum";
import {
  newCityOptions,
  newDistrictOptions,
  newWardOptions,
} from "@/libs/atvsld/utils/fetchProvinceJson";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import PrimaryPasswordField from "@/libs/core/components/FormFields/primaryPasswordField";
import PrimarySelectField from "@/libs/core/components/FormFields/primarySelectField";
import PrimaryTextField from "@/libs/core/components/FormFields/primaryTextInput";
import { avatarPreviewModalStyle } from "@/libs/core/styles/globalStyle";
import { User } from "@/libs/shared/atvsld/models/user.model";
import { UserType } from "@/libs/shared/core/enums/userType";
import AddAPhotoSharpIcon from "@mui/icons-material/AddAPhotoSharp";
import {Dialog, DialogTitle, Fade, Modal, Backdrop } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { id, vi } from "date-fns/locale";
import { Eye, SwitchCamera, Trash2, X } from "lucide-react";
import { Box } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface UserDetailProps {
  openModal: boolean;
  onClose?: () => void;
  onSave?: () => void;
  idSelected?: string;
}

export function UserDetail(props: UserDetailProps) {
  const { openModal, onClose, onSave, idSelected } = props;
  const [selectedUser, setSelectedUser] = useState<User>();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  // fetch ward options based on selected district
  const wardOptions = useMemo(
    () => newWardOptions(selectedDistrict),
    [selectedDistrict]
  );
  const [businessOptions, setBusinessOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [roleOptions, setRoleOptions] = useState<
    { value: string; label: string }[]
  >([]);
  // handle zoom avatar
  const [isLargerAvatar, setIsLargerAvatar] = useState(false);
  // handle active toggle
  const [isActive, setIsActive] = useState(true);

  const {
    control,
    watch,
    handleSubmit,
    trigger,
    formState: { errors },
    setValue,
  } = useForm<User>({
    defaultValues: selectedUser,
    mode: "onSubmit",
  });

  const userType = watch("userType");
  const province = watch("province");
  const district = watch("district");

  // notify
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
    duration?: number; // optional duration for the alert
  } | null>(null);

  const showAlert = useCallback(
    (
      content: string,
      type: "success" | "error" | "warning" | "info",
      duration = 2000
    ) => {
      setAlert({ content, type, duration });
      setTimeout(() => setAlert(null), duration);
    },
    []
  );

  // handle get user detail by id
  useEffect(() => {
    const fetchData = async () => {
      if (idSelected) {
        await getDetail(idSelected);
      } else {
        setValue("password", "Abcd1@34"); // Reset password to default value
      }
    };
    fetchData();
  }, [idSelected]);

  const getDetail = async (id: string) => {
    console.log("Fetch user by id: ", id);
  };

  // fetch businesses and roles for dropdown options
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const businessesList = await fetchBusinesses();
      const rolesList = await fetchRoles();
      if (isMounted && businessesList && rolesList) {
        const businessOptions = businessesList.map((business) => ({
          value: business.id,
          label: business.name,
        }));
        const roleOptions = rolesList.map((role) => ({
          value: role.id,
          label: role.name,
        }));
        setBusinessOptions(businessOptions);
        setRoleOptions(roleOptions);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // handle submit form
  const onSubmit = async (data: User) => {
    const isValid = await trigger();

    if (!isValid) {
      showAlert("Vui lòng điền đầy đủ các trường bắt buộc", "error", 2000);
      return;
    }
    console.log("Submitted Data:", data);
    showAlert("Dữ liệu đã được gửi thành công", "success", 2000);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Dialog
        open={openModal}
        onClose={onClose}
        maxWidth="lg"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            padding: "20px",
          },
          "& .MuiDialogTitle-root": {
            padding: "0px",
            marginBottom: "10px",
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {idSelected ? "Chỉnh sửa người dùng" : "Thêm mới người dùng"}
            </h1>
            <button
              className="p-2 flex items-center justify-center cursor-pointe hover:bg-gray-50 rounded-full"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </DialogTitle>
        {/* Form content */}
        <form onSubmit={handleSubmit(onSubmit)} className="h-full">
          <div className="flex justify-center items-start gap-4">
            <div className="flex-1 border-2 px-10 py-12 rounded-2xl flex flex-col space-y-10">
              {/* Avatar Upload Section */}
              <Controller
                name="avatar"
                control={control}
                rules={{
                  validate: (file) => {
                    if (!file) return true;
                    const { isValid, errorMessage } = validateImageFile(
                      file as File
                    );
                    if (!isValid && errorMessage) {
                      showAlert(errorMessage, "error", 2000);
                      return false;
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <div className="h-full w-full flex flex-col items-center justify-between space-y-2">
                    <div className="w-36 h-36 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full mb-2 relative">
                      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                        {avatarPreview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={avatarPreview}
                              alt="Avatar Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center space-x-4 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                              <SwitchCamera
                                className="w-6 h-6 text-white cursor-pointer hover:text-blue-500"
                                onClick={() =>
                                  document
                                    .getElementById("avatar-upload")
                                    ?.click()
                                }
                              />
                              <Eye
                                className="w-6 h-6 text-white cursor-pointer hover:text-blue-500"
                                onClick={() => setIsLargerAvatar(true)}
                                aria-label="View full-size avatar"
                              />
                              <Trash2
                                className="w-6 h-6 text-white cursor-pointer ml-2 hover:text-blue-500"
                                onClick={() => {
                                  field.onChange(null);
                                  setAvatarPreview(null);
                                  const input = document.getElementById(
                                    "avatar-upload"
                                  ) as HTMLInputElement;
                                  if (input) input.value = "";
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="flex flex-col items-center justify-center text-sm text-gray-600 hover:text-blue-500"
                            onClick={() =>
                              document.getElementById("avatar-upload")?.click()
                            }
                          >
                            <AddAPhotoSharpIcon className="w-8 h-8 text-gray-600 mb-1" />
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept=".jpeg,.jpg,.png"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const { isValid, errorMessage } =
                            validateImageFile(file);
                          if (isValid) {
                            field.onChange(file); // Update form state only if valid
                            setAvatarPreview(URL.createObjectURL(file));
                          } else if (errorMessage) {
                            showAlert(errorMessage, "error", 2000);
                            // Reset file input
                            const input = e.target as HTMLInputElement;
                            input.value = "";
                          }
                        }
                      }}
                    />
                    <div className="flex flex-col items-center justify-center w-full space-y-1">
                      <p className="text-xs text-gray-500">
                        *.jpeg, *.jpg, *.png
                      </p>
                      <p className="text-xs text-gray-500">Maximum 100MB</p>
                    </div>
                  </div>
                )}
              />

              {/* Modal for Full-Size Image */}
              <Modal
                aria-labelledby="avatar-modal-title"
                aria-describedby="avatar-modal-description"
                open={isLargerAvatar && !!avatarPreview}
                onClose={() => setIsLargerAvatar(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                  backdrop: {
                    timeout: 500,
                  },
                }}
              >
                <Fade in={isLargerAvatar && !!avatarPreview}>
                  <Box sx={avatarPreviewModalStyle}>
                    <div className="flex justify-end">
                      <button
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        onClick={() => setIsLargerAvatar(false)}
                        aria-label="Close modal"
                      >
                        <X className="w-6 h-6 text-gray-700" />
                      </button>
                    </div>
                    <div className="w-full mt-4 rounded-lg overflow-auto">
                      <img
                        src={avatarPreview!}
                        alt="Full-size Avatar"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </Box>
                </Fade>
              </Modal>

              {/* Active Toggle */}
              {idSelected && (
                <div className="flex items-center justify-evenly space-x-16">
                  <span className="text-sm font-medium text-gray-700">
                    Hoạt động
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
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
              )}
            </div>

            {/* Form Fields */}
            <div className="flex-auto border-2 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-2">
              {/* Username */}
              <Controller
                name="username"
                control={control}
                rules={{ required: "Tài khoản là bắt buộc" }}
                render={({ field }) => (
                  <PrimaryTextField
                    label={renderLabelWithAsterisk("Tài khoản", true)}
                    size="small"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={control}
                rules={{ required: "Mật khẩu là bắt buộc" }}
                render={({ field }) => (
                  <div className="relative">
                    <PrimaryPasswordField
                      label={renderLabelWithAsterisk("Mật khẩu", true)}
                      size="small"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="************"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      disabled={idSelected !== ""} // Disable if editing
                    />
                  </div>
                )}
              />

              {/* Full Name */}
              <Controller
                name="fullName"
                control={control}
                rules={{ required: "Họ và tên là bắt buộc" }}
                render={({ field }) => (
                  <PrimaryTextField
                    label={renderLabelWithAsterisk("Họ và tên", true)}
                    size="small"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                  />
                )}
              />

              {/* job title */}
              <Controller
                name="jobTitle"
                control={control}
                rules={{ required: "Chức danh là bắt buộc" }}
                render={({ field }) => (
                  <PrimaryTextField
                    label={renderLabelWithAsterisk("Chức danh", true)}
                    size="small"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.jobTitle}
                    helperText={errors.jobTitle?.message}
                  />
                )}
              />

              {/* User Type */}
              <Controller
                name="userType"
                control={control}
                rules={{ required: "Kiểu người dùng là bắt buộc" }}
                render={({ field }) => (
                  <div className="mb-4">
                    <PrimarySelectField
                      label={renderLabelWithAsterisk("Kiểu người dùng", true)}
                      value={field.value || ""}
                      size="small"
                      onChange={(e) => {
                        setValue("businessId", null); // Reset business when user type changes
                        setValue("roleId", null); // Reset role when user type changes
                        field.onChange(e.target.value);
                      }}
                      options={userTypeOptions}
                      error={!!errors.userType}
                      helperText={errors.userType?.message}
                      disabled={idSelected !== ""} // Disable the field if editing
                    />
                  </div>
                )}
              />

              {/* Business */}
              <Controller
                name="businessId"
                control={control}
                rules={{
                  required:
                    userType === UserType.BUSINESS
                      ? "Danh sách doanh nghiệp là bắt buộc"
                      : false,
                }}
                render={({ field }) => (
                  <div className="mb-4">
                    <PrimarySelectField
                      label={renderLabelWithAsterisk(
                        "Danh sách doanh nghiệp",
                        userType === UserType.BUSINESS
                      )}
                      value={field.value || ""}
                      size="small"
                      onChange={(e) => field.onChange(e.target.value)}
                      options={businessOptions}
                      disabled={
                        !userType ||
                        userType === UserType.ADMIN ||
                        idSelected !== ""
                      }
                      error={!!errors.businessId}
                      helperText={errors.businessId?.message}
                    />
                  </div>
                )}
              />

              {/* Role */}
              <Controller
                name="roleId"
                control={control}
                rules={{
                  required:
                    userType === UserType.ADMIN ? "Vai trò là bắt buộc" : false,
                }}
                render={({ field }) => (
                  <div className="mb-4">
                    <PrimarySelectField
                      label={renderLabelWithAsterisk(
                        "Vai trò",
                        userType === UserType.ADMIN
                      )}
                      value={field.value || ""}
                      size="small"
                      onChange={(e) => field.onChange(e.target.value)}
                      options={roleOptions}
                      disabled={
                        userType === UserType.BUSINESS ||
                        !userType ||
                        idSelected !== ""
                      }
                      error={!!errors.roleId}
                      helperText={errors.roleId?.message}
                    />
                  </div>
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
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="example@email.com"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />

              {/* Phone number */}
              <Controller
                name="phoneNumber"
                control={control}
                rules={{
                  pattern: {
                    value: /^\d{10,11}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                }}
                render={({ field }) => (
                  <PrimaryTextField
                    label={renderLabelWithAsterisk("Số điện   thoại", false)}
                    size="small"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                  />
                )}
              />

              {/* Birth Date */}
              <Controller
                name="birthday"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label={renderLabelWithAsterisk("Ngày sinh", false)}
                    value={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date)}
                    slotProps={{
                      textField: {
                        error: !!errors.birthday,
                        helperText: errors.birthday?.message,
                        size: "small", // Set size to medium
                      },
                    }}
                  />
                )}
              />

              {/* Gender */}
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <div className="mb-4">
                    <PrimarySelectField
                      label={renderLabelWithAsterisk("Giới tính", false)}
                      value={field.value ?? ""}
                      size="small"
                      onChange={field.onChange}
                      options={genderOptions}
                      error={!!errors.gender}
                      helperText={errors.gender?.message}
                    />
                  </div>
                )}
              />

              {/* City */}
              <Controller
                name="province"
                control={control}
                render={({ field }) => (
                  <div className="mb-4">
                    <PrimarySelectField
                      label={renderLabelWithAsterisk("Tỉnh / Thành phố", false)}
                      value={field.value ?? ""}
                      size="small"
                      onChange={field.onChange}
                      options={newCityOptions}
                      error={!!errors.province}
                      helperText={errors.province?.message}
                    />
                  </div>
                )}
              />

              {/* District */}
              <Controller
                name="district"
                control={control}
                render={({ field }) => (
                  <div className="mb-4">
                    <PrimarySelectField
                      label={renderLabelWithAsterisk("Quận / Huyện", false)}
                      value={field.value ?? ""}
                      size="small"
                      onChange={(e) => {
                        console.log("Selected District:", e.target.value);
                        setSelectedDistrict(e.target.value);
                        field.onChange(e);
                        setValue("ward", "");
                      }}
                      options={newDistrictOptions}
                      disabled={!province}
                      error={!!errors.district}
                      helperText={errors.district?.message}
                    />
                  </div>
                )}
              />

              {/* Ward */}
              <Controller
                name="ward"
                control={control}
                render={({ field }) => (
                  <div className="mb-4">
                    <PrimarySelectField
                      label={renderLabelWithAsterisk("Phường / Xã", false)}
                      value={field.value ?? ""}
                      size="small"
                      onChange={field.onChange}
                      options={wardOptions}
                      disabled={!district || wardOptions.length === 0}
                      error={!!errors.ward}
                      helperText={errors.ward?.message}
                    />
                  </div>
                )}
              />

              {/* Address */}
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <PrimaryTextField
                    label={renderLabelWithAsterisk("Địa chỉ", false)}
                    size="small"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Nhập địa chỉ"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <PrimaryButton
              content="Lưu"
              disabled={false}
              size="medium"
              type="submit"
              className="bg-blue-600 text-white px-6 py-1.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            />
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
      </Dialog>
    </LocalizationProvider>
  );
}

export default UserDetail;
