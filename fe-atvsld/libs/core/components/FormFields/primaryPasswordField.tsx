"use client";

import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface PrimaryPasswordFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
}

const PrimaryPasswordField: React.FC<PrimaryPasswordFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <FormControl
      variant="outlined"
      fullWidth
      sx={{
        marginBottom: "1.5rem",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: error ? "red" : "#d1d5db", // border-gray-300
          },
          "&:hover fieldset": {
            borderColor: error ? "red" : "#9ca3af", // border-gray-400
          },
          "&.Mui-focused fieldset": {
            borderColor: error ? "red" : "#3b82f6", // focus:ring-blue-500
          },
        },
        "& .MuiInputLabel-root": {
          color: error ? "red" : "#6b7280", // text-gray-500
        },
        "& .MuiInputLabel-shrink": {
          transform: "translate(14px, -9px) scale(0.75)", // Floating label
          color: error ? "red" : "#3b82f6", // Blue-500 khi focus
        },
        "& .MuiInputLabel-asterisk": {
          display: "none", // Ẩn dấu *
        },
      }}
    >
      <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={
                showPassword ? "hide the password" : "display the password"
              }
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
    </FormControl>
  );
};

export default PrimaryPasswordField;
