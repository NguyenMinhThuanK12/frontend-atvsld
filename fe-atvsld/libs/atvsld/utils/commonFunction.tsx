import React, { RefObject, useRef } from "react";

export function toRomanNumeral(num: number): string {
  if (num <= 0) return "";

  const romanMap: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let result = "";
  for (const [value, symbol] of romanMap) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}

export const renderLabelWithAsterisk = (label: string, required: boolean) => (
  <span>
    {label}
    {required && <span style={{ color: "red" }}> *</span>}
  </span>
);

export const extractFileName = (file?: File | string | null) => {
  if (!file) return "";
  if (file instanceof File) {
    return file.name;
  }
  const parts = file.split("/");
  let fileName = parts[parts.length - 1] || "";
  const uuidPattern =
    /-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
  fileName = fileName.replace(uuidPattern, "");
  const nameParts = fileName.split("pdf");
  return nameParts[0].trim() + ".pdf";
};


export const HandleGetLabelByValue= (
  id: string,
  options: { value: string; label: string }[]
): string => {
  const opt = options.find(
    (o: { value: string; label: string }) => o.value === id
  );
  if (!opt) {
    console.warn(`Business with ID ${id} not found`);
    return "";
  }
  return opt.label;
};