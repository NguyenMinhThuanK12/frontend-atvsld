import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Upload, Eye, Trash2 } from "lucide-react";
import React, { useState, useRef, RefObject } from "react";

interface LicenseTableProps {
  step: number;
  businessLicenseFile?: File | string | null;
  otherDocumentFile?: File | string | null;
  onFileUpload?: (id: number, file: File | null) => void;
}

interface Document {
  id: number;
  title: string;
  fileName: string;
  file?: File | null;
  fileUrl?: string | null;
}

const LicenseTable: React.FC<LicenseTableProps> = ({
  step,
  businessLicenseFile,
  otherDocumentFile,
  onFileUpload,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<
    Record<number, File | null>
  >({});
  const [savedFiles, setSavedFiles] = useState<Record<number, boolean>>({});

  const extractFileName = (file?: File | string | null) => {
    if (!file) return "";
    if (file instanceof File) {
      return file.name;
    }
    const parts = file.split("/");
    let fileName = parts[parts.length - 1] || "";
    const uuidPattern =
      /-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
    fileName = fileName.replace(uuidPattern, "");
    const nameParts = fileName.split("pdf");
    return nameParts[0].trim() + ".pdf";
  };

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

  const fileInputRefs = useRef<RefObject<HTMLInputElement>[]>(
    Array(2)
      .fill(0)
      .map(() => React.createRef<HTMLInputElement>())
  );

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFiles((prev) => ({
        ...prev,
        [id]: file,
      }));
      if (onFileUpload) {
        onFileUpload(id, file);
      }
      event.target.value = "";
    } else {
      alert("Vui lòng chọn file PDF.");
    }
  };

  const handleUploadClick = (id: number, index: number) => {
    const fileInput = fileInputRefs.current[index].current;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleView = (file: File | null, fileUrl?: string | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      window.open(url, "_blank");
    } else if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      alert("Không có file để xem.");
    }
  };

  const handleDelete = (id: number) => {
    setSelectedFiles((prev) => {
      const updatedFiles = { ...prev };
      delete updatedFiles[id];
      return updatedFiles;
    });
    setSavedFiles((prev) => {
      const updatedSaved = { ...prev };
      delete updatedSaved[id];
      return updatedSaved;
    });
    if (onFileUpload) {
      onFileUpload(id, null);
    }
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
                  onClick={() => handleView(selectedFiles[doc.id], doc.fileUrl)}
                  aria-label="Xem"
                  disabled={!selectedFiles[doc.id] && !doc.fileUrl}
                >
                  <Eye />
                </IconButton>
                {step === 1 && (
                  <>
                    <IconButton
                      onClick={() => handleUploadClick(doc.id, index)}
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
    </div>
  );
};

export default LicenseTable;
