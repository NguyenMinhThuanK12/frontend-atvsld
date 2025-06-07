import provincesData from "@/public/json/provinces.json";
import districtsData from "@/public/json/districts.json";
import wardsData from "@/public/json/wards.json";
import { province } from "@/libs/core/models/province";
import { district } from "@/libs/core/models/district";
import { Ward } from "@/libs/core/models/ward";

export const cityOptions = provincesData
  .filter((province: province) => province.code === "79")
  .map((province: province) => ({
    value: province.code,
    label: province.name_with_type,
  }));

export const districtOptions = [
  { value: "", label: "Tất cả" }, // Add "Tất cả" option
  ...districtsData
    .filter((district: district) => district.parent_code === "79")
    .map((district: district) => ({
      value: district.code,
      label: district.name_with_type,
    })),
];

export const getWardOptions = (
  selectedDistrict: string,
  districtOptions: { value: string; label: string }[],
  wardsData: Ward[]
): { value: string; label: string }[] => {
  // If no district is selected or "Tất cả" is selected, return "Tất cả" and a placeholder
  if (!selectedDistrict || selectedDistrict === "Tất cả") {
    return [{ value: "", label: "Chọn quận/huyện trước" }];
  }

  const district = districtOptions.find((d) => d.value === selectedDistrict);
  if (!district) {
    return [{ value: "", label: "Chọn quận/huyện trước" }];
  }

  const wards = wardsData
    .filter((ward: Ward) => ward.parent_code === district.value)
    .map((ward: Ward) => ({
      value: ward.code,
      label: ward.name_with_type,
    }));

  return wards.length > 0
    ? [
        { value: "", label: "Tất cả" }, // Add "Tất cả" option
        ...wards,
      ]
    : [{ value: "", label: "Không có phường/xã" }];
};

export const districtCreationOptions = districtsData
  .filter((district: district) => district.parent_code === "79")
  .map((district: district) => ({
    key: district.code,
    value: district.name_with_type,
  }));

export const getWardCreationOptions = (
  selectedDistrict: string,
  districtOptions: { key: string; value: string }[],
  wardsData: Ward[]
): { key: string; value: string }[] => {
  const district = districtOptions.find((d) => d.value === selectedDistrict);
  if (!district) {
    return [{ key: "", value: "Chọn quận/huyện trước" }];
  }

  const wards = wardsData
    .filter((ward: Ward) => ward.parent_code === district.key)
    .map((ward: Ward) => ({
      key: ward.code,
      value: ward.name_with_type,
    }));

  return wards;
};

export const newCityOptions = provincesData
  .filter((province) => province.code === "79")
  .map((province: province) => ({
    value: province.name_with_type,
    label: province.name_with_type,
  }));

export const newDistrictOptions = districtsData
  .filter((district: district) => district.parent_code === "79")
  .map((district: district) => ({
    value: district.name_with_type,
    label: district.name_with_type,
  }));

export const newWardOptions = (
  selectedDistrict: string
): { value: string; label: string }[] => {
  if (!selectedDistrict) {
    return [{ value: "", label: "Chọn quận/huyện trước" }];
  }

  const district = districtsData.find(
    (d) => d.name_with_type === selectedDistrict
  );
  if (!district) {
    return [{ value: "", label: "Chọn quận/huyện trước" }];
  }

  const wards = wardsData
    .filter((ward: Ward) => ward.parent_code === district.code)
    .map((ward: Ward) => ({
      value: ward.name_with_type,
      label: ward.name_with_type,
    }));
  
  return wards;
};
