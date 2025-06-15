"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Menu, Settings, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import SidebarItem from "./SidebarItem";
import Alert from "@/libs/core/components/Alert/primaryAlert";
import { logout } from "@/libs/atvsld/services/api/authApi";
import { UserType } from "@/libs/shared/core/enums/userType";
import {
  clientMenuItems,
  useAdminMenuItems,
} from "./AuthFeature/handleAuthFeature";

const Sidebar = () => {
  const [menuItems, setMenuItems] = useState<{ name: string; href: string }[]>(
    []
  );

  const [isSystemOpen, setIsSystemOpen] = useState(true);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const pathName = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  const showAlert = useCallback(
    (
      content: string,
      type: "success" | "error" | "warning" | "info",
      duration = 2000
    ) => {
      setAlert({ content, type });
      const timer = setTimeout(() => setAlert(null), duration);
      return () => clearTimeout(timer);
    },
    []
  );

  const adminMenuItems = useAdminMenuItems();

  useEffect(() => {
    const userType = Cookies.get("userType");
    if (!userType) {
      window.location.href = "/auth/login";
      return;
    }

    // Set menu items based on user type
    if (userType === UserType.ADMIN) {
      
      setMenuItems(adminMenuItems);
    } else {
      setMenuItems(clientMenuItems);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const signInStatus = searchParams.get("login");

    if (signInStatus === "success") {
      return showAlert("Đăng nhập thành công!", "success");
    }
  }, []);

  useEffect(() => {
    const storedFullName = Cookies.get("fullName");
    if (storedFullName) {
      setUsername(storedFullName || "Không xác định");
    }
  }, [username]);

  useEffect(() => {
    const storedAvatar = Cookies.get("avatar");
    if (storedAvatar) {
      setAvatar(storedAvatar || "/img/default-avatar.png");
    }
  }, [avatar]);

  useEffect(() => {
    const currentPath = pathName;
    const matchingItem = menuItems
      .filter((item): item is { name: string; href: string } => Boolean(item))
      .find((item) => item.href === currentPath);
    if (matchingItem) {
      setSelectedItem(matchingItem.href);
    } else {
      setSelectedItem(null);
    }
  }, [pathName]);

  const toggleSystemMenu = useCallback(() => {
    setIsSystemOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) {
      showAlert(
        "Không tìm thấy refresh token. Đăng xuất ngay lập tức.",
        "error"
      );
      // Vẫn xóa dữ liệu và đăng xuất
    } else {
      try {
        const response = await logout(refreshToken);
        if (response.status !== 200) {
          showAlert(response.message || "Đăng xuất thất bại", "error");
          // Vẫn xóa dữ liệu để đảm bảo đăng xuất
        }
      } catch (error) {
        showAlert("Lỗi khi đăng xuất. Vẫn tiến hành xóa dữ liệu.", "warning");
      }
    }

    // Xóa các Cookies cụ thể
    ["accessToken", "refreshToken", "fullName", "avatar", "userType"].forEach(
      (cookieName) => {
        Cookies.remove(cookieName, { path: "/" });
      }
    );

    // Xóa dữ liệu khỏi localStorage
    localStorage.removeItem("userAuthenticated");

    router.push("/auth/login?logout=success");
  }, [router, showAlert]);

  if (isLoading) {
    return (
      <div className="h-screen w-80 fixed top-0 left-0 bg-leftSidebar z-50 flex items-center justify-center">
        <span className="text-white">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-80 fixed top-0 left-0 bg-leftSidebar z-50">
      {/* horizontal tab */}
      <div className="absolute w-80 h-px bg-white top-24 left-0"></div>
      {/* sidebar header */}
      <div className="w-80 h-28 flex items-center justify-between space-x-3 p-4 bg-inherit">
        {/* Logo */}

        <Link
          href={"/"}
          className="flex items-center justify-between space-x-3"
        >
          <img
            src="/img/logo-left-side-bar.png"
            alt="Logo"
            className="w-15 h-15"
          />
          <span className="text-sm text-white font-semibold text-center">
            Ủy ban nhân dân thành phố <span>Hồ Chí Minh</span>
          </span>
        </Link>

        {/* menu open button */}
        <button className="p-2 text-white rounded-full hover:bg-white/10">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* sidebar items */}
      <nav>
        <div
          className="flex items-center p-4 justify-between hover:bg-white/10 cursor-pointer"
          onClick={toggleSystemMenu}
        >
          <div className="flex items-center justify-start space-x-5">
            <Settings className="h-6 w-6 text-white" />
            <span className="text-lg text-white ml-5 font-medium">
              Hệ thống
            </span>
          </div>
          <ChevronDown
            className={`h-6 w-6 text-white transition-transform 
                        ${isSystemOpen ? "rotate-180" : ""}`}
          />
        </div>
        {isSystemOpen && (
          <div className="mt-2">
            {menuItems.length > 0 &&
              menuItems
                .filter((item): item is { name: string; href: string } =>
                  Boolean(item)
                )
                .map((item) => (
                  <SidebarItem
                    key={item.name}
                    name={item.name}
                    href={item.href}
                    isSelected={selectedItem === item.href}
                    onSelect={() => setSelectedItem(item.href)}
                  />
                ))}
          </div>
        )}
      </nav>

      {/* sidebar footer */}
      <div className="absolute bottom-0 left-0 w-80 h-20 flex items-center justify-between p-4 bg-leftSidebar">
        {/* logo account */}
        <div className="py-2 w-full bg-leftSidebar flex items-center justify-between">
          <div className="flex items-center justify-between w-full relative">
            <div className="flex items-center justify-start space-x-2 py-2 shadow-xl">
              <img
                src={avatar || "/img/default-avatar.png"}
                alt="avatar"
                className="w-12 h-12 rounded-full"
              />
              {/* Change Username after Login */}
              <span className="text-white text-md font-medium">{username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-white rounded-full hover:bg-white/10"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute top-0 left-0 w-full h-px bg-white"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-white"></div>
          </div>
        </div>
      </div>
      {alert && (
        <Alert
          content={alert.content}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default Sidebar;
