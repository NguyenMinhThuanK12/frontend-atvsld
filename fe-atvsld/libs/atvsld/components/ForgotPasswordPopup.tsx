"use client";

import React, { useState } from "react";
import PrimaryTextField from "@/libs/core/components/FormFields/primaryTextInput";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import OutlineButton from "@/libs/core/components/Button/outlineBtn";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setAlert({ content: "Gửi email thành công", type: "success" });
      setTimeout(() => {
        setAlert(null);
        onClose();
      }, 2000);
    } else {
      setAlert({ content: "Email chưa đăng ký trong hệ thống. Xin vui lòng thử lại sau", type: "error" });
      setTimeout(() => setAlert(null), 2000);
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
    setAlert({ content: "Chưa hỗ trợ phương thức này", type: "info" });
    setTimeout(() => setAlert(null), 2000);
  }

  const handleClose = () => {
    setStep("select-method");
    setEmail("");
    setAlert(null);
    onClose();
  }

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
                onClick={handleSendZalo}
              />
              <OutlineButton
                content="Gửi mã xác thực qua Email"
                type="button"
                onClick={handleSelectMethod}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col space-y-2 justify-center items-center border-b pb-2 mb-4 relative">
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
              />
              <div className="max-w-[80%] mx-auto">
                <PrimaryButton content="Gửi yêu cầu" type="submit" />
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
