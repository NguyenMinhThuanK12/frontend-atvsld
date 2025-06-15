"use client";

import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FormControl, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";

interface PrimaryDatePickerProps {
  label: string | React.ReactNode;
  value: Date | null;
  onChange: (date: Date | null) => void;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  className?: string;
  disabled?: boolean;
  size?: "small" | "medium";
  slotProps?: {};
  views?: ("year" | "day" | "month")[];
  format?: string;
}

const PrimaryDatePicker: React.FC<PrimaryDatePickerProps> = ({
  label,
  value,
  onChange,
  required = false,
  error = false,
  helperText = "",
  className = "",
  disabled = false,
  size = "medium",
  slotProps = {},
  views = ["year", "day", "month"],
  format = "dd/MM/yyyy", // Default format, can be customized
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <FormControl fullWidth error={error} className={className}>
        <DatePicker
          label={label}
          value={value}
          onChange={onChange}
          disabled={disabled}
          format={format}
          views={views}
          slotProps={{
            textField: {
              size,
              required,
              error,
              variant: "outlined",
              ...slotProps,
              sx: {
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: error
                      ? "red"
                      : disabled
                      ? "#e5e7eb"
                      : "#d1d5db",
                  },
                  "&:hover fieldset": {
                    borderColor: error
                      ? "red"
                      : disabled
                      ? "#e5e7eb"
                      : "#9ca3af",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: error
                      ? "red"
                      : disabled
                      ? "#e5e7eb"
                      : "#3b82f6",
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
                "& .MuiInputLabel-asterisk": {
                  display: "none",
                },
              },
            },
            ...slotProps,
          }}
        />
        {helperText && (
          <Box
            mt={1}
            color={error ? "error.main" : "#6b7280"}
            fontSize={12}
            sx={{
              "&.MuiFormHelperText-root": {
                color: error ? "red" : "#6b7280",
                marginTop: "4px",
              },
            }}
          >
            {helperText}
          </Box>
        )}
      </FormControl>
    </LocalizationProvider>
  );
};

export default PrimaryDatePicker;
