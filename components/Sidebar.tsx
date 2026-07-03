"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  roles: string[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", icon: "📊", label: "Dashboard", roles: ["ADMIN", "COACH", "ACCOUNTANT"] },
  { href: "/members", icon: "👥", label: "Members", roles: ["ADMIN", "COACH", "ACCOUNTANT", "SWIMMER"] },
  { href: "/training", icon: "🏊", label: "Training", roles: ["ADMIN", "COACH", "ACCOUNTANT", "SWIMMER"] },
  { href: "/attendance", icon: "✓", label: "Attendance", roles: ["ADMIN", "COACH", "ACCOUNTANT"] },
  { href: "/performance", icon: "📈", label: "Performance", roles: ["ADMIN", "COACH", "ACCOUNTANT", "SWIMMER"] },
  { href: "/finances", icon: "💰", label: "Finances", roles: ["ADMIN", "ACCOUNTANT"] },
  { href: "/reports", icon: "📋", label: "Reports", roles: ["ADMIN", "ACCOUNTANT"] },
  { href: "/admin/users", icon: "👨‍💼", label: "Users", roles: ["ADMIN"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "SWIMMER";

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">≈</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-primary-700">AquaFlow</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-accent-50 text-accent-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Divider and action buttons */}
      <div className="px-3 py-4 border-t border-gray-200 space-y-2">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-medium text-sm">
          <span>➕</span>
          <span>Add Entry</span>
        </button>
      </div>

      {/* Settings and Help */}
      <div className="px-3 py-4 border-t border-gray-200 space-y-1">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
            pathname === "/settings"
              ? "bg-accent-50 text-accent-700 font-semibold"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <span className="text-xl">⚙️</span>
          <span>Settings</span>
        </Link>
        <Link
          href="/help"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
            pathname === "/help"
              ? "bg-accent-50 text-accent-700 font-semibold"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <span className="text-xl">❓</span>
          <span>Help</span>
        </Link>
      </div>
    </aside>
  );
}
