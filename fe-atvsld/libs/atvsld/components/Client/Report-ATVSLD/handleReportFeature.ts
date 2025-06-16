import { getActiveYears, getReportInstance } from "@/libs/atvsld/services/api/reportSanitationApi";
import { ReportInstanceResponse } from "@/libs/shared/atvsld/dto/response/report-ssanitation/reportInstanceResponse";
import { ReportSanitationForm } from "@/libs/shared/atvsld/models/report-sanitation.model";
import { getReportConfigurationsFeature } from "../../ReportFeature/handleReportFeature";
import { mappingFilterToQueryReportInstance } from "@/libs/shared/atvsld/mapping/ReportInstanceMapping";
import { addYears } from "date-fns";

export const defaultReportSanitationForm: ReportSanitationForm = {
  id: "0",

  // 1 - Thông tin lao động
  TongSoLaoDong: "170",
  LaoDongNu: "0",
  LaoDongDuoi15Tuoi: "0",
  NguoiLamCongTacATVSLD: "0",
  LaoDongLamViecTrongDieuKienDocHai: "0",
  LaoDaoLaNguoiKhuyetTat: "0",
  NguoiLamCongTacYTe: "0",
  LaoDongLaNguoiChuaThanhNien: "0",
  LaoDongLaNguoiCaoTuoi: "0",

  // 2 - Thông tin tai nạn lao động
  TongSoVuTNLD: "10",
  SoNguoiChetViTNLD: "0",
  SoVuCoNguoiChet: "0",
  TongChiPhiChoTNLD: "0",
  SoNguoiBiTNLD: "0",
  SoNgayCongViTNLD: "0",

  // 3 - Bệnh nghề nghiệp
  TongSoNguoiBiBNNToiThoiDiemBC: "0",
  SoNguoiPhaiNghiTruocTuoiHuuViBNN: "0",
  SoNguoiMacMoiBNN: "0",
  TongChiPhiBNNPhatSinhTrongNam: "0",
  SoNgayCongNghiPhepVeBNN: "0",

  // 4 - Kết quả phân loại sức khỏe của nguời lao động
  LoaiI: "0",
  LoaiII: "0",
  LoaiIII: "0",
  LoaiIV: "0",
  LoaiV: "0",

  // 5 - Huấn luyện về vệ sinh an toàn lao động
  Nhom1: "0/0",
  Nhom2: "0/0",
  Nhom3: "0/0",
  Nhom4: "0/0",
  Nhom5: "0/0",
  Nhom6: "0/0",
  TuHuanLuyen: "0/0",
  ThueToChucCungCapDichVu: "0/0",
  TongChiPhiHuanLuyen: "0",

  // 6 - Máy, thiết bị, vật tư có yêu cầu nghiêm ngặt về ATVSLD
  TongSoMayThietBiVatTu: "0",
  MayCoYeuCauNghiemNghat: "0",
  MayDaKiemDinh: "0",
  MayChuaKiemDinh: "0",
  MayDaDuocKhaiBao: "0",
  MayChuaDuocKhaiBao: "0",

  // 7 - Thời gian làm việc, thời gian nghỉ ngơi
  TongSoNguoiLamViecTrongNam: "0",
  TongSoGioLamThemTrongNam: "0",
  SoGioLamThemCaoNhatTrong1Thang: "0",

  // 8 - Bối dưỡng chống độc hại bằng hiện vật
  TongSoNguoi: "0",
  TongChiPhiQuyDinhTaiDiem10: "0",

  // 9 - Tình hình quan trắc môi trường
  SoMauQuanTracMoiTruong: "120",
  SoMauKhongDatTieuChuan: "0",
  MauNhietDoKhongDat: "1/20",
  MauDoAmKhongDat: "0/0",
  MauTocDoGioKhongDat: "0/0",
  MauAnhSangKhongDat: "0/0",
  MauTiengOnKhongDat: "0/0",
  MauBuiKhongDat: "0/0",
  MauRungKhongDat: "0/0",
  MauHoiKhiDocKhongDat: "0/0",
  MauPhongXaKhongDat: "0/0",
  MauDienTuTruongKhongDat: "0/0",
  MauKhacKhongDat: "0/0",

  // 10 - Chi Phi Thuc Hien Ke Hoach ATVSLD
  CacBienKyThuatAnToan: "0",
  ChamSocSucKhoeNguoiLaoDong: "0",
  ChiKhac: "0",
  CacBienPhapKyThuatVeSinh: "0",
  TuyenTruyenHuanLuyen: "0",
  TrangBiPhuongTienBaoVeCaNhan: "0",
  DanhGiaNguyCoRuiRoVeATVSLD: "0",

  // 11 - Tổ chức cung cấp dịch vụ
  TenToChucDichVuATVSLDDuocThue: "",
  TenToChucDichVuYTeDuocThue: "",

  // 12 - Thời điểm tổ chức tiến hành đánh giá định kỳ nguy cơ rủi ro về ATVSLD
  ThoiDiemDanhGiaRuiRo: "0",
};

export const getReportInstanceFeature = async (filters?: Record<string,string>): Promise<ReportInstanceResponse[]> => {
  const request = filters ? mappingFilterToQueryReportInstance(filters) : undefined;
  try {
    const response = await getReportInstance(request);
    if (!response.data || response.status !== 200) {
      throw new Error(response.message || "No report instance data found");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching report instance feature:", error);
    throw error;
  }
}

export const getActiveYearsFeature = async (): Promise<number[]> => {
  try {
    const response = await getActiveYears();
    if (!response.data || response.status !== 200) {
      throw new Error(response.message || "No active years found");
    }

    // Extract years from the report instances
    return response.data;
  } catch (error) {
    console.error("Error fetching active years feature:", error);
    throw error;
  }
}
