import React, { RefObject, useEffect, useRef, useState } from "react";
import { extractFileName } from "../../../utils/commonFunction";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Upload, Eye, Trash2 } from "lucide-react";

interface Document {
  id: number;
  title: string;
  fileName: string;
  file?: File | null;
  fileUrl?: string | null;
}

interface LicenseTableProps {
  step: number;
  businessLicenseFile?: File | string | null;
  otherDocumentFile?: File | string | null;
  onFileUpload?: (id: number, file: File | null) => void;
}

export default function LicenseTable(props: LicenseTableProps) {
  const { step, businessLicenseFile, otherDocumentFile, onFileUpload } = props;
  const [selectedFiles, setSelectedFiles] = useState<
    Record<number, File | null>
    >({});
  
  // Debugging 
  useEffect(() => {
    console.log("Selected Files:", selectedFiles);
  }
  , [selectedFiles]);

  // Notify
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
    duration?: number;
  } | null>(null);

  const showAlert = (
    content: string,
    type: "success" | "error" | "warning" | "info",
    duration = 2000
  ) => setAlert({ content, type, duration });

  const fileInputRefs = useRef<RefObject<HTMLInputElement>[]>(
    Array(2)
      .fill(0)
      .map(() => React.createRef<HTMLInputElement>())
  );

  // Initialize selected files based on props
  useEffect(() => {
    const initialFiles: Record<number, File | null> = {};
    [businessLicenseFile, otherDocumentFile].forEach((file, idx) => {
      if (file instanceof File) {
      initialFiles[idx + 1] = file;
      }
    });
    setSelectedFiles((prev) => ({ ...prev, ...initialFiles }));
  }, [businessLicenseFile, otherDocumentFile]);

  const documents: Document[] = [
    {
      id: 1,
      title: "Giấy phép kinh doanh",
      fileName: extractFileName(businessLicenseFile),
      file: businessLicenseFile instanceof File ? businessLicenseFile : null,
      fileUrl:
        typeof businessLicenseFile === "string" ? businessLicenseFile : null,
    },
    {
      id: 2,
      title: "Tài liệu khác",
      fileName: extractFileName(otherDocumentFile),
      file: otherDocumentFile instanceof File ? otherDocumentFile : null,
      fileUrl: typeof otherDocumentFile === "string" ? otherDocumentFile : null,
    },
  ];

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      showAlert("Vui lòng chọn file PDF.", "error");
      return;
    }
    setSelectedFiles((prev) => ({
      ...prev,
      [id]: file,
    }));
    onFileUpload?.(id, file);
    event.target.value = "";
  };

  const handleUploadClick = (index: number) => {
    fileInputRefs.current[index]?.current?.click();
  };

  const handleView = (file: File | null, fileUrl?: string | null) => {
    const url = file ? URL.createObjectURL(file) : fileUrl;
    if (url) {
      window.open(url, "_blank");
      return;
    }
    showAlert("Không có file để xem.", "warning");
  };

  const handleDelete = (id: number) => {
    setSelectedFiles((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    onFileUpload?.(id, null);
  };

  return (
    <div className="w-full h-full mt-6 flex flex-col items-start justify-center gap-4">
      <h2 className="text-lg text-black font-semibold">File đính kèm</h2>
      <Table
        sx={{
          width: "100%",
          borderRadius: "15px",
          overflow: "hidden",
        }}
      >
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell sx={{ color: "#637381", fontSize: "16px" }}>
              Tên file
            </TableCell>
            <TableCell
              sx={{ width: "50%", color: "#637381", fontSize: "16px" }}
            >
              Thông tin file
            </TableCell>
            <TableCell sx={{ color: "#637381", fontSize: "16px" }}>
              Thao tác
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc, index) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.title}</TableCell>
              <TableCell>
                {selectedFiles[doc.id]?.name || doc.fileName || "Không có file"}
                <input
                  type="file"
                  ref={fileInputRefs.current[index]}
                  style={{ display: "none" }}
                  accept="application/pdf"
                  onChange={(e) => handleFileUpload(e, doc.id)}
                />
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() =>
                    handleView(doc.file || selectedFiles[doc.id], doc.fileUrl)
                  }
                  aria-label="Xem"
                  disabled={!doc.file && !selectedFiles[doc.id] && !doc.fileUrl}
                >
                  <Eye />
                </IconButton>
                {step === 1 && (
                  <>
                    <IconButton
                      onClick={() => handleUploadClick(index)}
                      aria-label="Tải lên"
                    >
                      <Upload />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(doc.id)}
                      aria-label="Xóa"
                      disabled={!selectedFiles[doc.id]}
                    >
                      <Trash2 />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {alert && (
        <Alert
          content={alert.content}
          type={alert.type}
          duration={alert.duration}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
