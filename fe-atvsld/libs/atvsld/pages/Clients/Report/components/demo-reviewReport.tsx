import { PDFDocument, PDFViewer } from "@/libs/atvsld/components/pdf";
import { ReportSanitationForm } from "@/libs/shared/atvsld/models/report-sanitation.model";
import React from "react";

interface ReviewReportDemoProps {
  formData: ReportSanitationForm;
}

export default function ReviewReportDemo(props: ReviewReportDemoProps) {
  const { formData } = props;
  return (
    <PDFViewer
      className="w-full h-full"
      style={{ height: "100%", width: "100%" }}
    >
      <PDFDocument formData={formData} />
    </PDFViewer>
  );
}
