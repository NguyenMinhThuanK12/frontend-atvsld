export interface ReportSanitationForm {
    id: string;

    // 1 - Thông tin lao động
    TongSoLaoDong: string;
    LaoDongNu: string;
    LaoDongDuoi15Tuoi: string;
    NguoiLamCongTacATVSLD: string;
    LaoDongLamViecTrongDieuKienDocHai: string;
    LaoDaoLaNguoiKhuyetTat: string;
    NguoiLamCongTacYTe: string;
    LaoDongLaNguoiChuaThanhNien: string;
    LaoDongLaNguoiCaoTuoi: string;

    // 2- Thông tin tai nạn lao động
    TongSoVuTNLD: string;
    SoNguoiChetViTNLD: string;
    SoVuCoNguoiChet: string;
    TongChiPhiChoTNLD: string;
    SoNguoiBiTNLD: string;
    SoNgayCongViTNLD: string;

    // 3 - Bệnh nghề nghiệp
    TongSoNguoiBiBNNToiThoiDiemBC: string;
    SoNguoiPhaiNghiTruocTuoiHuuViBNN: string;
    SoNguoiMacMoiBNN: string;
    TongChiPhiBNNPhatSinhTrongNam: string;
    SoNgayCongNghiPhepVeBNN: string;

    // 4 - Kết quả phân loại sức khỏe của nguời lao động
    LoaiI: string;
    LoaiII: string;
    LoaiIII: string;
    LoaiIV: string;
    LoaiV: string;

    // 5 - Huấn luyện về vệ sinh an toàn lao động
    Nhom1: string;
    Nhom2: string;
    Nhom3: string;
    Nhom4: string;
    Nhom5: string;
    Nhom6: string;
    TuHuanLuyen: string;
    ThueToChucCungCapDichVu: string;
    TongChiPhiHuanLuyen: string;

    // 6 - Máy, thiết bị, vật tư có yêu cầu nghiêm ngặt về ATVSLD
    TongSoMayThietBiVatTu: string;
    MayCoYeuCauNghiemNghat: string;
    MayDaKiemDinh: string;
    MayChuaKiemDinh: string;
    MayDaDuocKhaiBao: string;
    MayChuaDuocKhaiBao: string;

    // 7 - Thời gian làm việc, thời gian nghỉ ngơi
    TongSoNguoiLamViecTrongNam: string;
    TongSoGioLamThemTrongNam: string;
    SoGioLamThemCaoNhatTrong1Thang: string;

    // 8 - Bối dưỡng chống độc hại bằng hiện vật
    TongSoNguoi: string;
    TongChiPhiQuyDinhTaiDiem10: string;

    // 9 - Tình hình quan quan trắc môi trường
    SoMauQuanTracMoiTruong: string;
    SoMauKhongDatTieuChuan: string;
    MauNhietDoKhongDat: string;
    MauDoAmKhongDat: string;
    MauTocDoGioKhongDat: string;
    MauAnhSangKhongDat: string;
    MauTiengOnKhongDat: string;
    MauBuiKhongDat: string;
    MauRungKhongDat: string;
    MauHoiKhiDocKhongDat: string;
    MauPhongXaKhongDat: string;
    MauDienTuTruongKhongDat: string;
    MauKhacKhongDat: string;

    // 10 - Chi Phi Thuc Hien Ke Hoach ATVSLD
    CacBienKyThuatAnToan: string;
    ChamSocSucKhoeNguoiLaoDong: string;
    ChiKhac: string;
    CacBienPhapKyThuatVeSinh: string;
    TuyenTruyenHuanLuyen: string;
    TrangBiPhuongTienBaoVeCaNhan: string;
    DanhGiaNguyCoRuiRoVeATVSLD: string;

    // 11 - Tổ chức cung cấp dịch vụ
    TenToChucDichVuATVSLDDuocThue: string;
    TenToChucDichVuYTeDuocThue: string;

    // 12 - Thời điểm tổ chức tiến hành đánh giá định kỳ nguy cơ rủi ro về ATVSLD
    ThoiDiemDanhGiaRuiRo: string;
}