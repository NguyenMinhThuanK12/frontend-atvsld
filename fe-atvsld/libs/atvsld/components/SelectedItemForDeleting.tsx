import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import CustomizedButton from "@/libs/core/components/Button/customizedBtn";
import ConfirmationDialog from "@/libs/core/components/Dialog/ConfirmationDialog";

interface SelectedItemForDeletingProps<T> {
  selectedRowsQuantity: number;
  onDelete?: (row: T[]) => void;
}

export default function SelectedItemForDeleting<T>({
  selectedRowsQuantity,
  onDelete = () => {},
}: SelectedItemForDeletingProps<T>) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete([]);
    setIsConfirmDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setIsConfirmDialogOpen(false);
  };

  return (
    <div
      className="container w-86 h-10 mx-auto flex items-center justify-between bg-white shadow-lg rounded-md
    transition-all duration-300 ease-in-out opacity-100 translate-y-0 animate-fade-in"
    >
      <div className="w-10 h-full bg-primary rounded-md flex items-center justify-center">
        <h5 className="text-white font-bold text-sm">{selectedRowsQuantity}</h5>
      </div>
      <h6 className="text-sm mr-8">dữ liệu đã chọn</h6>
      <div className="flex items-center justify-center gap-2 p-2 h-full w-auto">
        <CustomizedButton
          content="Xóa"
          type="button"
          size="small"
          color="red"
          icon={<Trash2 className="text-white" />}
          sx={{ minWidth: "50px", fontSize: "14px" }}
          onClick={handleDeleteClick}
        />
        <div className="flex items-center justify-center w-6 h-6 cursor-pointer">
          <X className="text-gray-500" />
        </div>
      </div>

      <ConfirmationDialog
        title="Xác nhận xóa các dữ liệu đã chọn?"
        isOpen={isConfirmDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
