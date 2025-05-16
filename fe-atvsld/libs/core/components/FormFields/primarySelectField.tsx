"use client";

import React from "react";
import { TextField, MenuItem } from "@mui/material";

interface PrimarySelectFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

const PrimarySelectField: React.FC<PrimarySelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
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
      value={value}
      onChange={onChange}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#d1d5db", // border-gray-300
          },
          "&:hover fieldset": {
            borderColor: "#9ca3af", // border-gray-400
          },
          "&.Mui-focused fieldset": {
            borderColor: "#3b82f6", // focus:ring-blue-500
          },
        },
        "& .MuiInputLabel-root": {
          color: "#6b7280", // text-gray-500
        },
        "& .MuiInputLabel-shrink": {
          transform: "translate(14px, -9px) scale(0.75)", // Floating label
          color: "#3b82f6", // Blue-500 khi focus
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
