"use client";

import React from "react";
import { TextField } from "@mui/material";

interface PrimaryTextFieldProps {
  label: string | React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  className?: string;
  disabled?: boolean;
  size?: "small" | "medium";
}

const PrimaryTextField: React.FC<PrimaryTextFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error = false,
  helperText = "",
  className = "",
  disabled = false,
  size = "medium",
}) => {
  // Only allow "small" or "medium" for MUI TextField
  return (
    <TextField
      size={size}
      className={className}
      required={required}
      label={label}
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      disabled={disabled}
      sx={{
        marginBottom: "1.5rem",
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
    />
  );
};

export default PrimaryTextField;
