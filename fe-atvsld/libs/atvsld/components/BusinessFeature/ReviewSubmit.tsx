import { CreationBusinessRequest } from "@/libs/shared/atvsld/dto/request/business/creationBussinessRequest";
import { UpdateBusinessRequest } from "@/libs/shared/atvsld/dto/request/business/updateBusinessRequest";
import { Business } from "@/libs/shared/atvsld/models/business.model";
import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import LicenseTable from "./LicenseTable";

interface ReviewSubmitProps {
  onComeBack?: () => void;
  formData: Business | null;
}

export default function ReviewSubmit({
  onComeBack,
  formData,
}: ReviewSubmitProps) {
  // debug
  useEffect(() => {
    console.log("ReviewSubmit formData:", formData);
  });

  return (
    <div className="flex flex-col gap-4 w-full overflow-auto shadow-lg p-4 rounded-lg bg-white">
      <Typography variant="h5">
        <strong>Thông tin về hồ sơ</strong>
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Typography variant="body1">
          <strong>Mã số thuế:</strong>
        </Typography>
        <Typography variant="body1">
          <strong>{formData?.taxCode || "Chưa nhập"}</strong>
        </Typography>

        <Typography variant="body1">
          <strong>Tên doanh nghiệp:</strong>
        </Typography>
        <Typography variant="body1">
          <strong>{formData?.name || "Chưa nhập"}</strong>
        </Typography>

        <Typography variant="body1">
          <strong>Tên viết bằng tiếng nước ngoài:</strong>
        </Typography>
        <Typography>
          <strong>{formData?.foreignName || "Chưa nhập"}</strong>
        </Typography>

        <Typography variant="body1">
          <strong>Ngày cấp GPKD:</strong>
        </Typography>
        <Typography variant="body1">
          <strong>
            {formData?.establishedDate
              ? new Date(formData.establishedDate).toLocaleDateString("vi-VN")
              : "Chưa nhập"}
          </strong>
        </Typography>

        <Typography variant="body1">
          <strong>Email:</strong>
        </Typography>
        <Typography variant="body1">
          <strong>{formData?.email || "Chưa nhập"}</strong>
        </Typography>

        <Typography variant="body1">
          <strong>Loại hình kinh doanh:</strong>
        </Typography>
        <Typography>
          <strong>{formData?.businessType || "Chưa nhập"}</strong>
        </Typography>

        <Typography variant="body1">
          <strong>Ngành nghề kinh doanh:</strong>
        </Typography>
        <Typography>
          <strong>{formData?.mainBusinessField || "Chưa nhập"}</strong>
        </Typography>

        <Typography variant="body1">
          <strong>Địa chỉ đăng ký giấy phép kinh doanh:</strong>
        </Typography>
        <Typography>
          <strong>
            {formData?.registrationAddress +
              ", " +
              formData?.registrationWard +
              ", " +
              formData?.registrationDistrict +
              ", " +
              formData?.registrationCity || "Chưa nhập"}
          </strong>
        </Typography>

        <Typography variant="body1">
          <strong>Địa điểm kinh doanh:</strong>
        </Typography>
        <Typography>
          <strong>
            {formData?.operationAddress +
              ", " +
              formData?.operationWard +
              ", " +
              formData?.operationDistrict +
              ", " +
              formData?.operationCity || "Chưa nhập"}
          </strong>
        </Typography>

        <Typography variant="body1">
          <strong>SDT Cơ quan:</strong>
        </Typography>
        <Typography variant="body1">
          <strong>{formData?.phoneNumber || "Chưa nhập"}</strong>
        </Typography>

        <Typography variant="body1">
          <strong>Người đứng đầu doanh nghiệp:</strong>
        </Typography>
        <Typography>
          <strong>{formData?.representativeName || "Chưa nhập"}</strong>
        </Typography>

        <Typography variant="body1">
          <strong>SDT người đứng đầu:</strong>
        </Typography>
        <Typography>
          <strong>{formData?.representativePhone || "Chưa nhập"}</strong>
        </Typography>
      </div>
      <LicenseTable
        step={2}
        businessLicenseFile={formData?.businessLicenseFile || null}
        otherDocumentFile={formData?.otherDocumentFile || null}
      />
    </div>
  );
}
