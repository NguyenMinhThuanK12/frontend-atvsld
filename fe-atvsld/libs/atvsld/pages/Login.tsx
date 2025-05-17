"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import PrimaryTextField from "@/libs/core/components/FormFields/primaryTextInput";
import PrimarySelectField from "@/libs/core/components/FormFields/primarySelectField";
import PrimaryPasswordField from "@/libs/core/components/FormFields/primaryPasswordField";
import PrimaryCheckbox from "@/libs/core/components/CheckBox/primaryCheckBox";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import Link from "next/link";
import ForgotPasswordPopup from "@/libs/atvsld/components/ForgotPasswordPopup";
import {
  validatePassword,
  isEmpty,
} from "@/libs/atvsld/services/validation/globalValidation";
import { getDepartments } from "../services/api/departmentApi";
import { login } from "../services/api/authApi";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agency, setAgency] = useState("");
  const [agencyOptions, setAgencyOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [rememberMe, setRememberMe] = useState(false);
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departments = await getDepartments();
        const options = departments.map((department) => ({
          value: department.id.toString(),
          label: department.name,
        }));
        setAgencyOptions(options);
        if (options.length > 0) setAgency(options[0].value);
      } catch (error: any) {
        console.error("Error fetching departments:", error.message);
        setAlert({
          content: "Không thể tải danh sách đơn vị. Vui lòng thử lại.",
          type: "error",
        });
        setTimeout(() => setAlert(null), 2000);
      }
    };

    fetchDepartments();

    const logoutStatus = searchParams.get("logout");
    if (logoutStatus === "success") {
      setAlert({
        content: "Đăng xuất thành công!",
        type: "success",
      });
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const fields = {
      username: {
        value: username.trim(),
        error: setUsernameError,
        validate: isEmpty,
      },
      password: {
        value: password.trim(),
        error: setPasswordError,
        validate: (value: string) => isEmpty(value) || !validatePassword(value),
      },
    };

    // check each fields
    let hasErrors = false;
    Object.entries(fields).forEach(([key, { value, error, validate }]) => {
      const isInvalid = validate(value);
      error(isInvalid);
      if (isInvalid) {
        hasErrors = true;
      }
    });

    // display alert
    if (hasErrors) {
      setAlert({
        content:
          isEmpty(username) || isEmpty(password)
            ? "Vui lòng nhập đầy đủ thông tin"
            : "Mật khẩu không đúng định dạng",
        type: "error",
      });
      setTimeout(() => setAlert(null), 2000);
      return;
    }

    // login
    try {
      const loginRequest = {
        departmentId: parseInt(agency),
        username: username,
        password: password,
      };

      // log the login request
      console.log("Login Request:", loginRequest);

      const response = await login(loginRequest); // send login request

      if (response.authenticated) {
        setAlert({
          content: "Đăng nhập thành công!",
          type: "success",
        });
        setTimeout(() => {
          router.push(
            `/dashboard/department?login=success&username=${username}&departmentId=${agency}`
          );
          setAlert(null), 2000;
        });
      } else {
        throw new Error("Xác thực thất bại");
      }

    } catch (error: any) {
      setAlert({
        content: error.message || "Đăng nhập thất bại. Vui lòng thử lại.",
        type: "error",
      });
      setTimeout(() => setAlert(null), 2000);
    }

  };

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Side - banner */}
      <div className="hidden md:flex md:w-1/2 bg-blue-50 relative">
        <div className="absolute inset-0 flex items-center justify-center p-6 md-p-12">
          <div className="w-full h-full relative">
            <Image
              src="/img/candidate-banner-1.png"
              alt="Login illustration"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <Alert content={alert.content} type={alert.type} onClose={closeAlert} />
      )}

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-between px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12">
        <div className="w-full max-w-sm sm:max-w-md shadow-lg p-4 rounded-lg bg-white">
          {/* Logo */}
          <div className="flex h-48 justify-center w-full mb-6">
            <Image
              src="/img/login-logo.jpg"
              alt="Company Logo"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          <div className="text-start mb-6">
            <span className="text-xl text-primary uppercase font-semibold">
              Đăng nhập
            </span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <PrimarySelectField
              label="Đơn vị"
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              options={agencyOptions}
              required
            />

            <PrimaryTextField
              label="Tên tài khoản *"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="nguyenvanb.stttt"
              error={usernameError}
            />

            <PrimaryPasswordField
              label="Mật khẩu *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              error={passwordError}
            />

            <div className="flex items-center justify-between">
              <PrimaryCheckbox
                id="remember-me"
                name="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                label="Nhớ đăng nhập"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsForgotPasswordOpen(true);
                }}
                className="text-md font-medium text-primary hover:opacity-80 hover:underline"
              >
                Quên mật khẩu
              </button>
            </div>

            <PrimaryButton content="Đăng nhập" type="submit" />
          </form>
        </div>
      </div>

      {/* Popup Forgot Password */}
      <ForgotPasswordPopup
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}
