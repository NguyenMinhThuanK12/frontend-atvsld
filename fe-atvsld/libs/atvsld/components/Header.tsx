'use client';

import React, { useState } from 'react'
import { Plus, Upload } from 'lucide-react';
import PrimaryButton from '@/libs/core/components/Button/primaryBtn';
import OutlineButton from '@/libs/core/components/Button/outlineBtn';
import TextButton from '@/libs/core/components/Button/textBtn';
import { set } from 'lodash';

interface HeaderProps {
  onAddNewClick: () => void;
  onUploadClick: () => void;
  onExportClick: () => void;
}


export default function Header({ onAddNewClick, onUploadClick, onExportClick }: HeaderProps) {
  return (
    <header className="h-16 left-80 ml-2 fixed top-2 right-2 z-40 bg-white flex items-center justify-between px-4 shadow-lg rounded-lg">
      <h1 className=" text-gray-800 font-semibold text-2xl">
        Danh sách doanh nghiệp
      </h1>
      <div className="min-w-[400px] h-full flex items-center justify-between space-x-4">
        <TextButton
          content="Xuất danh sách"
          type="button"
          sx={{ minWidth: "140px", height: "40px" }}
          onClick={onExportClick}
        />

        <OutlineButton
          content="Thêm từ file"
          type="button"
          icon={<Upload className="h-4 w-4" />}
          sx={{ minWidth: "140px", height: "40px" }}
          onClick={onUploadClick}
        />

        <PrimaryButton
          content="Thêm mới"
          type="button"
          icon={<Plus className="h-4 w-4" />}
          sx={{ minWidth: "140px", height: "40px" }}
          onClick={onAddNewClick}
        />
      </div>
    </header>
  );
}
