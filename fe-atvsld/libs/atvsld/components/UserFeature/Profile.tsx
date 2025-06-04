import React, { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import AddAPhotoSharpIcon from "@mui/icons-material/AddAPhotoSharp";
import { useForm, Controller } from "react-hook-form";
import PrimaryTextField from "@/libs/core/components/FormFields/primaryTextInput";
import PrimarySelectField from "@/libs/core/components/FormFields/primarySelectField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { is, vi } from "date-fns/locale";
import { parseISO } from "date-fns";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";

interface ProfileFormData {
  username: string;
  password: string;
  fullName: string;
  position: string;
  userType: string;
  role: string;
  gender: string;
  businessCategory: string;
  birthDate: string | null;
  city: string;
  ward: string;
  district: string;
  email: string;
  address: string;
}

interface ProfileProps {
  isCreate?: boolean;
  onClose?: () => void;
}

export default function Profile( { isCreate, onClose }: ProfileProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      position: "",
      userType: "",
      role: "",
      gender: "",
      businessCategory: "",
      birthDate: null,
      city: "",
      ward: "",
      district: "",
      email: "",
      address: "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    const formattedData = {
      ...data,
      birthDate: data.birthDate ? parseISO(data.birthDate).toISOString() : null,
    };
    console.log("Form submitted:", formattedData);
  };

  const userTypeOptions = [
    { value: "", label: "Chọn kiểu người dùng" },
    { value: "admin", label: "Quản trị viên" },
    { value: "manager", label: "Quản lý" },
    { value: "employee", label: "Nhân viên" },
  ];

  const businessCategoryOptions = [
    { value: "", label: "Chọn doanh nghiệp" },
    { value: "tech", label: "Công nghệ" },
    { value: "finance", label: "Tài chính" },
    { value: "healthcare", label: "Y tế" },
  ];

  const roleOptions = [
    { value: "", label: "Chọn vai trò" },
    { value: "Employee", label: "Employee" },
    { value: "Manager", label: "Manager" },
    { value: "Admin", label: "Admin" },
  ];

  const genderOptions = [
    { value: "", label: "Chọn giới tính" },
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
    { value: "other", label: "Khác" },
  ];

  const cityOptions = [
    { value: "", label: "Chọn tỉnh/thành phố" },
    { value: "Thành phố Hồ Chí Minh", label: "Thành phố Hồ Chí Minh" },
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "Đà Nẵng", label: "Đà Nẵng" },
  ];

  const wardOptions = [
    { value: "", label: "Chọn phường/xã" },
    { value: "Phường 13", label: "Phường 13" },
    { value: "Phường 1", label: "Phường 1" },
    { value: "Phường 2", label: "Phường 2" },
  ];

  const districtOptions = [
    { value: "", label: "Chọn quận/huyện" },
    { value: "Quận Bình Thạnh", label: "Quận Bình Thạnh" },
    { value: "Quận 1", label: "Quận 1" },
    { value: "Quận 2", label: "Quận 2" },
  ];

  if (!isCreate) {
    return null; 
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-lg font-semibold text-gray-800">
              {isCreate ? "Thêm mới Người Dùng" : "Chỉnh sửa Người Dùng"}
            </h1>
            <X className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="h-full">
            <div className="flex justify-center items-start gap-4">
              <div className="flex-1 border-2 p-4 rounded-2xl flex flex-col space-y-10">
                {/* Avatar Upload Section */}
                <div className="h-full w-full flex flex-col items-center justify-between space-y-2">
                  <div className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full mb-2">
                    <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center">
                      <button
                        type="button"
                        className="flex flex-col items-center justify-center text-xs text-gray-600 hover:text-blue-500"
                      >
                        <AddAPhotoSharpIcon className="w-6 h-6 text-gray-600 mb-1" />
                        Upload
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center w-full space-y-1">
                    <p className="text-xs text-gray-500">
                      *.jpeg, *.jpg, *.png
                    </p>
                    <p className="text-xs text-gray-500">Maximum 100MB</p>
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-start space-x-16">
                  <span className="text-sm font-medium text-gray-700">
                    Active
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
              </div>

              {/* Form Fields */}
              <div className="flex-auto border-2 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
                {/* Username */}
                <Controller
                  name="username"
                  control={control}
                  rules={{ required: "Tài khoản là bắt buộc" }}
                  render={({ field }) => (
                    <PrimaryTextField
                      label={
                        <span>
                          Tài khoản <span className="text-red-500">*</span>
                        </span>
                      }
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
                      <PrimaryTextField
                        label={
                          <span>
                            Mật khẩu <span className="text-red-500">*</span>
                          </span>
                        }
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="************"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
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
                      label={
                        <span>
                          Họ và tên <span className="text-red-500">*</span>
                        </span>
                      }
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message}
                    />
                  )}
                />

                {/* Position */}
                <Controller
                  name="position"
                  control={control}
                  rules={{ required: "Chức danh là bắt buộc" }}
                  render={({ field }) => (
                    <PrimaryTextField
                      label={
                        <span>
                          Chức danh <span className="text-red-500">*</span>
                        </span>
                      }
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.position}
                      helperText={errors.position?.message}
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
                        label="Kiểu người dùng *"
                        value={field.value}
                        onChange={field.onChange}
                        options={userTypeOptions}
                        required
                      />
                      {errors.userType && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.userType.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Business Category */}
                <Controller
                  name="businessCategory"
                  control={control}
                  rules={{ required: "Danh sách doanh nghiệp là bắt buộc" }}
                  render={({ field }) => (
                    <div className="mb-4">
                      <PrimarySelectField
                        label="Danh sách doanh nghiệp *"
                        value={field.value}
                        onChange={field.onChange}
                        options={businessCategoryOptions}
                        required
                      />
                      {errors.businessCategory && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.businessCategory.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Role */}
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: "Vai trò là bắt buộc" }}
                  render={({ field }) => (
                    <div className="mb-4">
                      <PrimarySelectField
                        label="Vai trò *"
                        value={field.value}
                        onChange={field.onChange}
                        options={roleOptions}
                        required
                      />
                      {errors.role && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.role.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Birth Date */}
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Ngày sinh"
                      value={field.value ? parseISO(field.value) : null}
                      onChange={(newValue: Date | null) => {
                        field.onChange(
                          newValue ? newValue.toISOString() : null
                        );
                      }}
                      slotProps={{
                        textField: {
                          error: !!errors.birthDate,
                          helperText: errors.birthDate?.message,
                          size: "small",
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
                        label="Giới tính"
                        value={field.value}
                        onChange={field.onChange}
                        options={genderOptions}
                      />
                    </div>
                  )}
                />

                {/* City */}
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <div className="mb-4">
                      <PrimarySelectField
                        label="Tỉnh /Thành phố"
                        value={field.value}
                        onChange={field.onChange}
                        options={cityOptions}
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
                        label="Phường /xã"
                        value={field.value}
                        onChange={field.onChange}
                        options={wardOptions}
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
                        label="Quận /Huyện"
                        value={field.value}
                        onChange={field.onChange}
                        options={districtOptions}
                      />
                    </div>
                  )}
                />

                {/* Email */}
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email không hợp lệ",
                    },
                  }}
                  render={({ field }) => (
                    <PrimaryTextField
                      label="Email"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="example@email.com"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />

                {/* Address */}
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <PrimaryTextField
                      label="Địa chỉ"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Nhập địa chỉ"
                    />
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <PrimaryButton
                // onClick={handleSubmit(onSubmit)}
                content="Lưu"
                disabled={false}
                size="medium"
                type="submit"
                className="bg-blue-600 text-white px-6 py-1.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              />
            </div>
          </form>
        </div>
      </div>
    </LocalizationProvider>
  );
}
