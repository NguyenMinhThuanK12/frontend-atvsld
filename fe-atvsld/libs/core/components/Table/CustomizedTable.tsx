"use client";

import { toRomanNumeral } from "@/libs/atvsld/utils/commonFunction";
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";

import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CustomizedTableProps {
  rows: GroupPermissionRow[];
  onFilterChange: (field: string, value: string) => void;
  filters: Record<string, string>;
}

interface ComponentPermissionRow {
  numOrder: number;
  type: string;
  funcCode: string;
  funcName: string;
}

interface GroupPermissionRow {
  numOrder: number;
  type: string;
  perCode: string;
  perName: string;
  components: ComponentPermissionRow[];
}

function Row(props: { row: GroupPermissionRow }) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure the component only renders dynamically after mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <TableRow>
        <TableCell
          style={{
            width: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            aria-label="expand row"
            size="medium"
            onClick={() => setOpen(!open)}
          >
            {open ? <ChevronUp /> : <ChevronDown />}
          </IconButton>
        </TableCell>
        <TableCell style={{ width: "100px" }}>{toRomanNumeral(row.numOrder)}</TableCell>
        <TableCell style={{ width: "200px" }}>{row.type}</TableCell>
        <TableCell>{row.perCode}</TableCell>
        <TableCell>{row.perName}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: "0px" }} colSpan={5}>
          {isMounted && (
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table style={{ tableLayout: "fixed", width: "100%" }}>
                <TableBody>
                  {row.components.map((func, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ width: "50px" }}></TableCell>
                      <TableCell
                        style={{
                          width: "100px",
                          paddingLeft: "2.5rem",
                        }}
                      >
                        {func.numOrder}
                      </TableCell>
                      <TableCell
                        style={{ paddingLeft: "2.5rem", width: "200px" }}
                      >
                        {func.type}
                      </TableCell>
                      <TableCell style={{ paddingLeft: "3rem" }}>
                        {func.funcCode}
                      </TableCell>
                      <TableCell style={{ paddingLeft: "3rem" }}>
                        {func.funcName}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Collapse>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}

export default function CustomizedTable({ rows, onFilterChange, filters }: CustomizedTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  return (
    <Box className="w-full h-[calc(100vh-100px)] rounded-lg shadow-lg bg-white flex flex-col items-end justify-between">
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "none",
        }}
      >
        <Table style={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead sx={{ backgroundColor: "#f4f6f8" }}>
            <TableRow
              sx={{
                "&:last-child td, &:last-child th": { borderBottom: "none" },
              }}
            >
              <TableCell style={{ width: "50px" }} />
              <TableCell style={{ width: "100px", color: "black" }}>
                STT
              </TableCell>
              <TableCell style={{ width: "200px", color: "black" }}>
                Loại
              </TableCell>
              <TableCell style={{ color: "black" }}>Mã quyền</TableCell>
              <TableCell style={{ color: "black" }}>Tên quyền</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ width: "50px" }}></TableCell>
              <TableCell style={{ width: "100px", padding: "4px" }}></TableCell>
              <TableCell>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "4px",
                      outline: "none",
                      border: "none",
                    },
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={filters["permissionCode"] || ""}
                  onChange={(e) =>
                    onFilterChange("permissionCode", e.target.value)
                  }
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "white",
                      borderRadius: "4px",
                      outline: "none",
                      border: "none",
                    },
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={filters["permissionName"] || ""}
                  onChange={(e) =>
                    onFilterChange("permissionName", e.target.value)
                  }
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "white",
                      borderRadius: "4px",
                      outline: "none",
                      border: "none",
                    },
                  }}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.numOrder} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
