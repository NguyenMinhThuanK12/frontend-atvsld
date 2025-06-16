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
import {
  isEmpty,
  validatePassword,
} from "@/libs/atvsld/services/validation/globalValidation";
import { login } from "../services/api/authApi";
import { AuthenticationRequest } from "@/libs/shared/atvsld/dto/request/auth-request";
import { CircularProgress } from "@mui/material";
import { renderLabelWithAsterisk } from "../utils/commonFunction";
import { UserType } from "@/libs/shared/core/enums/userType";
import { useAuth } from "@/libs/core/hooks/AuthContext";
const ForgotPasswordPopup = dynamic(
  () => import("@/libs/atvsld/components/ForgotPasswordPopup"),
  {
    ssr: false,
  }
);

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Add loading state
  const { dispatch } = useAuth();

  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
    duration: number;
  } | null>(null);

  const showAlert = (
    content: string,
    type: "success" | "error" | "warning" | "info",
    duration = 2000
  ) => setAlert({ content, type, duration });

  useEffect(() => {
    const logoutStatus = searchParams.get("logout");
    if (logoutStatus === "success") {
      showAlert("Đăng xuất thành công.", "success");
    } else if (logoutStatus === "forced") {
      showAlert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", "warning");
    }
  }, []);

  // handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fields = {
      username: {
        value: username.trim(),
        error: setUsernameError,
        validate: isEmpty,
      },
      password: {
        value: password.trim(),
        error: setPasswordError,
        // validate: isEmpty,
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
      showAlert(
        isEmpty(username) || isEmpty(password)
          ? "Vui lòng nhập đầy đủ thông tin."
          : "Mật khẩu không đúng định dạng",
        "error"
      );
      setLoading(false); // Reset loading state
      return;
    }

    // login if no errors
    try {
      const loginRequest: AuthenticationRequest = {
        account: username,
        password: password,
      };

      const response = await login(loginRequest); // send login request

      if (response.status !== 200 || !response.data) {
        setLoading(false);
        showAlert(response.message, "error");
        return;
      }

      const access_token = response.data.access_token;
      const refresh_token = response.data.refresh_token;
      const userAuthenticated = response.data.userAuthenticated;
      const fullName = userAuthenticated.full_name;
      const avatar = userAuthenticated.avatar || "/img/default-avatar.png"; // Default avatar if not provided
      

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
      Cookies.set("avatar", avatar, {
        expires: rememberMe ? 7 : undefined,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("userType", userAuthenticated.user_type, {
        expires: rememberMe ? 7 : undefined,
        secure: true,
        sameSite: "Strict",
      });

      // Store permissions in context
      // setAuthData(permissions);
      const userType = userAuthenticated.user_type;
      let redirectPath = "";
      if (userType === UserType.ADMIN) {
        redirectPath = "/dashboard/greeting";
        const permissions = userAuthenticated.permissions;
        Cookies.set("permissions", JSON.stringify(permissions), {
          secure: true,
          sameSite: "Strict",
        });
        dispatch({ type: "SET_PERMISSIONS", payload: permissions });
      } else {
        redirectPath = "/ATVSLD/report-sanitation";
      } 
      setLoading(false);
      router.push(redirectPath + "?login=success");
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      showAlert("Có lỗi xảy ra trong quá trình đăng nhập.", "error");
    }
  };

  // remember me - auto login when cookies are not expired
  // useEffect(() => {
  //   const token = Cookies.get("accessToken");
  //   const user_type = Cookies.get("userType");

  //   if (!token || !user_type) return;
  //   const redirect =
  //     user_type === UserType.ADMIN ? "/dashboard/greeting" : "/reports";
  //   router.push(redirect);
  // }, [router]);

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

      {/* Right Side - Login Form */}
      <div className=" w-full md:w-1/2 flex flex-col items-center justify-between px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12">
        <div className="mt-8 w-full max-w-sm sm:max-w-md shadow-lg p-4 rounded-lg bg-white">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center space-y-5 mb-6">
            <div className="h-32 w-32 justify-center">
              <img
                src="/img/logo-left-side-bar.png"
                alt="Company Logo"
                className="w-full h-auto object-contain"
              />
            </div>

            <span className="text-gray-800 text-lg font-bold">
              Hệ thống chuyển đổi kỹ thuật số DTI
            </span>
          </div>

          <div className="text-start mb-6">
            <span className="text-xl text-primary uppercase font-semibold">
              Đăng nhập
            </span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            <PrimaryTextField
              label={renderLabelWithAsterisk("Tên đăng nhập", true)}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={usernameError}
            />

            <PrimaryPasswordField
              label={renderLabelWithAsterisk("Mật khẩu", true)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

            <PrimaryButton
              content="Đăng nhập"
              icon={
                loading ? <CircularProgress size={24} color="inherit" /> : null
              }
              disabled={loading}
              type="submit"
              className="w-full"
              size="large"
              sx={{ height: "48px", fontSize: "18px", marginTop: "16px" }}
            />
          </form>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <Alert
          content={alert.content}
          type={alert.type}
          duration={alert.duration}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Popup Forgot Password */}
      <ForgotPasswordPopup
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}
