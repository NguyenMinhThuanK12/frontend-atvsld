"use client";

import React from "react";
import { TextField, MenuItem } from "@mui/material";

interface PrimarySelectFieldProps {
  label: string | React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string | React.ReactNode;
  size?: "small" | "medium";
}

const PrimarySelectField: React.FC<PrimarySelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error = false,
  helperText = "",
  size = "medium",
}) => {
  if (!options) {
    throw new Error("Options is required for select field");
  }

  return (
    <TextField
      select
      required={required}
      label={label}
      variant="outlined"
      fullWidth
      size={size}
      value={value}
      onChange={onChange}
      disabled={disabled}
      error={error}
      helperText={helperText}
      slotProps={{
        select: {
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 200, // Giới hạn chiều cao dropdown
                overflowY: "auto", // Thêm thanh cuộn
                marginTop: 1, // Khoảng cách nhỏ giữa input và dropdown
              },
            },
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
          },
        },
      }}
      sx={{
        // marginBottom: "1.5rem",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: error ? "red" : disabled ? "#e5e7eb" : "#d1d5db",
          },
          "&:hover fieldset": {
            borderColor: error ? "red" : disabled ? "#e5e7eb" : "#9ca3af",
          },
          "&.Mui-focused fieldset": {
            borderColor: error ? "red" : disabled ? "#e5e7eb" : "#3b82f6",
          },
          "&.Mui-disabled fieldset": {
            borderColor: error ? "red" : "#e5e7eb",
          },
        },
        "& .MuiInputLabel-root": {
          color: error ? "red" : disabled ? "#D6D6D6" : "#6b7280",
          "&.Mui-disabled": {
            color: error ? "red" : "#D6D6D6",
          },
        },
        "& .MuiInputLabel-shrink": {
          transform: "translate(14px, -9px) scale(0.75)",
          color: error ? "red" : disabled ? "#9ca3af" : "#3b82f6",
        },
        "& .MuiFormHelperText-root": {
          color: error ? "red" : "#6b7280",
          marginTop: "4px",
        },
        "& .MuiInputLabel-asterisk": {
          display: "none",
        },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default PrimarySelectField;
