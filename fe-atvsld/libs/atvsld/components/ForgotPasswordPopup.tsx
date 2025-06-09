"use client";

import React, { useState, useCallback, useEffect } from "react";
import PrimaryTextField from "@/libs/core/components/FormFields/primaryTextInput";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import OutlineButton from "@/libs/core/components/Button/outlineBtn";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { validateEmail } from "../services/validation/globalValidation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { forgotPassword } from "../services/api/authApi";
import { ForgotPasswordRequest } from "@/libs/shared/atvsld/dto/request/forgotPassword-request";

interface ForgotPasswordPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordPopup: React.FC<ForgotPasswordPopupProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<"select-method" | "email-form">(
    "select-method"
  );
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

  // Countdown logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsButtonDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // call function validateEmail
    if (!validateEmail(email)) {
      showAlert(
        "Vui lòng nhập đúng định dạng email, định dạng đúng …..@......",
        "error"
      );
      setEmailError(true);
      return;
    }

    // call api send email
    try {
      const ForgotPasswordRequest: ForgotPasswordRequest = {
        email: email,
      };
      const response = await forgotPassword(ForgotPasswordRequest);

      if (response.status !== 200) {
        showAlert(response.message, "error");
        setEmailError(true);
        return;
      }
      showAlert("Gửi email thành công", "success");
      setIsButtonDisabled(true);
      setCountdown(60);
      setEmailError(false);
    } catch (error) {
      showAlert("Có lỗi xảy ra trong quá trình gửi email", "error");
      setEmailError(true);
      return;
    }
  };

  const closeAlert = () => {
    setAlert(null);
  };

  const handleSelectMethod = () => {
    setStep("email-form");
  };

  const handleBack = () => {
    setStep("select-method");
    setEmail("");
    setAlert(null);
  };

  const handleSendZalo = () => {
    showAlert("Chưa hỗ trợ phương thức này", "info");
  };

  const handleClose = () => {
    setStep("select-method");
    setEmail("");
    setEmailError(false);
    setAlert(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "select-method" ? (
          <>
            <div className="flex items-center justify-center border-b pb-2 mb-4">
              <h2 className="text-xl font-semibold">
                Vui lòng chọn phương thức
              </h2>
            </div>
            <div className="space-y-4">
              <PrimaryButton
                content="Gửi mã xác thực qua Zalo"
                type="button"
                className="w-full"
                onClick={handleSendZalo}
              />
              <OutlineButton
                content="Gửi mã xác thực qua Email"
                type="button"
                className="w-full"
                onClick={handleSelectMethod}
              />
            </div>
          </>
        ) : (
          <>
            <div className="w-full flex flex-col space-y-2 justify-center items-center border-b pb-2 mb-4 relative">
              <button
                onClick={handleBack}
                className="text-gray-900 hover:bg-gray-100 p-2 rounded-full absolute left-0 top-0"
              >
                <ArrowBackIcon />
              </button>
              <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
              <h4 className="text-sm text-gray-600">
                Vui lòng nhập email đã đăng ký tài khoản
              </h4>
            </div>
            {alert && (
              <Alert
                content={alert.content}
                type={alert.type}
                onClose={closeAlert}
              />
            )}
            <form onSubmit={handleSubmit}>
              <PrimaryTextField
                label="Email (*)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
                error={emailError}
              />
              <div className="max-w-[80%] mx-auto">
                <PrimaryButton
                  content={
                    isButtonDisabled
                      ? `Gửi lại sau ${countdown}s`
                      : "Gửi yêu cầu"
                  }
                  className="w-full"
                  type="submit"
                  disabled={isButtonDisabled}
                />
              </div>
              <div className="flex items-center justify-center mt-4 space-x-1">
                <span className="text-sm text-gray-600">
                  Bạn đã có tài khoản đăng nhập ?
                </span>
                <button
                  className="text-md text-primary font-semibold hover:opacity-80 hover:underline"
                  onClick={handleClose}
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          </>
        )}
      </div>
      {alert && (
        <Alert content={alert.content} type={alert.type} onClose={closeAlert} />
      )}
    </div>
  );
};

export default ForgotPasswordPopup;
