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
import { Eye, Pencil } from "lucide-react";
import { useState } from "react";

export interface ColumnConfig {
  field: string;
  headerName: string;
  inputType?: "text" | "select";
  options?: { key: string; value: string }[];
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
  onFilterChange?: (field: string, value: string) => void;
  filters?: Record<string, string>;
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
  pageSizeOptions = [1, 2, 3, 4, 5],
  initialPageSize = 5,
}: CustomDataGridProps<T>) {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  // Handle row selection
  const handleRowSelection = (selectionModel: GridRowSelectionModel) => {
    if (!onRowSelectionChange) return;

    const selectedIds = Array.from(selectionModel.ids) as string[];
    const selectedData = rows.filter((row) => selectedIds.includes(row.id));
    setSelectedRows(selectedData);
    onRowSelectionChange(selectedData);
  };

  // Handle toggle status
  const handleStatusToggle = (rowId: string, currentStatus: boolean) => {
    if (onStatusChange) {
      onStatusChange(rowId, !currentStatus);
    }
  };

  const menuProps: Partial<MenuProps> = {
    PaperProps: {
      style: {
        maxHeight: 350,
        overflowY: "auto",
      },
    },
  };

  const [selectValues, setSelectValues] = useState<Record<string, string>>({});
  const handleSelectChange = (field: string, value: string) => {
    setSelectValues((prev) => ({ ...prev, [field]: value }));
  };

  const columns: GridColDef[] = [
    ...columnsConfig.map((col) => ({
      field: col.field,
      headerName: col.headerName,
      flex: col.flex ?? 1,
      minWidth: col.minWidth ?? 120,
      editable: false,
      renderHeader: () => (
        <div className="flex flex-col gap-2 w-40" style={{ padding: "8px" }}>
          <span className="text-[#637381] font-bold text-sm w-full">
            {col.headerName}
          </span>
          {col.inputType === "text" ? (
            <TextField
              className="w-full bg-white"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ fontSize: 14, minHeight: 36 }}
              //   aria-label={`Header input for ${col.field}`}
            />
          ) : col.inputType === "select" && col.options ? (
            <FormControl fullWidth size="small">
              {/* <InputLabel>{col.headerName}</InputLabel> */}
              <Select
                className="w-full bg-white"
                variant="outlined"
                onChange={(e) => onFilterChange?.(col.field, e.target.value)}
                value={filters[col.field] || ""}
                sx={{ fontSize: 14, minHeight: 36 }}
                MenuProps={menuProps}
                disabled={col.field === "ward" && !filters["district"]}
                // aria-label={`Header select for ${col.field}`}
              >
                {col.options.map((option) => (
                  <MenuItem key={option.key} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}
        </div>
      ),
    })),
    {
      field: "status",
      headerName: "Trạng Thái",
      flex: 0.3,
      minWidth: 100,
      editable: false,
      headerAlign: "left",
      renderHeader: () => (
        <div className="flex flex-col gap-2 w-full" style={{ padding: "8px" }}>
          <span className="text-[#637381] font-bold w-full mb-[2.75rem] text-sm">
            Trạng Thái
          </span>
        </div>
      ),
      renderCell: (params) => (
        <div className="flex items-center justify-center w-full">
          <FormControlLabel
            control={
              <Switch
                checked={params.row.isActive ?? false}
                onChange={() =>
                  handleStatusToggle(
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
    },
    {
      field: "action",
      headerName: "Thao tác",
      type: "actions",
      flex: 0.3,
      minWidth: 90,
      editable: false,
      renderHeader: () => (
        <div className="flex flex-col gap-2 w-full" style={{ padding: "8px" }}>
          <span className="text-[#637381] font-bold w-full  mb-[2.75rem] text-sm">
            Thao tác
          </span>
        </div>
      ),
      renderCell: (params) => (
        <div className="flex w-full gap-2 items-center justify-center">
          <button
            onClick={() => onView?.(params.row)}
            title="Xem chi tiết"
            aria-label="Xem chi tiết"
          >
            <Eye size={20} />
          </button>
          <button
            onClick={() => onEdit?.(params.row)}
            title="Chỉnh sửa"
            aria-label="Chỉnh sửa"
          >
            <Pencil size={20} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container w-full flex flex-col items-center justify-between h-full mt-5">
      <Box
        sx={{
          height: 500,
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
          "& .MuiDataGrid-columnHeaderTitleContainerContent .MuiCheckbox-root": {
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
          }
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
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnResize
          disableColumnMenu
          disableColumnFilter
          disableColumnSorting
          disableAutosize
          onRowSelectionModelChange={handleRowSelection}
        />
      </Box>

      {selectedRows.length > 0 && (
        <SelectedItemForDeleting selectedRowsQuantity={selectedRows.length} onDelete={onDelete} />
      )}
    </div>
  );
}
