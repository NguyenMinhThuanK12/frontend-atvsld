import { Document, Page, Text, View } from "@react-pdf/renderer";
import "./registerFont";
import styles from "./globalStyle";
import { sections } from "./documentSection";
import { ReportSanitationForm } from "@/libs/shared/atvsld/models/report-sanitation.model";

interface PDFDocumentProps {
  formData: ReportSanitationForm;
}

export const PDFDocument = (props: PDFDocumentProps) => {
  const { formData } = props;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text
          style={{
            ...styles.boldText,
            ...styles.centeredText,
            marginBottom: 10,
            fontSize: 14,
          }}
        >
          PHỤ LỤC II
        </Text>
        <Text
          style={{
            ...styles.boldText,
            ...styles.centeredText,
            marginBottom: 10,
          }}
        >
          MẪU BÁO CÁO CÔNG TÁC AN TOÀN - VỆ SINH LAO ĐỘNG CỦA DOANH NGHIỆP
        </Text>
        <Text
          style={{
            ...styles.italicText,
            ...styles.centeredText,
            marginBottom: 10,
            fontSize: 12,
          }}
        >
          (Kèm theo Thông tư số 07/2016/TT-BLĐTBXH ngày 15 tháng 5 năm 2016 của
          Bộ trưởng Bộ Lao động - Thương binh và Xã hội)
        </Text>

        <View style={{ textAlign: "left", marginTop: 8 }}>
          <Text style={{ fontSize: 14, ...styles.boldText, marginBottom: 10 }}>
            ĐỊA PHƯƠNG: _______________
          </Text>
          <Text style={{ fontSize: 14, ...styles.boldText, marginBottom: 10 }}>
            DOANH NGHIỆP, CƠ SỞ: _______________
          </Text>
          <Text style={{ fontSize: 14, ...styles.boldText, marginBottom: 10 }}>
            Kính gửi:{" "}
            <Text style={{ fontWeight: 400 }}>
              Sở Lao động - Thương binh và Xã hội tỉnh, thành phố _______
            </Text>
          </Text>
        </View>

        <View style={{ ...styles.centeredText, marginTop: 8 }}>
          <Text style={{ fontSize: 14, ...styles.boldText, marginBottom: 10 }}>
            BÁO CÁO CÔNG TÁC AN TOÀN VỆ SINH LAO ĐỘNG
          </Text>
          <Text style={{ fontSize: 14, ...styles.boldText, marginBottom: 10 }}>
            NĂM: ____
          </Text>
        </View>

        <View style={{ marginTop: 20, textAlign: "left" }}>
          <Text style={{ fontSize: 14, marginBottom: 8 }}>
            Tên<Text style={{ fontSize: 10, verticalAlign: "super" }}>1</Text>:
            _____________________
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 8 }}>
            Ngành nghề sản xuất kinh doanh
            <Text style={{ fontSize: 10, verticalAlign: "super" }}>2</Text>:
            _______________
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 8 }}>
            Loại hình
            <Text style={{ fontSize: 10, verticalAlign: "super" }}>3</Text>:
            _______________
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 8 }}>
            Cơ quan cấp trên trực tiếp quản lý
            <Text style={{ fontSize: 10, verticalAlign: "super" }}>4</Text>:
            _______________
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 8 }}>
            Địa chỉ: (Số nhà, đường phố, quận, huyện, thị xã) _______________
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 8 }}>
            Điện thoại: _______________
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.header}>
            <View style={{ width: "10%", ...styles.headerCell }}>
              <Text style={styles.headerText}>TT</Text>
            </View>
            <View style={{ width: "60%", ...styles.headerCell }}>
              <Text style={styles.headerText}>
                Các chỉ tiêu trong kỳ báo cáo
              </Text>
            </View>
            <View style={{ width: "20%", ...styles.headerCell }}>
              <Text style={styles.headerText}>ĐVT</Text>
            </View>
            <View style={{ width: "10%", ...styles.headerCell }}>
              <Text style={styles.headerText}>Số liệu</Text>
            </View>
          </View>

          {/* Table Sections */}
          {/* Section A: Báo cáo chung */}
          <View style={styles.row}>
            <View style={{ width: "10%", height: 35, ...styles.cell }}>
              <Text style={{ ...styles.centeredText, ...styles.boldText }}>
                A
              </Text>
            </View>
            <View style={{ width: "60%", height: 35, ...styles.cell }}>
              <Text style={{ ...styles.cellText, ...styles.boldText }}>
                Báo cáo chung
              </Text>
            </View>
            <View style={{ width: "20%", height: 35, ...styles.cell }} />
            <View style={{ width: "10%", height: 35, ...styles.cell }} />
          </View>

          {sections.map((section) => (
            <TableSection
              key={section.index}
              index={section.index}
              title={section.title}
              items={section.items}
              totalHeight={section.totalHeight}
            />
          ))}
        </View>
      </Page>
    </Document>
  );
};

interface TableSectionProps {
  index: number;
  title: string;
  items: { label: string; unit: string; height?: number }[];
  totalHeight: number;
}

const TableSection = (props: TableSectionProps) => {
  const { index, title, items, totalHeight } = props;

  return (
    <View style={styles.row}>
      {/* Column 1: Index */}
      <View style={{ width: "10%", height: totalHeight, ...styles.column }}>
        <View style={{ width: "100%", height: "100%", ...styles.cell }}>
          <Text style={styles.centeredText}>{index}</Text>
        </View>
      </View>
      {/* Column 2: Labels */}
      <View style={{ width: "60%", height: totalHeight, ...styles.column }}>
        <View style={{ width: "100%", height: 35, ...styles.cell }}>
          <Text style={{ ...styles.cellText, ...styles.boldText }}>
            {title}
          </Text>
        </View>
        {items.map((item, idx) => (
          <View
            key={idx}
            style={{ width: "100%", height: item.height || 35, ...styles.cell }}
          >
            <Text style={styles.cellText}>{item.label}</Text>
          </View>
        ))}
      </View>
      {/* Column 3: Units */}
      <View style={{ width: "20%", height: totalHeight, ...styles.column }}>
        <View style={{ width: "100%", height: 35, ...styles.cell }} />
        {items.map((item, idx) => (
          <View
            key={idx}
            style={{ width: "100%", height: item.height || 35, ...styles.cell }}
          >
            <Text style={styles.centeredText}>{item.unit}</Text>
          </View>
        ))}
      </View>
      {/* Column 4: Empty Data */}
      <View style={{ width: "10%", height: totalHeight, ...styles.column }}>
        <View style={{ width: "100%", height: 35, ...styles.cell }} />
        {items.map((item, idx) => (
          <View
            key={idx}
            style={{ width: "100%", height: item.height || 35, ...styles.cell }}
          >
            <Text style={styles.centeredText}></Text>
          </View>
        ))}
      </View>
    </View>
  );
};
