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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agency, setAgency] = useState("hcm"); // Giá trị mặc định cho Đơn vị
  const [rememberMe, setRememberMe] = useState(false);
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const logoutStatus = searchParams.get("logout");
    if (logoutStatus === "success") {
      setAlert({
        content: "Đăng xuất thành công!",
        type: "success",
      });
    }
  }, [searchParams]);
  

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", { username, password, rememberMe });
    
    router.push("/dashboard/department?login=success&username=" + username);
  };

  const closeAlert = () => {
    setAlert(null);
  };

  const agencyOptions = [
    { value: "hcm", label: "Ủy ban nhân dân thành phố Hồ Chí Minh" },
    { value: "hanoi", label: "Ủy ban nhân dân thành phố Hà Nội" },
    { value: "thuduc", label: "Ủy ban nhân dân thành phố Thủ Đức" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-blue-50 relative">
        <div className="absolute inset-0 flex items-center justify-center p-12">
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
      <div className="w-full md:w-1/2 flex flex-col items-center justify-between px-6 py-12">
        <div className="w-full max-w-md shadow-lg p-4">
          {/* Logo */}
          <div className="flex h-50 justify-center mb-14 w-full">
            <Image
              src="/img/login-logo.jpg"
              alt="Company Logo"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto"
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
              required
            />

            <PrimaryPasswordField
              label="Mật khẩu *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
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
