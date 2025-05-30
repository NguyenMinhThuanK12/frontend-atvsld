import React from "react";
import Link from "next/link";
import { Dot } from "lucide-react";

export default function SidebarItem({
  name,
  href,
  isSelected,
  onSelect,
}: {
  name: string;
  href: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Link
      className={`flex items-center justify-start space-x-4  ${
        isSelected ? "bg-[#1a3fa5]" : "hover:bg-white/10"
      }`}
      href={href}
      onClick={onSelect}
    >
      <Dot className="h-10 w-10 text-white ml-2" />
      <span className="text-md text-white font-medium">{name}</span>
    </Link>
  );
}
