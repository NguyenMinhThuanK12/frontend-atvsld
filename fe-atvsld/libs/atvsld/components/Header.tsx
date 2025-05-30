"use client";

import React, { useState } from "react";
import { Plus, Upload } from "lucide-react";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import OutlineButton from "@/libs/core/components/Button/outlineBtn";
import TextButton from "@/libs/core/components/Button/textBtn";
import { has, set } from "lodash";

interface HeaderProps {
  onAddNewClick?: () => void;
  onUploadClick?: () => void;
  onExportClick?: () => void;
  title: string;
  creationPermission: boolean;
  hasImport?: boolean;
  hasExport?: boolean;
  hasAddNew?: boolean;
}

export default function Header({
  onAddNewClick,
  onUploadClick,
  onExportClick,
  title,
  creationPermission,
  hasImport = false,
  hasExport = false,
  hasAddNew = false,
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
    </header>
  );
}
