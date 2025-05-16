import React from "react";
import Link from "next/link";
import { Dot } from "lucide-react";

export default function SidebarItem({
  key,
  name,
  href,
}: {
  key: string;
  name: string;
  href: string;
}) {
  return (
    <Link
      className="flex items-center justify-start space-x-4 hover:bg-white/10 "
      href={href}
      key={key}
    >
      <Dot className="h-10 w-10 text-white ml-2" />
      <span className="text-md text-white font-medium">{name}</span>
    </Link>
  );
}
