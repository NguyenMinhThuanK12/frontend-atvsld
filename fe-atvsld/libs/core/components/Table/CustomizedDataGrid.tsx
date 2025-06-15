"use client";

import SelectedItemForDeleting from "@/libs/atvsld/components/SelectedItemForDeleting";
import {
  Box,
  FormControlLabel,
  MenuItem,
  MenuProps,
  Select,
  Switch,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Eye, KeyRound, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import ConfirmationDialog from "../Dialog/ConfirmationDialog";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";
import PrimaryDatePicker from "../DatePicker/PrimaryDatePicker";

export interface ColumnConfig {
  field: string;
  headerName: string;
  inputType?: "text" | "select" | "date";
  options?: { value: string; label: string | undefined }[];
  flex?: number;
  minWidth?: number;
}

interface CustomDataGridProps<T> {
  rows: T[];
  columnsConfig: ColumnConfig[];
  onRowSelectionChange?: (selectedRows: T[]) => void;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  onStatusChange?: (rowId: string, newStatus: boolean) => void;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (rows: T[]) => void;
  onFilterChange: (field: string, value: string) => void;
  filters?: Record<string, string>;
  hasStatus?: boolean;
  hasView?: boolean;
  hasEdit?: boolean;
  hasDelete?: boolean;
  hasResetPassword?: boolean;
  onResetPassword?: (rowId: string) => void;
}

export default function CustomizedDataGrid<
  T extends { id: string; isActive?: boolean }
>({
  rows,
  columnsConfig,
  onRowSelectionChange,
  onStatusChange,
  onView,
  onEdit,
  onDelete,
  onFilterChange,
  filters = {},
  pageSizeOptions = [5, 10, 15, 20],
  initialPageSize = 5,
  hasStatus = true,
  hasView = true,
  hasEdit = true,
  hasDelete = true,
  hasResetPassword = false,
  onResetPassword,
}: CustomDataGridProps<T>) {
  // console.log("Rendering CustomizedDataGrid with rows:", rows);

  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [isDeleted, setIsDeleted] = useState(false);

  // Handle row selection
  const handleRowSelection = (selectionModel: GridRowSelectionModel) => {
    if (!onRowSelectionChange) return;

    const selectedIds = Array.from(selectionModel.ids) as string[];
    const selectedData = rows.filter((row) => selectedIds.includes(row.id));
    setSelectedRows(selectedData);
    setIsDeleted(true);
    onRowSelectionChange(selectedData);
  };

  const menuProps: Partial<MenuProps> = {
    PaperProps: {
      style: {
        maxHeight: 350,
        overflowY: "auto",
      },
    },
  };

  const statusOptions = [
    { value: "", label: "Tất cả" },
    { value: "true", label: "Hoạt động" },
    { value: "false", label: "Không hoạt động" },
  ];

  const columns: GridColDef[] = [
    ...columnsConfig.map((col) => ({
      field: col.field,
      headerName: col.headerName,
      flex: col.flex ?? 1,
      minWidth: col.minWidth ?? 120,
      editable: false,
      renderHeader: () => (
        <div className="flex flex-col gap-2 w-full" style={{ padding: "8px" }}>
          <span className="text-[#637381] font-bold text-sm w-full">
            {col.headerName}
          </span>
          {col.inputType === "text" && (
            <TextField
              className="w-full bg-white"
              variant="outlined"
              size="small"
              fullWidth
              value={filters[col.field] || ""}
              onChange={(e) => onFilterChange(col.field, e.target.value)}
              sx={{ fontSize: 14, minHeight: 36 }}
            />
          )}
          {col.inputType === "select" && col.options && (
            <FormControl fullWidth size="small">
              <Select
                className="w-full bg-white"
                variant="outlined"
                onChange={(e) => onFilterChange(col.field, e.target.value)}
                value={
                  filters[col.field] ||
                  (col.options && col.options.length > 0
                    ? col.options[0].value
                    : "")
                }
                sx={{ fontSize: 14, minHeight: 36 }}
                MenuProps={menuProps}
                disabled={
                  col.field === "ward" &&
                  (!filters["district"] || filters["district"] === "Tất cả")
                }
                aria-label={`Header select for ${col.field}`}
              >
                {col.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {col.inputType === "date" && (

            <PrimaryDatePicker
              label=""
              value={filters[col.field] ? new Date(filters[col.field]) : null}
              onChange={(date) =>
                onFilterChange(
                  col.field,
                  date ? date.toISOString().slice(0, 10) : ""
                )
              }
              slotProps={{
                textField: {
                  variant: "outlined",
                  size: "small",
                  fullWidth: true,
                  className: "w-full bg-white",
                  sx: { fontSize: 14, minHeight: 36 },
                },
              }}
            />
          )}
        </div>
      ),
    })),
    ...(hasStatus
      ? [
          {
            field: "status",
            headerName: "Trạng Thái",
            flex: 0.5,
            minWidth: 100,
            editable: false,
            headerAlign: "left",
            renderHeader: () => (
              <div className="flex flex-col gap-2 w-full">
                <span className="text-[#637381] font-bold w-full text-sm">
                  Trạng Thái
                </span>
                <FormControl fullWidth size="small">
                  {/* <InputLabel>{col.headerName}</InputLabel> */}
                  <Select
                    className="w-full bg-white"
                    variant="outlined"
                    sx={{ fontSize: 14, minHeight: 36 }}
                    MenuProps={menuProps}
                    value={filters["isActive"] ?? ""} // Controlled by filters prop
                    onChange={(e) => {
                      onFilterChange("isActive", e.target.value);
                    }}
                    aria-label={`Header select for Status`}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.label} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            ),
            renderCell: (params) => (
              <div className="flex items-center justify-center w-full">
                <FormControlLabel
                  control={
                    <Switch
                      checked={params.row.isActive ?? false}
                      onChange={() =>
                        onOpenStatusDialog(
                          params.row.id,
                          params.row.isActive ?? false
                        )
                      }
                      name="status"
                    />
                  }
                  label=""
                  sx={{ margin: 0 }}
                />
              </div>
            ),
          } as GridColDef,
        ]
      : []),
    ...(hasView || hasEdit
      ? [
          {
            field: "action",
            headerName: "Thao tác",
            type: "actions",
            flex: 0.3,
            minWidth: 90,
            editable: false,
            renderHeader: () => (
              <div
                className="flex flex-col gap-2 w-full"
                style={{ padding: "8px" }}
              >
                <span className="text-[#637381] font-bold w-full mb-[2.75rem] text-sm flex items-center justify-center">
                  Thao tác
                </span>
              </div>
            ),
            renderCell: (params) => (
              <div className="flex w-full gap-2 items-center justify-center">
                {hasView && (
                  <button
                    onClick={() => onView?.(params.row)}
                    title="Xem chi tiết"
                    aria-label="Xem chi tiết"
                  >
                    <Eye size={20} />
                  </button>
                )}
                {hasEdit && (
                  <button
                    onClick={() => onEdit?.(params.row)}
                    title="Chỉnh sửa"
                    aria-label="Chỉnh sửa"
                  >
                    <Pencil size={20} />
                  </button>
                )}
                {hasResetPassword && (
                  <button
                    title="Đặt lại mật khẩu"
                    aria-label="Đặt lại mật khẩu"
                    onClick={() => onResetPassword?.(params.row.id)}
                  >
                    <KeyRound size={20} />
                  </button>
                )}
              </div>
            ),
          } as GridColDef,
        ]
      : []),
  ];

  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }>({
    title: "",
    isOpen: false,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const onOpenDeleteDialog = () => {
    setConfirmDialog({
      title: "Xác nhận xóa các dữ liệu đã chọn?",
      isOpen: true,
      onConfirm: () => {
        if (onDelete) {
          onDelete(selectedRows);
        }
        setSelectedRows([]);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Handle toggle status
  const onOpenStatusDialog = (rowId: string, isBanned: boolean) => {
    setConfirmDialog({
      title: isBanned
        ? "Xác nhận chặn đối tượng này ?"
        : "Xác nhận bỏ chặn đối tượng này ?",
      isOpen: true,
      onConfirm: () => {
        if (onStatusChange) {
          onStatusChange(rowId, !isBanned);
        }
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="container w-full flex flex-col items-center justify-between h-full mt-5">
      <Box
        sx={{
          height: "calc(100vh - 180px)",
          width: "100%",
          "& .MuiDataGrid-cell": {
            padding: "14px 0px",
          },
          "& .MuiDataGrid-columnHeaders": {
            // backgroundColor: "#f4f6f8",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#f4f6f8",
            cursor: "default",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            color: "#637381",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-columnSeparator": {
            visibility: "hidden",
          },
          "& .MuiDataGrid-filler": {
            display: "none",
          },
          "& .MuiDataGrid-cellEmpty": {
            display: "none",
          },
          "& .MuiDataGrid-columnHeaderTitleContainerContent .MuiCheckbox-root":
            {
              marginBottom: "3rem",
            },
          "& .MuiDataGrid-row .MuiDataGrid-cell": {
            padding: "14px 0px",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
          },
          "& .MuiDataGrid-cell:not(.MuiDataGrid-cellCheckbox)": {
            paddingLeft: "18px",
          },
          "& .MuiDataGrid-columnHeaderTitleContainerContent": {
            width: "100%",
          },
        }}
      >
        <DataGrid
          className="w-full"
          slots={{
            noRowsOverlay: () => (
              <div
                className="flex items-center justify-center w-full h-full"
                role="alert"
                aria-label="No data available"
              >
                <span className="text-gray-500 text-2xl font-bold">
                  Không có dữ liệu
                </span>
              </div>
            ),
          }}
          slotProps={{
            loadingOverlay: {
              variant: "linear-progress",
              noRowsVariant: "linear-progress",
            },
          }}
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          columnHeaderHeight={100}
          getRowHeight={() => "auto"}
          getEstimatedRowHeight={() => 200}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: initialPageSize,
              },
            },
          }}
          pageSizeOptions={pageSizeOptions}
          checkboxSelection={hasDelete}
          disableRowSelectionOnClick
          disableColumnResize
          disableColumnMenu
          disableColumnFilter
          disableColumnSorting
          disableAutosize
          onRowSelectionModelChange={handleRowSelection}
        />
      </Box>

      {hasDelete && selectedRows.length > 0 && isDeleted && (
        <SelectedItemForDeleting
          selectedRowsQuantity={selectedRows.length}
          onOpenDeleteDialog={onOpenDeleteDialog}
          onClose={() => {
            setIsDeleted(false);
          }}
        />
      )}

      <ConfirmationDialog
        title={confirmDialog.title}
        isOpen={confirmDialog.isOpen}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
      />
    </div>
  );
}
