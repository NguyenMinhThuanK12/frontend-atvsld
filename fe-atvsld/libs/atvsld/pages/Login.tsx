"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import PrimaryTextField from "@/libs/core/components/FormFields/primaryTextInput";
import PrimarySelectField from "@/libs/core/components/FormFields/primarySelectField";
import PrimaryPasswordField from "@/libs/core/components/FormFields/primaryPasswordField";
import PrimaryCheckbox from "@/libs/core/components/CheckBox/primaryCheckBox";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { isEmpty } from "@/libs/atvsld/services/validation/globalValidation";
import { login } from "../services/api/authApi";
const ForgotPasswordPopup = dynamic(
  () => import("@/libs/atvsld/components/ForgotPasswordPopup"),
  {
    ssr: false,
  }
);

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agency, setAgency] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [agencyOptions, setAgencyOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

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

  // get departments list
  // useEffect(() => {
  //   const fetchDepartments = async () => {
  //     try {
  //       const departments = await getDepartmentsForSignIn();
  //       if (departments.length === 0) {
  //         showAlert("Không có đơn vị nào được tìm thấy.", "error");
  //         return;
  //       }

  //       const options = departments.map((department) => ({
  //         value: department.id.toString(),
  //         label: department.name,
  //       }));
  //       setAgencyOptions(options);

  //       if (options.length > 0) setAgency(options[0].value);
  //     } catch (error: any) {
  //       console.error("Error fetching departments:", error.message);
  //       showAlert("Có lỗi xảy ra khi tải danh sách đơn vị.", "error");
  //     }
  //   };

  //   fetchDepartments();
  // }, []);

  useEffect(() => {
    const logoutStatus = searchParams.get("logout");
    if (logoutStatus === "success") {
      showAlert("Đăng xuất thành công.", "success")
    } else if (logoutStatus === "forced") {
      showAlert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", "error");
    }
  }, [searchParams]);

  // handle login
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
        validate: isEmpty,
        // validate: (value: string) => isEmpty(value) || !validatePassword(value),
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
      showAlert(isEmpty(username) || isEmpty(password)
        ? "Vui lòng nhập đầy đủ thông tin."
        : "Mật khẩu không đúng định dạng", "error")
      return;
    }

    // login if no errors
    try {
      const loginRequest = {
        department_id: parseInt(agency),
        account: username,
        password: password,
      };

      const response = await login(loginRequest); // send login request

      if (response.status !== 200 || !response.data) {
        showAlert(response.message, "error");
        return;
      }

      const access_token = response.data.access_token;
      const refresh_token = response.data.refresh_token;
      const userAuthenticated = response.data.userAuthenticated;
      const fullName = userAuthenticated.full_name;
      const departmentId = userAuthenticated.department_id.toString();

      Cookies.set("accessToken", access_token, {
        expires: rememberMe ? 7 : undefined, 
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("refreshToken", refresh_token, {
        expires: rememberMe ? 7 : undefined,
        secure: true,
        sameSite: "Strict",
        // httpOnly: true,
      });
      Cookies.set("fullName", fullName, {
        expires: rememberMe ? 7 : undefined,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("departmentId", departmentId, {
        expires: rememberMe ? 7 : undefined,
        secure: true,
        sameSite: "Strict",
      });


      const redirect = searchParams.get("redirect") || "/dashboard/department";
      router.push(redirect + "?login=success");
    } catch (error) {
      showAlert("Có lỗi xảy ra trong quá trình đăng nhập.", "error");
    }
  };

  // remember me - auto login when cookies are not expired
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      const redirect = searchParams.get("redirect") || "/dashboard/department";
      router.push(redirect);
    }
  }, [router]);

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
        <Alert content={alert.content} type={alert.type} onClose={() => setAlert(null)} />
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
            {/* <PrimarySelectField
              label="Đơn vị"
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              options={agencyOptions}
              required
            /> */}

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
