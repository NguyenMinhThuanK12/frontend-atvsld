import provincesData from "@/public/json/provinces.json";
import districtsData from "@/public/json/districts.json";
import wardsData from "@/public/json/wards.json";
import { province } from "@/libs/core/models/province";
import { district } from "@/libs/core/models/district";
import { Ward } from "@/libs/core/models/ward";


export const cityOptions = [
  { key: "", value: "Tất cả" }, // Add "Tất cả" option
  ...provincesData
    .filter((province: province) => province.code === "79")
    .map((province: province) => ({
      key: province.code,
      value: province.name_with_type,
    })),
];

export const districtOptions = [
  { key: "", value: "Tất cả" }, // Add "Tất cả" option
  ...districtsData
    .filter((district: district) => district.parent_code === "79")
    .map((district: district) => ({
      key: district.code,
      value: district.name_with_type,
    })),
];

export const getWardOptions = (
  selectedDistrict: string,
  districtOptions: { key: string; value: string }[],
  wardsData: Ward[]
): { key: string; value: string }[] => {
  // If no district is selected or "Tất cả" is selected, return "Tất cả" and a placeholder
  if (!selectedDistrict || selectedDistrict === "Tất cả") {
    return [
      { key: "", value: "Tất cả" }, // Add "Tất cả" option
      { key: "", value: "Chọn quận/huyện trước" },
    ];
  }

  const district = districtOptions.find((d) => d.value === selectedDistrict);
  if (!district) {
    return [
      { key: "", value: "Tất cả" }, // Add "Tất cả" option
      { key: "", value: "Chọn quận/huyện trước" },
    ];
  }

  const wards = wardsData
    .filter((ward: Ward) => ward.parent_code === district.key)
    .map((ward: Ward) => ({
      key: ward.code,
      value: ward.name_with_type,
    }));

  return wards.length > 0
    ? [
        { key: "", value: "Tất cả" }, // Add "Tất cả" option
        ...wards,
      ]
    : [
        { key: "", value: "Tất cả" }, // Add "Tất cả" option
        { key: "", value: "Không có phường/xã" },
      ];
};