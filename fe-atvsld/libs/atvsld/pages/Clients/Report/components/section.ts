import { SectionConfig } from "./demo-report2";

export const formSections: SectionConfig[] = [
  {
    id: 1,
    title: "Thông tin lao động",
    fields: [
      {
        name: "TongSoLaoDong",
        label: "Tổng số lao động",
        component: "NumericInput",
      },
      {
        name: "NguoiLamCongTacATVSLD",
        label: "Người làm công tác ATVSLD",
        component: "NumericInput",
      },
      {
        name: "NguoiLamCongTacYTe",
        label: "Người làm công tác y tế",
        component: "NumericInput",
      },
      { name: "LaoDongNu", label: "Lao động nữ", component: "NumericInput" },
      {
        name: "LaoDongLamViecTrongDieuKienDocHai",
        label: "Lao động làm việc trong điều kiện độc hại",
        component: "NumericInput",
      },
      {
        name: "LaoDongLaNguoiChuaThanhNien",
        label: "Lao động là người chưa thành niên",
        component: "NumericInput",
      },
      {
        name: "LaoDongDuoi15Tuoi",
        label: "Lao động dưới 15 tuổi",
        component: "NumericInput",
      },
      {
        name: "LaoDaoLaNguoiKhuyetTat",
        label: "Lao động là người khuyết tật",
        component: "NumericInput",
      },
      {
        name: "LaoDongLaNguoiCaoTuoi",
        label: "Lao động là người cao tuổi",
        component: "NumericInput",
      },
    ],
  },
  {
    id: 2,
    title: "Thông tin tai nạn lao động",
    fields: [
      {
        name: "TongSoVuTNLD",
        label: "Tổng số vụ TNLD",
        component: "NumericInput",
      },
      {
        name: "SoVuCoNguoiChet",
        label: "Số vụ có người chết",
        component: "NumericInput",
      },
      {
        name: "SoNguoiBiTNLD",
        label: "Số người bị TNLD",
        component: "NumericInput",
      },
      {
        name: "SoNguoiChetViTNLD",
        label: "Số người chết vì TNLD",
        component: "NumericInput",
      },
      {
        name: "TongChiPhiChoTNLD",
        label: "Tổng chi phí cho TNLD",
        component: "CostInput",
      },
      {
        name: "SoNgayCongViTNLD",
        label: "Số ngày công vì TNLD",
        component: "NumericInput",
      },
    ],
  },
  {
    id: 3,
    title: "Bệnh nghề nghiệp",
    fields: [
      {
        name: "TongSoNguoiBiBNNToiThoiDiemBC",
        label: "Tổng số người bị BNN tới thời điểm BC",
        component: "NumericInput",
      },
      {
        name: "SoNguoiMacMoiBNN",
        label: "Số người mắc mới BNN",
        component: "NumericInput",
      },
      {
        name: "SoNgayCongNghiPhepVeBNN",
        label: "Số ngày công nghỉ phép vì BNN",
        component: "NumericInput",
      },
      {
        name: "SoNguoiPhaiNghiTruocTuoiHuuViBNN",
        label: "Số người phải nghỉ trước tuổi hưu vì BNN",
        component: "NumericInput",
      },
      {
        name: "TongChiPhiBNNPhatSinhTrongNam",
        label: "Tổng chi phí BNN phát sinh trong năm",
        component: "CostInput",
      },
    ],
    note: "*** Lưu ý: nhập số tiền theo đơn vị triệu đồng",
  },
  {
    id: 4,
    title: "Kết quả phân loại sức khỏe của người lao động",
    fields: [
      { name: "LoaiI", label: "Loại I (Người)", component: "NumericInput" },
      { name: "LoaiII", label: "Loại II (Người)", component: "NumericInput" },
      { name: "LoaiIII", label: "Loại III (Người)", component: "NumericInput" },
      { name: "LoaiIV", label: "Loại IV (Người)", component: "NumericInput" },
      { name: "LoaiV", label: "Loại V (Người)", component: "NumericInput" },
    ],
  },
  {
    id: 5,
    title: "Huấn luyện về vệ sinh an toàn lao động",
    fields: [
      {
        name: "Nhom1",
        label: "Nhóm 1: SL huấn luyện / SL hiện có (người/người)",
        component: "NumericInput",
      },
      {
        name: "Nhom2",
        label: "Nhóm 2: SL huấn luyện / SL hiện có (người/người)",
        component: "NumericInput",
      },
      {
        name: "Nhom3",
        label: "Nhóm 3: SL huấn luyện / SL hiện có (người/người)",
        component: "NumericInput",
      },
      {
        name: "Nhom4",
        label: "Nhóm 4: SL huấn luyện / SL hiện có (người/người)",
        component: "NumericInput",
      },
      {
        name: "Nhom5",
        label: "Nhóm 5: SL huấn luyện / SL hiện có (người/người)",
        component: "NumericInput",
      },
      {
        name: "Nhom6",
        label: "Nhóm 6: SL huấn luyện / SL hiện có (người/người)",
        component: "NumericInput",
      },
      {
        name: "TuHuanLuyen",
        label: "Trong đó: Tự huấn luyện (người/người)",
        component: "NumericInput",
      },
      {
        name: "ThueToChucCungCapDichVu",
        label: "Thuê tổ chức cung cấp dịch vụ (người/người)",
        component: "NumericInput",
      },
      {
        name: "TongChiPhiHuanLuyen",
        label: "Tổng chi phí huấn luyện",
        component: "CostInput",
      },
    ],
    note: "*** Lưu ý: nhập số tiền theo đơn vị triệu đồng",
  },
  {
    id: 6,
    title: "Máy, thiết bị, vật tư có yêu cầu nghiêm ngặt về ATVSLD",
    fields: [
      {
        name: "TongSoMayThietBiVatTu",
        label: "Tổng số máy, thiết bị, vật tư",
        component: "NumericInput",
      },
      {
        name: "MayCoYeuCauNghiemNghat",
        label: "Máy có yêu cầu nghiêm ngặt ATVSLD đang sử dụng",
        component: "NumericInput",
      },
      {
        name: "MayDaKiemDinh",
        label: "Số đã được kiểm định",
        component: "NumericInput",
      },
      {
        name: "MayChuaKiemDinh",
        label: "Số chưa được kiểm định",
        component: "NumericInput",
      },
      {
        name: "MayDaDuocKhaiBao",
        label: "Số đã được khai báo",
        component: "NumericInput",
      },
      {
        name: "MayChuaDuocKhaiBao",
        label: "Số chưa được khai báo",
        component: "NumericInput",
      },
    ],
  },
  {
    id: 7,
    title: "Thời gian làm việc, thời gian nghỉ ngơi",
    fields: [
      {
        name: "TongSoNguoiLamViecTrongNam",
        label: "Tổng số người làm việc trong năm (người)",
        component: "NumericInput",
      },
      {
        name: "TongSoGioLamThemTrongNam",
        label: "Tổng số giờ làm thêm trong năm",
        component: "NumericInput",
      },
      {
        name: "SoGioLamThemCaoNhatTrong1Thang",
        label: "Tổng số giờ làm thêm cao nhất trong 1 tháng",
        component: "NumericInput",
      },
    ],
  },
  {
    id: 8,
    title: "Bồi dưỡng chống độc hại bằng hiện vật",
    fields: [
      {
        name: "TongSoNguoi",
        label: "Tổng số người",
        component: "NumericInput",
      },
      {
        name: "TongChiPhiQuyDinhTaiDiem10",
        label: "Tổng chi phí quy định tại điểm 10",
        component: "CostInput",
      },
    ],
    note: "*** Lưu ý: nhập số tiền theo đơn vị triệu đồng",
  },
  {
    id: 9,
    title: "Tình hình quan trắc môi trường",
    fields: [
      {
        name: "SoMauQuanTracMoiTruong",
        label: "Số mẫu quan trắc môi trường (Mẫu)",
        component: "NumericInput",
      },
      {
        name: "SoMauKhongDatTieuChuan",
        label: "Số mẫu không đạt tiêu chuẩn (Mẫu)",
        component: "NumericInput",
      },
      {
        name: "MauNhietDoKhongDat",
        label: "Số mẫu nhiệt độ không đạt (Mẫu/Mẫu)",
        component: "NumericInput",
      },
      {
        name: "MauDoAmKhongDat",
        label: "Số mẫu độ ẩm không đạt (Mẫu/Mẫu)",
        component: "NumericInput",
      },
      {
        name: "MauTocDoGioKhongDat",
        label: "Số mẫu tốc độ gió không đạt (Mẫu/Mẫu)",
        component: "NumericInput",
      },
      {
        name: "MauAnhSangKhongDat",
        label: "Số mẫu ánh sáng không đạt (Mẫu/Mẫu)",
        component: "NumericInput",
      },
      {
        name: "MauTiengOnKhongDat",
        label: "Số mẫu tiếng ồn không đạt (Mẫu/Mẫu)",
        component: "NumericInput",
      },
      {
        name: "MauBuiKhongDat",
        label: "Số mẫu bụi không đạt (Mẫu/Mẫu)",
        component: "NumericInput",
      },
      {
        name: "MauRungKhongDat",
        label: "Số mẫu rung không đạt (Mẫu/Mẫu)",
        component: "NumericInput",
      },
      {
        name: "MauHoiKhiDocKhongDat",
        label: "Số mẫu hơi khí độc không đạt (Mẫu/Mẫu)",
        component: "NumericInput",
      },
      {
        name: "MauPhongXaKhongDat",
        label: "Số mẫu phóng xạ không đạt (Mẫu/Mẫu)",
        component: "NumericInput",
      },
      {
        name: "MauDienTuTruongKhongDat",
        label: "Số mẫu điện từ trường không đạt (Mẫu/Mẫu)",
        component: "NumericInput",
      },
      {
        name: "MauKhacKhongDat",
        label: "Số mẫu khác không đạt (Mẫu/Mẫu)",
        component: "NumericInput",
      },
    ],
  },
  {
    id: 10,
    title: "Chi phí thực hiện kế hoạch ATVSLD",
    fields: [
      {
        name: "CacBienKyThuatAnToan",
        label: "Các biện pháp kỹ thuật an toàn",
        component: "CostInput",
      },
      {
        name: "CacBienPhapKyThuatVeSinh",
        label: "Các biện pháp kỹ thuật vệ sinh",
        component: "CostInput",
      },
      {
        name: "TrangBiPhuongTienBaoVeCaNhan",
        label: "Trang bị phương tiện bảo vệ cá nhân",
        component: "CostInput",
      },
      {
        name: "ChamSocSucKhoeNguoiLaoDong",
        label: "Chăm sóc sức khỏe người lao động",
        component: "CostInput",
      },
      {
        name: "TuyenTruyenHuanLuyen",
        label: "Tuyên truyền huấn luyện",
        component: "CostInput",
      },
      {
        name: "DanhGiaNguyCoRuiRoVeATVSLD",
        label: "Chi phí đánh giá nguy cơ rủi ro về ATVSLD",
        component: "CostInput",
      },
      { name: "ChiKhac", label: "Chi khác", component: "CostInput" },
    ],
    note: "*** Lưu ý: nhập số tiền theo đơn vị triệu đồng",
  },
  {
    id: 11,
    title: "Tổ chức cung cấp dịch vụ",
    fields: [
      {
        name: "TenToChucDichVuATVSLDDuocThue",
        label: "Tên tổ chức dịch vụ ATVSLD được thuê",
        component: "TextInput",
      },
      {
        name: "TenToChucDichVuYTeDuocThue",
        label: "Tên tổ chức dịch vụ y tế được thuê",
        component: "TextInput",
      },
    ],
  },
  {
    id: 12,
    title:
      "Thời điểm tổ chức tiến hành đánh giá định kỳ nguy cơ rủi ro về ATVSLD",
    fields: [
      {
        name: "ThoiDiemDanhGiaRuiRo",
        label: "Tháng/Năm",
        component: "MonthYearPicker",
      },
    ],
  },
];