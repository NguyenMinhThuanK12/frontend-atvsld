"use client";

import React, { useEffect, useState } from "react";
import { Plus, Upload } from "lucide-react";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import OutlineButton from "@/libs/core/components/Button/outlineBtn";
import TextButton from "@/libs/core/components/Button/textBtn";
import { has, set } from "lodash";
import PrimarySelectField from "@/libs/core/components/FormFields/primarySelectField";

interface HeaderProps {
  onAddNewClick?: () => void;
  onUploadClick?: () => void;
  onExportClick?: () => void;
  title: string;
  creationPermission: boolean;
  hasImport?: boolean;
  hasExport?: boolean;
  hasAddNew?: boolean;
  hasSelectBox?: boolean;
  selectOptions?: { value: string; label: string }[];
  selectedValue?: string;
  onSelectChange?: (value: string, field: string) => void;
}

export default function Header({
  onAddNewClick,
  onUploadClick,
  onExportClick,
  title,
  creationPermission,
  hasImport = false,
  hasExport = false,
  hasAddNew = true,
  hasSelectBox = false,
  selectOptions = [], // Default options
  selectedValue = selectOptions.length > 0 ? selectOptions[0].value : "",
  onSelectChange = (value: string) => {
    // Handle select box change
    console.log("Selected value:", value);
  },
}: HeaderProps) {


  return (
    <header className="h-16 left-80 ml-2 fixed top-2 right-2 z-40 bg-white flex items-center justify-between px-4 shadow-lg rounded-lg">
      <h1 className=" text-gray-800 font-semibold text-2xl">{title}</h1>
      {creationPermission && (
        <div className="min-w-[400px] h-full flex items-center justify-end space-x-4">
          {hasExport && (
            <TextButton
              content="Xuất danh sách"
              type="button"
              sx={{ minWidth: "140px", height: "40px" }}
              onClick={onExportClick}
            />
          )}

          {hasImport && (
            <OutlineButton
              content="Thêm từ file"
              type="button"
              icon={<Upload className="h-4 w-4" />}
              sx={{ minWidth: "140px", height: "40px" }}
              onClick={onUploadClick}
            />
          )}

          {hasAddNew && (
            <PrimaryButton
              content="Thêm mới"
              type="button"
              icon={<Plus className="h-4 w-4" />}
              sx={{ minWidth: "140px", height: "40px" }}
              onClick={onAddNewClick}
            />
          )}
        </div>
      )}
      {hasSelectBox && (
        <div className="min-w-[100px] h-10 flex items-center justify-end">
          <PrimarySelectField
            label=""
            options={selectOptions}
            value={selectedValue}
            onChange={(e) => onSelectChange("year", e.target.value)}
            size="small"
          />
        </div>
      )}
    </header>
  );
}
