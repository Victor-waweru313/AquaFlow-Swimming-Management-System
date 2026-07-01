"use client";

import { TopBar } from "@/components/TopBar";
import { Breadcrumb } from "@/components/Breadcrumb";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Swimmer {
  id: string;
  swimmerCode: string;
  name: string;
  email: string;
  dob: string;
  gender: string;
  membershipType: string;
  status: string;
  photoUrl: string | null;
}

export default function MembersPage() {
  const [swimmers, setSwimmers] = useState<Swimmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchSwimmers() {
      try {
        const res = await fetch("/api/swimmers");
        const data = await res.json();
        setSwimmers(data);
      } catch (error) {
        console.error("Failed to fetch swimmers:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSwimmers();
  }, []);

  const filteredSwimmers = swimmers.filter((s) => {
    if (activeTab === "active") return s.status === "ACTIVE";
    if (activeTab === "inactive") return s.status === "INACTIVE";
    return true;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredSwimmers.length / itemsPerPage);
  const paginatedSwimmers = filteredSwimmers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalSwimmers = swimmers.length;
  const activeCount = swimmers.filter((s) => s.status === "ACTIVE").length;
  const eliteCount = swimmers.filter((s) => s.membershipType === "ELITE").length;
  const pendingPayments = swimmers.filter((s) => Math.random() > 0.8).length;

  return (
    <>
      <TopBar title="Member Directory" />

      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 space-y-6 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Members" },
            ]}
          />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">
                Manage and track {totalSwimmers} registered swimmers
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                📊 Filter
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                📥 Export
              </button>
              <Link
                href="/members/new"
                className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 text-sm font-medium"
              >
                ➕ Add New Member
              </Link>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="card p-4">
              <p className="text-gray-600 text-xs font-medium mb-1">Total Swimmers</p>
              <p className="text-2xl font-bold text-gray-900">{totalSwimmers}</p>
              <p className="text-xs text-green-600 font-medium mt-2">+12%</p>
            </div>
            <div className="card p-4">
              <p className="text-gray-600 text-xs font-medium mb-1">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
              <p className="text-xs text-gray-600 font-medium mt-2">Stable</p>
            </div>
            <div className="card p-4">
              <p className="text-gray-600 text-xs font-medium mb-1">Elite Division</p>
              <p className="text-2xl font-bold text-gray-900">{eliteCount}</p>
              <p className="text-xs text-gray-600 font-medium mt-2">Premium tiers</p>
            </div>
            <div className="card p-4">
              <p className="text-gray-600 text-xs font-medium mb-1">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
              <p className="text-xs text-yellow-600 font-medium mt-2">Review</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="card border-b border-gray-200">
            <div className="flex gap-8 px-6">
              {["All Members", "Active", "Inactive"].map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTab(["all", "active", "inactive"][idx]);
                    setPage(1);
                  }}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    (["all", "active", "inactive"][idx] === activeTab)
                      ? "border-accent-600 text-accent-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Swimmer ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Membership Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedSwimmers.map((swimmer) => {
                    const age = new Date().getFullYear() - new Date(swimmer.dob).getFullYear();
                    return (
                      <tr key={swimmer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {swimmer.swimmerCode}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={swimmer.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${swimmer.name}`}
                              alt={swimmer.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{swimmer.name}</p>
                              <p className="text-xs text-gray-500">{swimmer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{age}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            swimmer.membershipType === "ELITE"
                              ? "bg-purple-100 text-purple-800"
                              : swimmer.membershipType === "PREMIUM"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {swimmer.membershipType === "ELITE" ? "Elite Competitive" :
                             swimmer.membershipType === "PREMIUM" ? "Junior Pro" : "Development"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              swimmer.status === "ACTIVE" ? "bg-green-500" : "bg-gray-400"
                            }`} />
                            {swimmer.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Link
                            href={`/members/${swimmer.id}`}
                            className="text-accent-600 hover:text-accent-700 font-medium"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
              <p>
                Showing {((page - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(page * itemsPerPage, filteredSwimmers.length)} of{" "}
                {filteredSwimmers.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
