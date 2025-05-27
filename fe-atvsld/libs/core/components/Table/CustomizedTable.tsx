"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  Switch,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from "@mui/material";
import { Eye, Pencil } from "lucide-react";
import { useState } from "react";
import SelectedItemForDeleting from "@/libs/atvsld/components/SelectedItemForDeleting";

export interface ColumnConfig {
  field: string;
  headerName: string;
  inputType?: "text" | "select";
  options?: { key: string; value: string }[];
  flex?: number;
  minWidth?: number;
}

interface CustomTableProps<T> {
  rows: T[];
  columnsConfig: ColumnConfig[];
  onRowSelectionChange?: (selectedRows: T[]) => void;
  onStatusChange?: (rowId: string, newStatus: boolean) => void;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (rows: T[]) => void;
  onFilterChange?: (field: string, value: string) => void;
  filters?: Record<string, string>;
}

export default function CustomizedTable<T extends { id: string; isActive?: boolean }>({
  rows,
  columnsConfig,
  onRowSelectionChange,
  onStatusChange,
  onView,
  onEdit,
  onDelete,
  onFilterChange,
  filters = {},
}: CustomTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  // Handle row selection
  const handleRowSelection = (row: T, checked: boolean) => {
    const newSelectedRows = checked
      ? [...selectedRows, row]
      : selectedRows.filter((r) => r.id !== row.id);
    setSelectedRows(newSelectedRows);
    onRowSelectionChange?.(newSelectedRows);
  };

  // Handle toggle status
  const handleStatusToggle = (rowId: string, currentStatus: boolean) => {
    onStatusChange?.(rowId, !currentStatus);
  };

  return (
    <div className="container w-full flex flex-col items-center justify-between h-full mt-5">
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 500,
          width: "100%",
          "& .MuiTableCell-root": {
            padding: "14px 0px",
          },
          "& .MuiTableCell-head": {
            backgroundColor: "#f4f6f8",
            color: "#637381",
            fontWeight: "bold",
            fontSize: "0.875rem",
          },
          "& .MuiTableCell-body": {
            paddingLeft: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
          },
        }}
      >
        <Table stickyHeader aria-label="custom table">
          <TableHead>
            <TableRow>
              {/* Checkbox column */}
              <TableCell sx={{ width: 50 }}>
                <Checkbox
                  checked={
                    selectedRows.length === rows.length && rows.length > 0
                  }
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const newSelectedRows = checked ? [...rows] : [];
                    setSelectedRows(newSelectedRows);
                    onRowSelectionChange?.(newSelectedRows);
                  }}
                  aria-label="Select all rows"
                />
              </TableCell>
              {/* Data columns */}
              {columnsConfig.map((col) => (
                <TableCell
                  key={col.field}
                  sx={{
                    minWidth: col.minWidth ?? 120,
                    width: col.flex ? `${col.flex * 100}px` : undefined,
                  }}
                >
                  <div className="flex flex-col gap-2 w-40">
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
                        onChange={(e) =>
                          onFilterChange?.(col.field, e.target.value)
                        }
                        value={filters[col.field] || ""}
                        aria-label={`Filter input for ${col.headerName}`}
                      />
                    ) : col.inputType === "select" && col.options ? (
                      <FormControl fullWidth size="small">
                        <Select
                          className="w-full bg-white"
                          variant="outlined"
                          onChange={(e) =>
                            onFilterChange?.(col.field, e.target.value)
                          }
                          value={filters[col.field] || ""}
                          sx={{ fontSize: 14, minHeight: 36 }}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 350,
                                overflowY: "auto",
                              },
                            },
                          }}
                          disabled={
                            col.field === "ward" && !filters["district"]
                          }
                          aria-label={`Filter select for ${col.headerName}`}
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
                </TableCell>
              ))}
              {/* Status column */}
              <TableCell sx={{ width: 100 }}>
                <span className="text-[#637381] font-bold text-sm">
                  Trạng Thái
                </span>
              </TableCell>
              {/* Action column */}
              <TableCell sx={{ width: 90 }}>
                <span className="text-[#637381] font-bold text-sm">
                  Thao tác
                </span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnsConfig.length + 3} align="center">
                  <span className="text-gray-500 text-2xl font-bold">
                    Không có dữ liệu
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {/* Checkbox */}
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.some((r) => r.id === row.id)}
                      onChange={(e) =>
                        handleRowSelection(row, e.target.checked)
                      }
                      aria-label={`Select row ${row.id}`}
                    />
                  </TableCell>
                  {/* Data cells */}
                  {columnsConfig.map((col) => (
                    <TableCell key={col.field}>
                      {row[col.field as keyof T] as string}
                    </TableCell>
                  ))}
                  {/* Status cell */}
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={row.isActive ?? false}
                          onChange={() =>
                            handleStatusToggle(row.id, row.isActive ?? false)
                          }
                          name="status"
                        />
                      }
                      label=""
                      sx={{ margin: 0 }}
                    />
                  </TableCell>
                  {/* Action cell */}
                  <TableCell>
                    <div className="flex gap-2 items-center justify-center">
                      <button
                        onClick={() => onView?.(row)}
                        title="Xem chi tiết"
                        aria-label="Xem chi tiết"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => onEdit?.(row)}
                        title="Chỉnh sửa"
                        aria-label="Chỉnh sửa"
                      >
                        <Pencil size={20} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedRows.length > 0 && (
        <SelectedItemForDeleting
          selectedRowsQuantity={selectedRows.length}
          onDelete={() => onDelete?.(selectedRows)}
        />
      )}
    </div>
  );
}