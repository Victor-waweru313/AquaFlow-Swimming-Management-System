import { TopBar } from "@/components/TopBar";
import { Breadcrumb } from "@/components/Breadcrumb";

export default function AttendancePage() {
  return (
    <>
      <TopBar title="Attendance Management" />
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 max-w-7xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Attendance" },
            ]}
          />

          <div className="card p-8 text-center">
            <p className="text-gray-600 text-lg">📋 Attendance page coming soon</p>
          </div>
        </div>
      </div>
    </>
  );
}
