"use client";
import PrimaryButton from "@/libs/core/components/Button/primaryBtn";
import PrimaryTextField from "@/libs/core/components/FormFields/primaryTextInput";
import CustomizedTable from "@/libs/core/components/Table/TableWithCheckbox";
import { Divider } from "@mui/material";
import { X } from "lucide-react";
import { NextPage } from "next";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export const RoleDetail: NextPage = () => {
  const pageType = useParams();
  const [id, setId] = React.useState<string>("");
  const isView = pageType?.pageType === " view";
  const isUpdate = pageType?.pageType === "update";
  const isCreate = pageType?.pageType === "create";
  const query = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const id = query.get("id");
    if (id) {
      setId(id);
    }
  }, []);

  useEffect(() => {
    if (isView || isUpdate) {
      // Fetch role details by id
      getDetail(id);
    }
  }, [id]);

  const getDetail = (id: string) => {
    // Function to fetch role details by id
    console.log(`Fetching details for role with id: ${id}`);
    // Here you would typically make an API call to fetch the role details
  };

  const renderLabelWithAsterisk = (label: string, required: boolean) => (
    <span>
      {label}
      {required && <span style={{ color: "red" }}> *</span>}
    </span>
  );

  return (
    <div className="w-full h-full container mx-auto px-4 py-4">
      <div className="flex flex-col items-start justify-between w-full h-full bg-white rounded-lg">
        <div className="flex items-center justify-between w-full px-4 pt-2">
          <h1 className="text-black font-semibold text-2xl">
            {isCreate ? "Thêm mới vai trò" : "Chỉnh sửa vai trò"}
          </h1>
          <button className="p-2 flex items-center justify-center cursor-pointe hover:bg-gray-50 rounded-full">
            <X
              className="w-5 h-5"
              onClick={(e) => {
                e.preventDefault();
                router.push("/dashboard/roles");
              }}
            />
          </button>
        </div>
        <Divider
          sx={{
            my: 1, // Margin top and bottom for spacing
            borderColor: "#e6e6e6", // Make the divider black for visibility
            borderBottomWidth: 2, // Increase thickness for better visibility
            mx: "auto", // Center the divider (optional, since variant="middle" already adds margins)
            width: "97%", // Ensure the divider has a defined width to see the "middle" effect
          }}
        />
        <div className="flex items-center justify-between w-full px-4 space-x-[12rem] mt-2">
          <PrimaryTextField
            label={renderLabelWithAsterisk("Mã vai trò", true)}
            className="w-full"
          />

          <PrimaryTextField
            label={renderLabelWithAsterisk("Tên vai trò", true)}
            className="w-full"
          />
        </div>
        <div className="w-full h-full overflow-auto flex flex-col items-start justify-start p-4">
          <CustomizedTable />
        </div>
        <div className="w-full h-16 flex items-center justify-end px-4 my-4">
          <PrimaryButton
            content="Lưu"
            size="medium"
            onClick={() => {
              if (isCreate) {
                // Handle create action
                console.log("Creating new role");
              } else {
                // Handle update action
                console.log("Updating role with id:", id);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
