"use client";

import React from "react";
import { TextField } from "@mui/material";

interface PrimaryTextFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
}

const PrimaryTextField: React.FC<PrimaryTextFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error = false,
}) => {
  return (
    <TextField
      required={required}
      label={label}
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      sx={{
        marginBottom: "1.5rem",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: error ? "red" : "#d1d5db",
          },
          "&:hover fieldset": {
            borderColor: error ? "red" : "#9ca3af",
          },
          "&.Mui-focused fieldset": {
            borderColor: error ? "red" : "#3b82f6",
          },
        },
        "& .MuiInputLabel-root": {
          color: error ? "red" : "#6b7280",
        },
        "& .MuiInputLabel-shrink": {
          transform: "translate(14px, -9px) scale(0.75)",
          color: error ? "red" : "#3b82f6",
        },
        "& .MuiInputLabel-asterisk": {
          display: "none",
        },
      }}
    />
  );
};

export default PrimaryTextField;
