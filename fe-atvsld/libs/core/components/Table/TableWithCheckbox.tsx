"use client";

import {
  Box,
  Checkbox,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";

import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";

function createData(
  perCode: string,
  perName: string
) {
  return {
    perCode,
    perName,
    functions: [
      {
        numOrder: 1,
        type: "Component",
        funcCode: "FUNC001",
        funcName: "Thêm mới",
      },
      {
        numOrder: 2,
        type: "Component",
        funcCode: "FUNC002",
        funcName: "Cập nhật",
      },
      {
        numOrder: 3,
        type: "Component",
        funcCode: "FUNC003",
        funcName: "Xoá",
      },
      {
        numOrder: 4,
        type: "Component",
        funcCode: "FUNC004",
        funcName: "Xem chi tiết",
      },
    ],
  };
}

type FunctionType = {
  numOrder: number;
  type: string;
  funcCode: string;
  funcName: string;
};

function Row(props: { row: ReturnType<typeof createData> }) {
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
        >
          <IconButton
            // className="h-full w-full"
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{
              padding: "6px",
            }}
          >
            {open ? <ChevronUp /> : <ChevronDown />}
          </IconButton>
        </TableCell>
        <TableCell
          style={{
            width: "100%",
            // borderBottom: "1px solid red",
          }}
        >
          <Checkbox color="primary" checked={false} onChange={() => {}} />
        </TableCell>
        <TableCell style={{ borderTop: "1px solid green" }}>
          {row.perCode}
        </TableCell>
        <TableCell>{row.perName}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: "0px" }} colSpan={4}>
          {isMounted && (
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table style={{ tableLayout: "fixed", width: "100%" }}>
                <TableBody>
                  {(row.functions as FunctionType[]).map((func, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ width: "100px" }}></TableCell>
                      <TableCell
                        style={{ width: "100px", paddingLeft: "1rem" }}
                      >
                        <Checkbox
                          color="primary"
                          checked={false}
                          onChange={() => {}}
                        />
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

const rows = [
  createData( "PER001", "Nhóm doanh nghiệp"),
  createData("PER002", "Nhóm người dùng"),
  createData("PER003", "Nhóm quyền"),
];

export default function CustomizedTable() {
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
    <Box className="w-full h-full rounded-lg shadow-lg bg-white flex flex-col items-end justify-between">
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
              <TableCell style={{ width: "100px" }} />
              <TableCell style={{ width: "100px" }} />
              <TableCell style={{ color: "black" }}>Mã quyền</TableCell>
              <TableCell style={{ color: "black" }}>Tên quyền</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ width: "50px" }} />
              <TableCell style={{ width: "50px" }} />
              <TableCell>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "white",
                      borderRadius: "4px",
                      outline: "none",
                      // border: "none",
                    },
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
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
              <Row key={row.perCode} row={row} />
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
