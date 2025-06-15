import { he } from "date-fns/locale";

export const sections = [
  {
    index: 1,
    title: "Lao động",
    totalHeight: 8 * 35 + 2 * 55,
    items: [
      { label: "- Tổng số lao động", unit: "Người" },
      {
        label: "- Trong đó:\n+ Người làm công tác an toàn, vệ sinh lao động",
        unit: "Người",
        height: 55,
      },
      { label: "+ Người làm công tác y tế", unit: "Người" },
      { label: "+ Lao động nữ", unit: "Người" },
      {
        label:
          "+ Lao động làm việc nặng nhọc, độc hại, nguy hiểm (điều kiện lao động loại IV, V, VI)",
        unit: "Người",
        height: 55,
      },
      { label: "+ Lao động là người chưa thành niên", unit: "Người" },
      { label: "+ Lao động là người dưới 15 tuổi", unit: "Người" },
      { label: "+ Lao động là người khuyết tật", unit: "Người" },
      { label: "+ Lao động là người cao tuổi", unit: "Người" },
    ],
  },
  {
    index: 2,
    title: "Tai nạn lao động",
    totalHeight: 6 * 35 + 1 * 55,
    items: [
      { label: "- Tổng số vụ tai nạn lao động", unit: "Vụ" },
      { label: "- Trong đó:\n+ Số vụ có người chết", unit: "Vụ", height: 55 },
      { label: "+ Số người bị tai nạn lao động", unit: "Người" },
      { label: "+ Số người chết vì tai nạn lao động", unit: "Người" },
      { label: "+ Tổng chi phí cho tai nạn lao động", unit: "Triệu đồng" },
      { label: "+ Số ngày công vì tai nạn lao động", unit: "Ngày" },
    ],
  },
  {
    index: 3,
    title: "Bệnh nghề nghiệp",
    totalHeight: 5 * 35 + 1 * 55,
    items: [
      { label: "- Tổng số người bị BNN tại thời điểm BC", unit: "Người" },
      {
        label: "- Trong đó:\n+ Số người mắc mới BNN",
        unit: "Người",
        height: 55,
      },
      { label: "+ Số ngày công nghỉ phép vì BNN", unit: "Ngày" },
      { label: "+ Số người phải nghỉ hưu sớm vì BNN", unit: "Người" },
      { label: "+ Tổng chi phí BNN phát sinh trong năm", unit: "Triệu đồng" },
    ],
  },
  {
    index: 4,
    title: "Kết quả phân loại sức khỏe",
    totalHeight: 6 * 35,
    items: [
      { label: "+ Loại I", unit: "Người" },
      { label: "+ Loại II", unit: "Người" },
      { label: "+ Loại III", unit: "Người" },
      { label: "+ Loại IV", unit: "Người" },
      { label: "+ Loại V", unit: "Người" },
    ],
  },
  {
    index: 5,
    title: "Huấn luyện về ATVSLĐ",
    totalHeight: 8 * 55 + 35 + 35,
    items: [
      {
        label: "+ Nhóm 1: SL Huấn luyên/SL hiện có",
        unit: "Người/Người",
        height: 55,
      },
      {
        label: "+ Nhóm 2: SL Huấn luyên/SL hiện có",
        unit: "Người/Người",
        height: 55,
      },
      {
        label: "+ Nhóm 3: SL Huấn luyên/SL hiện có",
        unit: "Người/Người",
        height: 55,
      },
      {
        label: "- Trong đó: \n+ Tự huấn luyện",
        unit: "Người/Người",
        height: 55,
      },
      {
        label: "+ Thuê tổ chức cung cấp dịch vụ huấn luyện",
        unit: "Người/Người",
        height: 55,
      },
      {
        label: "+ Nhóm 4: SL Huấn luyên/SL hiện có",
        unit: "Người/Người",
        height: 55,
      },
      {
        label: "+ Nhóm 5: SL Huấn luyên/SL hiện có",
        unit: "Người/Người",
        height: 55,
      },
      {
        label: "+ Nhóm 6: SL Huấn luyên/SL hiện có",
        unit: "Người/Người",
        height: 55,
      },
      {
        label: "+ Tổng chi phí huấn luyện",
        unit: "Triệu đồng",
      },
    ],
  },
  {
    index: 6,
    title: "Máy, thiết bị, vật tư",
    totalHeight: 5 * 35 + 75 + 35,
    items: [
      { label: "+ Tổng số", unit: "Thiết bị" },
      {
        label:
          "- Trong đó:\n+ Máy có yêu cầu nghiêm ngặt về ATVSLĐ đang sử dụng",
        unit: "Thiết bị",
        height: 75,
      },
      { label: "+ Số đã được kiểm định", unit: "Thiết bị" },
      {
        label: "+ Số chưa được kiểm định",
        unit: "Thiết bị",
      },
      {
        label: "+ Số đã được khai báo",
        unit: "Thiết bị",
      },
      { label: "+ Số chưa được khai báo", unit: "Thiết bị" },
    ],
  },
  {
    index: 7,
    title: "Thời gian làm việc/nghỉ ngơi",
    totalHeight: 35 + 2 * 35 + 45,
    items: [
      {
        label: "+ Tổng số người làm trong năm",
        unit: "Người",
      },
      {
        label: "+ Tổng số giờ làm thêm trong năm",
        unit: "Giờ",
        height: 45,
      },
      {
        label: "+ Số giờ làm thêm cao nhất trong 1 tháng",
        unit: "Giờ",
      },
    ],
  },
  {
    index: 8,
    title: "Bồi dưỡng chống độc hại bằng hiện vật",
    totalHeight: 35 + 2 * 35,
    items: [
      {
        label: "+ Tổng số người",
        unit: "Người",
      },
      {
        label: "+ Tổng chi phí quy định tại điểm 10",
        unit: "Triệu đồng",
      },
    ],
  },
  {
    index: 9,
    title: "Tình hình quan trắc môi trường",
    totalHeight: 35 + 11 * 35 + 55 + 45,
    items: [
      {
        label: "+ Số mẫu quan trắc môi trường lao động",
        unit: "Mẫu",
      },
      {
        label: "+ Số mẫu không đạt tiêu chuẩn",
        unit: "Mẫu",
      },
      {
        label: "- Trong đó \n+ Mẫu nhiệt độ không đạt",
        unit: "Mẫu/Mẫu",
        height: 55,
      },
      {
        label: "+ Mẫu độ ẩm không đạt",
        unit: "Mẫu/Mẫu",
      },
      {
        label: "Mẫu tốc độ gió không đạt",
        unit: "Mẫu/Mẫu",
      },
      {
        label: "Mẫu ánh sáng không đạt",
        unit: "Mẫu/Mẫu",
      },
      {
        label: "Mẫu tiếng ồn không đạt",
        unit: "Mẫu/Mẫu",
      },
      {
        label: "Mẫu bụi không đạt",
        unit: "Mẫu/Mẫu",
      },
      {
        label: "Mẫu rung không đạt",
        unit: "Mẫu/Mẫu",
      },
      {
        label: "Mẫu hơi khí độc không đạt",
        unit: "Mẫu/Mẫu",
      },
      {
        label: "Mẫu phóng xạ không đạt",
          unit: "Mẫu/Mẫu",
        height: 45,
      },
      {
        label: "Mẫu điện từ trường không đạt",
        unit: "Mẫu/Mẫu",
      },
      {
        label: "Mẫu khác không đạt",
        unit: "Mẫu/Mẫu",
      },
    ],
  },
  {
    index: 10,
    title: "Chi phí thực hiện kế hoạch ATVSLĐ",
    totalHeight: 35 + 7 * 35,
    items: [
      {
        label: "Các biện pháp kỹ thuật an toàn",
        unit: "Triệu đồng",
      },
      {
        label: "Các biện pháp kỹ thuật vệ sinh",
        unit: "Triệu đồng",
      },
      {
        label: "Trang bị phương tiện bảo vệ cá nhân",
        unit: "Triệu đồng",
      },
      {
        label: "Chăm sóc sức khỏe người lao động",
        unit: "Triệu đồng",
      },
      {
        label: "Tuyên truyền huấn luyện",
        unit: "Triệu đồng",
      },
      {
        label: "Đánh giá nguy cơ rủi ro về ATVSLĐ",
        unit: "Triệu đồng",
      },
      {
        label: "Chi khác",
        unit: "Triệu đồng",
      },
    ],
  },
];
