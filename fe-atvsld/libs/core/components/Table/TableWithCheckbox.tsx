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

interface ComponentPermissionRow {
  id: string;
  funcCode: string;
  funcName: string;
}

interface GroupPermissionRow {
  id: string;
  perCode: string;
  perName: string;
  components: ComponentPermissionRow[];
}

interface CheckedState {
  [groupId: string]: {
    groupChecked: boolean;
    components: {
      [componentId: string]: boolean;
    };
  };
}

function Row(props: {
  row: GroupPermissionRow;
  checkedState: CheckedState;
  onGroupCheckboxChange: (groupId: string) => void;
  onComponentCheckboxChange: (groupId: string, componentId: string) => void;
}) {
  const {
    row,
    checkedState,
    onGroupCheckboxChange,
    onComponentCheckboxChange,
  } = props;
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determine if the group checkbox should be indeterminate
  const isIndeterminate =
    checkedState[row.id]?.components &&
    Object.values(checkedState[row.id].components).some((checked) => checked) &&
    !Object.values(checkedState[row.id].components).every((checked) => checked);

  return (
    <>
      <TableRow>
        <TableCell>
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
          <Checkbox
            color="primary"
            checked={checkedState[row.id]?.groupChecked || false}
            onChange={() => onGroupCheckboxChange(row.id)}
            indeterminate={isIndeterminate}
          />
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
                  {row.components.map((func, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ width: "100px" }}></TableCell>
                      <TableCell
                        style={{ width: "100px", paddingLeft: "1rem" }}
                      >
                        <Checkbox
                          color="primary"
                          checked={
                            checkedState[row.id]?.components[func.id] || false
                          }
                          onChange={() =>
                            onComponentCheckboxChange(row.id, func.id)
                          }
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

interface CustomizedCollapseTableWithCheckboxProps {
  rows: GroupPermissionRow[];
  permissionIds: string[];
  onComponentSelect?: (componentIds: string[]) => void;
  onGroupSelect?: (componentIds: string[]) => void;
  onFilterChange: (field: string, value: string) => void;
  filters: Record<string, string>;
}

export default function CustomizedCollapseTableWithCheckbox({
  rows,
  permissionIds,
  onComponentSelect,
  onGroupSelect,
  onFilterChange,
  filters,
}: CustomizedCollapseTableWithCheckboxProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [checkedState, setCheckedState] = useState<CheckedState>({});

  //get all checked component IDs after checkbox changes
  const getAllCheckedComponentIds = (state: CheckedState): string[] => {
    const checkedIds: string[] = [];
    rows.forEach((row) => {
      const groupState = state[row.id];
      if (groupState) {
        Object.entries(groupState.components).forEach(
          ([componentId, checked]) => {
            if (checked) {
              checkedIds.push(componentId);
            }
          }
        );
      }
    });    
    return checkedIds;
  };

  // Initialize checked state when user open modal
  useEffect(() => {
    const initialCheckedState: CheckedState = {};
    rows.forEach((row) => {
      const componentsCheckedState = row.components.reduce((acc, component) => {
        acc[component.id] = permissionIds.includes(component.id);
        return acc;
      }, {} as { [key: string]: boolean });

      const allComponentsChecked = Object.values(componentsCheckedState).every(
        (checked) => checked
      );

      initialCheckedState[row.id] = {
        groupChecked: allComponentsChecked,
        components: componentsCheckedState,
      };
    });
    setCheckedState(initialCheckedState);
  }, [permissionIds]);

  // handle group checkbox change
  const handleGroupCheckboxChange = (groupId: string) => {
    setCheckedState((prev) => {
      const groupState = prev[groupId];
      const newGroupChecked = !groupState.groupChecked;

      const newComponents = Object.keys(groupState.components).reduce(
        (acc, compId) => {
          acc[compId] = newGroupChecked;
          return acc;
        },
        {} as { [key: string]: boolean }
      );

      const updatedState = {
        ...prev,
        [groupId]: {
          groupChecked: newGroupChecked,
          components: newComponents,
        },
      };

      // Get and log all checked component IDs
      const checkedComponentIds = getAllCheckedComponentIds(updatedState);
      if (onGroupSelect) {
        onGroupSelect(checkedComponentIds);
      }

      return updatedState;
    });    
    
  };

  const handleComponentCheckboxChange = (
    groupId: string,
    componentId: string
  ) => {
    setCheckedState((prev) => {
      const groupState = prev[groupId];
      const newComponents = {
        ...groupState.components,
        [componentId]: !groupState.components[componentId],
      };
      // Check if all components are checked
      const allChecked = Object.values(newComponents).every(
        (checked) => checked
      );

      const updatedState = {
        ...prev,
        [groupId]: {
          groupChecked: allChecked,
          components: newComponents,
        },
      };

      // Get and log all checked component IDs
      const checkedComponentIds = getAllCheckedComponentIds(updatedState);
      if (onComponentSelect) {
        onComponentSelect(checkedComponentIds);
      }

      return updatedState;
    });
  };

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
              <TableCell style={{ color: "black" }}>
                <span className="text-[16px] text-black">Mã Quyền</span>
              </TableCell>
              <TableCell>
                <span className="text-[16px] text-black">Tên Quyền</span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ width: "50px" }} />
              <TableCell style={{ width: "50px" }} />
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
              <Row
                key={row.id}
                row={row}
                checkedState={checkedState}
                onGroupCheckboxChange={handleGroupCheckboxChange}
                onComponentCheckboxChange={handleComponentCheckboxChange}
              />
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
