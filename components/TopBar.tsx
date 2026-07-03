"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface TopBarProps {
  title: string;
  showSearch?: boolean;
}

export function TopBar({ title, showSearch = true }: TopBarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [notificationCount, setNotificationCount] = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = session?.user as any;

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        {showSearch && (
          <div className="flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search athletes, coaches..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        )}

        {/* Notification Bell */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <span className="text-xl">🔔</span>
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Settings */}
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <span className="text-xl">⚙️</span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img
              src={user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
              >
                Profile Settings
              </Link>
              <button
                onClick={async () => {
                  setShowUserMenu(false);
                  await signOut({ redirect: false });
                  router.push("/login");
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
