"use client";

import React from "react";
import { Business } from "@/libs/shared/atvsld/models/business.model";
import { Typography } from "@mui/material";
import LicenseTable from "./LicenseTable";

interface ReviewPageProps {
  formData: Business;
}

const ReviewPage = ({ formData }: ReviewPageProps) => {
  const infoRows = [
    { label: "Mã số thuế", value: formData?.taxCode },
    { label: "Tên doanh nghiệp", value: formData?.name },
    { label: "Tên viết bằng tiếng nước ngoài", value: formData?.foreignName },
    {
      label: "Ngày cấp GPKD",
      value: formData?.establishedDate
        ? new Date(formData.establishedDate).toLocaleDateString("vi-VN")
        : undefined,
    },
    { label: "Email", value: formData?.email },
    { label: "Loại hình kinh doanh", value: formData?.businessType },
    { label: "Ngành nghề kinh doanh", value: formData?.mainBusinessField },
    {
      label: "Địa chỉ đăng ký giấy phép kinh doanh",
      value:
        [
          formData?.registrationAddress,
          formData?.registrationWard,
          formData?.registrationDistrict,
          formData?.registrationCity,
        ]
          .filter(Boolean)
          .join(", ") || undefined,
    },
    {
      label: "Địa điểm kinh doanh",
      value:
        [
          formData?.operationAddress,
          formData?.operationWard,
          formData?.operationDistrict,
          formData?.operationCity,
        ]
          .filter(Boolean)
          .join(", ") || undefined,
    },
    { label: "SDT Cơ quan", value: formData?.phoneNumber },
    {
      label: "Người đứng đầu doanh nghiệp",
      value: formData?.representativeName,
    },
    { label: "SDT người đứng đầu", value: formData?.representativePhone },
  ];

  return (
    <div className="flex flex-col gap-4 w-full overflow-auto shadow-lg p-4 rounded-lg bg-white">
      <Typography variant="h5">
        <strong>Thông tin về hồ sơ</strong>
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoRows.map((row) => (
          <React.Fragment key={row.label}>
            <Typography variant="body1">
              <strong>{row.label}:</strong>
            </Typography>
            <Typography variant="body1">
              <strong>{row.value || "Chưa nhập"}</strong>
            </Typography>
          </React.Fragment>
        ))}
      </div>
      <LicenseTable
        step={2}
        businessLicenseFile={formData?.businessLicenseFile || null}
        otherDocumentFile={formData?.otherDocumentFile || null}
      />
    </div>
  );
};

export default ReviewPage;
