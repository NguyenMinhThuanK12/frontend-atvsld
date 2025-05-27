import React from "react";
import { X } from "lucide-react";
import CustomizedButton from "@/libs/core/components/Button/customizedBtn";

interface ConfirmationDialogProps {
  title: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 mb-96 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <p className="mb-4 text-lg">{title}</p>
        <div className="flex gap-4">
          <CustomizedButton
            content="Đồng ý"
            type="button"
            size="small"
            color="green"
            onClick={onConfirm}
          />
          <CustomizedButton
            content="Hủy"
            type="button"
            size="small"
            color="gray"
            onClick={onCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
