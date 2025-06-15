import { defaultReportSanitationForm } from '@/libs/atvsld/components/Client/Report-ATVSLD/handleReportFeature';
import CostInput from '@/libs/core/components/Form-components/CostInput';
import MonthYearPicker from '@/libs/core/components/Form-components/MonthYearPickerProps';
import NumericInput from '@/libs/core/components/Form-components/NumericInput';
import TextInput from '@/libs/core/components/Form-components/TextInput';
import { ReportSanitationForm } from '@/libs/shared/atvsld/models/report-sanitation.model';
import { Divider, Grid } from '@mui/material';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

export default function ReportDemo() {
    const [selectedReportSanitation, setSelectedReportSanitation] =
      useState<ReportSanitationForm>(defaultReportSanitationForm);

    const {
      control,
      formState: { errors },
    } = useForm<ReportSanitationForm>({
      defaultValues: selectedReportSanitation,
    });
  return (
    <div>
      <div className="w-full h-[650px] p-4 flex items-center justify-center">
        <div className="w-full h-full flex-grow bg-white p-6 rounded-lg shadow-md overflow-auto">
          <form className="w-full flex flex-col gap-4">
            {/* 1 - Thông tin lao động */}
            <div className="flex flex-col space-y-6 items-start">
              <span className="text-md text-gray-900 font-semibold">
                1. Thông tin lao động
              </span>
              <Grid
                container
                rowSpacing={4}
                columnSpacing={8}
                sx={{ width: "100%" }}
              >
                <NumericInput
                  name="TongSoLaoDong"
                  label="Tổng số lao động"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="NguoiLamCongTacATVSLD"
                  label="Người làm công tác ATVSLD"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="NguoiLamCongTacYTe"
                  label="Người làm công tác y tế"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="LaoDongNu"
                  label="Lao động nữ"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="LaoDongLamViecTrongDieuKienDocHai"
                  label="Lao động làm việc trong điều kiện độc hại"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="LaoDongLaNguoiChuaThanhNien"
                  label="Lao động là người chưa thành niên"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="LaoDongDuoi15Tuoi"
                  label="Lao động dưới 15 tuổi"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="LaoDaoLaNguoiKhuyetTat"
                  label="Lao động là người khuyết tật"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="LaoDongLaNguoiCaoTuoi"
                  label="Lao động là người cao tuổi"
                  control={control}
                  errors={errors}
                />
              </Grid>
            </div>

            <Divider
              sx={{
                borderColor: "#e6e6e6",
                borderBottomWidth: 2,
                mx: "auto",
                mt: 2,
                width: "100%",
              }}
            />

            {/* 2 - Thông tin tai nạn lao động */}
            <div className="flex flex-col space-y-6 items-start">
              <span className="text-md text-gray-900 font-semibold">
                2. Thông tin tai nạn lao động
              </span>
              <Grid
                container
                rowSpacing={4}
                columnSpacing={8}
                sx={{ width: "100%" }}
              >
                <NumericInput
                  name="TongSoVuTNLD"
                  label="Tổng số vụ TNLD"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="SoVuCoNguoiChet"
                  label="Số vụ có người chết"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="SoNguoiBiTNLD"
                  label="Số người bị TNLD"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="SoNguoiChetViTNLD"
                  label="Số người chết vì TNLD"
                  control={control}
                  errors={errors}
                />
                <CostInput
                  name="TongChiPhiChoTNLD"
                  label="Tổng chi phí cho TNLD"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="SoNgayCongViTNLD"
                  label="Số ngày công vì TNLD"
                  control={control}
                  errors={errors}
                />
              </Grid>
            </div>

            <Divider
              sx={{
                borderColor: "#e6e6e6",
                borderBottomWidth: 2,
                mx: "auto",
                mt: 2,
                width: "100%",
              }}
            />

            {/* 3 - Bệnh nghề nghiệp */}
            <div className="flex flex-col space-y-6 items-start">
              <div className="w-full flex items-center justify-between">
                <span className="text-md text-gray-900 font-semibold">
                  3. Bệnh nghề nghiệp
                </span>
                <span className="text-sm text-red-400 font-semibold">
                  *** Lưu ý: nhập số tiền theo đơn vị triệu đồng
                </span>
              </div>
              <Grid
                container
                rowSpacing={4}
                columnSpacing={8}
                sx={{ width: "100%" }}
              >
                <NumericInput
                  name="TongSoNguoiBiBNNToiThoiDiemBC"
                  label="Tổng số người bị BNN tới thời điểm BC"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="SoNguoiMacMoiBNN"
                  label="Số người mắc mới BNN"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="SoNgayCongNghiPhepVeBNN"
                  label="Số ngày công nghỉ phép vì BNN"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="SoNguoiPhaiNghiTruocTuoiHuuViBNN"
                  label="Số người phải nghỉ trước tuổi hưu vì BNN"
                  control={control}
                  errors={errors}
                />
                <CostInput
                  name="TongChiPhiBNNPhatSinhTrongNam"
                  label="Tổng chi phí BNN phát sinh trong năm"
                  control={control}
                  errors={errors}
                />
              </Grid>
            </div>

            <Divider
              sx={{
                borderColor: "#e6e6e6",
                borderBottomWidth: 2,
                mx: "auto",
                mt: 2,
                width: "100%",
              }}
            />

            {/* 4 - Kết quả phân loại sức khỏe */}
            <div className="flex flex-col space-y-6 items-start">
              <span className="text-md text-gray-900 font-semibold">
                4. Kết quả phân loại sức khỏe của người lao động
              </span>
              <Grid
                container
                rowSpacing={4}
                columnSpacing={8}
                sx={{ width: "100%" }}
              >
                <NumericInput
                  name="LoaiI"
                  label="Loại I (Người)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="LoaiII"
                  label="Loại II (Người)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="LoaiIII"
                  label="Loại III (Người)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="LoaiIV"
                  label="Loại IV (Người)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="LoaiV"
                  label="Loại V (Người)"
                  control={control}
                  errors={errors}
                />
              </Grid>
            </div>

            <Divider
              sx={{
                borderColor: "#e6e6e6",
                borderBottomWidth: 2,
                mx: "auto",
                mt: 2,
                width: "100%",
              }}
            />

            {/* 5 - Huấn luyện về vệ sinh an toàn lao động */}
            <div className="flex flex-col space-y-6 items-start">
              <div className="w-full flex items-center justify-between">
                <span className="text-md text-gray-900 font-semibold">
                  5. Huấn luyện về vệ sinh an toàn lao động
                </span>
                <span className="text-sm text-red-400 font-semibold">
                  *** Lưu ý: nhập số tiền theo đơn vị triệu đồng
                </span>
              </div>
              <Grid
                container
                rowSpacing={4}
                columnSpacing={8}
                sx={{ width: "100%" }}
              >
                <NumericInput
                  name="Nhom1"
                  label="Nhóm 1: SL huấn luyện / SL hiện có (người/người)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="Nhom2"
                  label="Nhóm 2: SL huấn luyện / SL hiện có (người/người)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="Nhom3"
                  label="Nhóm 3: SL huấn luyện / SL hiện có (người/người)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="Nhom4"
                  label="Nhóm 4: SL huấn luyện / SL hiện có (người/người)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="Nhom5"
                  label="Nhóm 5: SL huấn luyện / SL hiện có (người/người)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="Nhom6"
                  label="Nhóm 6: SL huấn luyện / SL hiện có (người/người)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="TuHuanLuyen"
                  label="Trong đó: Tự huấn luyện (người/người)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="ThueToChucCungCapDichVu"
                  label="Thuê tổ chức cung cấp dịch vụ (người/người)"
                  control={control}
                  errors={errors}
                />
                <CostInput
                  name="TongChiPhiHuanLuyen"
                  label="Tổng chi phí huấn luyện"
                  control={control}
                  errors={errors}
                />
              </Grid>
            </div>

            <Divider
              sx={{
                borderColor: "#e6e6e6",
                borderBottomWidth: 2,
                mx: "auto",
                mt: 2,
                width: "100%",
              }}
            />

            {/* 6 - Máy, thiết bị, vật tư */}
            <div className="flex flex-col space-y-6 items-start">
              <span className="text-md text-gray-900 font-semibold">
                6. Máy, thiết bị, vật tư có yêu cầu nghiêm ngặt về ATVSLD
              </span>
              <Grid
                container
                rowSpacing={4}
                columnSpacing={8}
                sx={{ width: "100%" }}
              >
                <NumericInput
                  name="TongSoMayThietBiVatTu"
                  label="Tổng số máy, thiết bị, vật tư"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="MayCoYeuCauNghiemNghat"
                  label="Máy có yêu cầu nghiêm ngặt ATVSLD đang sử dụng"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="MayDaKiemDinh"
                  label="Số đã được kiểm định"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="MayChuaKiemDinh"
                  label="Số chưa được kiểm định"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="MayDaDuocKhaiBao"
                  label="Số đã được khai báo"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="MayChuaDuocKhaiBao"
                  label="Số chưa được khai báo"
                  control={control}
                  errors={errors}
                />
              </Grid>
            </div>

            <Divider
              sx={{
                borderColor: "#e6e6e6",
                borderBottomWidth: 2,
                mx: "auto",
                mt: 2,
                width: "100%",
              }}
            />

            {/* 7 - Thời gian làm việc, thời gian nghỉ ngơi */}
            <div className="flex flex-col space-y-6 items-start">
              <span className="text-md text-gray-900 font-semibold">
                7. Thời gian làm việc, thời gian nghỉ ngơi
              </span>
              <Grid
                container
                rowSpacing={4}
                columnSpacing={8}
                sx={{ width: "100%" }}
              >
                <NumericInput
                  name="TongSoNguoiLamViecTrongNam"
                  label="Tổng số người làm việc trong năm (người)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="TongSoGioLamThemTrongNam"
                  label="Tổng số giờ làm thêm trong năm"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="SoGioLamThemCaoNhatTrong1Thang"
                  label="Tổng số giờ làm thêm cao nhất trong 1 tháng"
                  control={control}
                  errors={errors}
                />
              </Grid>
            </div>

            <Divider
              sx={{
                borderColor: "#e6e6e6",
                borderBottomWidth: 2,
                mx: "auto",
                mt: 2,
                width: "100%",
              }}
            />

            {/* 8 - Bồi dưỡng chống độc hại bằng hiện vật */}
            <div className="flex flex-col space-y-6 items-start">
              <div className="w-full flex items-center justify-between">
                <span className="text-md text-gray-900 font-semibold">
                  8. Bồi dưỡng chống độc hại bằng hiện vật
                </span>
                <span className="text-sm text-red-400 font-semibold">
                  *** Lưu ý: nhập số tiền theo đơn vị triệu đồng
                </span>
              </div>
              <Grid
                container
                rowSpacing={4}
                columnSpacing={8}
                sx={{ width: "100%" }}
              >
                <NumericInput
                  name="TongSoNguoi"
                  label="Tổng số người"
                  control={control}
                  errors={errors}
                />
                <CostInput
                  name="TongChiPhiQuyDinhTaiDiem10"
                  label="Tổng chi phí quy định tại điểm 10"
                  control={control}
                  errors={errors}
                />
              </Grid>
            </div>

            <Divider
              sx={{
                borderColor: "#e6e6e6",
                borderBottomWidth: 2,
                mx: "auto",
                mt: 2,
                width: "100%",
              }}
            />

            {/* 9 - Tình hình quan trắc môi trường */}
            <div className="flex flex-col space-y-6 items-start">
              <span className="text-md text-gray-900 font-semibold">
                9. Tình hình quan trắc môi trường
              </span>
              <Grid
                container
                rowSpacing={4}
                columnSpacing={8}
                sx={{ width: "100%" }}
              >
                <NumericInput
                  name="SoMauQuanTracMoiTruong"
                  label="Số mẫu quan trắc môi trường (Mẫu)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="SoMauKhongDatTieuChuan"
                  label="Số mẫu không đạt tiêu chuẩn (Mẫu)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="MauNhietDoKhongDat"
                  label="Số mẫu nhiệt độ không đạt (Mẫu/Mẫu)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="MauDoAmKhongDat"
                  label="Số mẫu độ ẩm không đạt (Mẫu/Mẫu)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="MauTocDoGioKhongDat"
                  label="Số mẫu tốc độ gió không đạt (Mẫu/Mẫu)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="MauAnhSangKhongDat"
                  label="Số mẫu ánh sáng không đạt (Mẫu/Mẫu)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="MauTiengOnKhongDat"
                  label="Số mẫu tiếng ồn không đạt (Mẫu/Mẫu)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="MauBuiKhongDat"
                  label="Số mẫu bụi không đạt (Mẫu/Mẫu)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="MauRungKhongDat"
                  label="Số mẫu rung không đạt (Mẫu/Mẫu)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="MauHoiKhiDocKhongDat"
                  label="Số mẫu hơi khí độc không đạt (Mẫu/Mẫu)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="MauPhongXaKhongDat"
                  label="Số mẫu phóng xạ không đạt (Mẫu/Mẫu)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="MauDienTuTruongKhongDat"
                  label="Số mẫu điện từ trường không đạt (Mẫu/Mẫu)"
                  control={control}
                  errors={errors}
                />
                <NumericInput
                  name="MauKhacKhongDat"
                  label="Số mẫu khác không đạt (Mẫu/Mẫu)"
                  control={control}
                  errors={errors}
                />
              </Grid>
            </div>

            <Divider
              sx={{
                borderColor: "#e6e6e6",
                borderBottomWidth: 2,
                mx: "auto",
                mt: 2,
                width: "100%",
              }}
            />

            {/* 10 - Chi phí thực hiện kế hoạch ATVSLD */}
            <div className="flex flex-col space-y-6 items-start">
              <div className="w-full flex items-center justify-between">
                <span className="text-md text-gray-900 font-semibold">
                  10. Chi phí thực hiện kế hoạch ATVSLD
                </span>
                <span className="text-sm text-red-400 font-semibold">
                  *** Lưu ý: nhập số tiền theo đơn vị triệu đồng
                </span>
              </div>
              <Grid
                container
                rowSpacing={4}
                columnSpacing={8}
                sx={{ width: "100%" }}
              >
                <CostInput
                  name="CacBienKyThuatAnToan"
                  label="Các biện pháp kỹ thuật an toàn"
                  control={control}
                  errors={errors}
                />
                <CostInput
                  name="CacBienPhapKyThuatVeSinh"
                  label="Các biện pháp kỹ thuật vệ sinh"
                  control={control}
                  errors={errors}
                />
                <CostInput
                  name="TrangBiPhuongTienBaoVeCaNhan"
                  label="Trang bị phương tiện bảo vệ cá nhân"
                  control={control}
                  errors={errors}
                />
                <CostInput
                  name="ChamSocSucKhoeNguoiLaoDong"
                  label="Chăm sóc sức khỏe người lao động"
                  control={control}
                  errors={errors}
                />
                <CostInput
                  name="TuyenTruyenHuanLuyen"
                  label="Tuyên truyền huấn luyện"
                  control={control}
                  errors={errors}
                />
                <CostInput
                  name="DanhGiaNguyCoRuiRoVeATVSLD"
                  label="Chi phí đánh giá nguy cơ rủi ro về ATVSLD"
                  control={control}
                  errors={errors}
                />
                <CostInput
                  name="ChiKhac"
                  label="Chi khác"
                  control={control}
                  errors={errors}
                />
              </Grid>
            </div>

            <Divider
              sx={{
                borderColor: "#e6e6e6",
                borderBottomWidth: 2,
                mx: "auto",
                mt: 2,
                width: "100%",
              }}
            />

            {/* 11 - Tổ chức cung cấp dịch vụ */}
            <div className="flex flex-col space-y-6 items-start">
              <span className="text-md text-gray-900 font-semibold">
                11. Tổ chức cung cấp dịch vụ
              </span>
              <Grid
                container
                rowSpacing={4}
                columnSpacing={8}
                sx={{ width: "100%" }}
              >
                <TextInput
                  name="TenToChucDichVuATVSLDDuocThue"
                  label="Tên tổ chức dịch vụ ATVSLD được thuê"
                  control={control}
                  errors={errors}
                />
                <TextInput
                  name="TenToChucDichVuYTeDuocThue"
                  label="Tên tổ chức dịch vụ y tế được thuê"
                  control={control}
                  errors={errors}
                />
              </Grid>
            </div>

            <Divider
              sx={{
                borderColor: "#e6e6e6",
                borderBottomWidth: 2,
                mx: "auto",
                mt: 2,
                width: "100%",
              }}
            />

            {/* 12 - Thời điểm đánh giá định kỳ */}
            <div className="flex flex-col space-y-6 items-start">
              <span className="text-md text-gray-900 font-semibold">
                12. Thời điểm tổ chức tiến hành đánh giá định kỳ nguy cơ rủi ro
                về ATVSLD
              </span>
              <Grid
                container
                rowSpacing={4}
                columnSpacing={8}
                sx={{ width: "100%" }}
              >
                <MonthYearPicker
                  name="ThoiDiemDanhGiaRuiRo"
                  label="Tháng/Năm"
                  control={control}
                  errors={errors}
                />
              </Grid>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
