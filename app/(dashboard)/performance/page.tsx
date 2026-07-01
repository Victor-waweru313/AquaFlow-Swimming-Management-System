import { TopBar } from "@/components/TopBar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export default async function PerformancePage() {
  const session = await auth();
  const userRole = (session?.user as any)?.role;

  // Get current user's swimmer profile if they are a swimmer
  let currentSwimmer = null;
  if (userRole === "SWIMMER" && session?.user?.email) {
    currentSwimmer = await db.swimmer.findFirst({
      where: { user: { email: session.user.email as string } },
      include: { performanceRecords: true },
    });
  }

  const performanceRecords = currentSwimmer?.performanceRecords || [];

  return (
    <>
      <TopBar title="Performance Overview" />

      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 space-y-6 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Performance" },
            ]}
          />

          {/* Welcome Message */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {userRole === "SWIMMER"
                  ? `Welcome back, ${currentSwimmer?.name || "Athlete"}. You're 0.4s away from your season goal!`
                  : "Performance Overview"}
              </h2>
            </div>
            {userRole === "SWIMMER" && (
              <button className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 text-sm font-medium">
                ➕ Log Session
              </button>
            )}
          </div>

          {/* My Next Session Card */}
          <div className="card p-6 bg-gradient-to-br from-accent-50 to-teal-50 border border-accent-200">
            <h3 className="font-semibold text-gray-900 mb-4">My Next Session</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-white rounded text-sm font-medium text-primary-700">
                  Tomorrow, 6:00 AM
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900">Elite Performance Squad - Morning</p>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Time</p>
                  <p className="font-medium">6:00 - 7:30 AM</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Coach</p>
                  <p className="font-medium">Coach Marcus</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Lane</p>
                  <p className="font-medium">Lane 3</p>
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    UPCOMING
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance History Chart */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Performance History</h3>
                <select className="px-3 py-1 border border-gray-300 rounded text-sm bg-white">
                  <option>100m Freestyle</option>
                  <option>200m Freestyle</option>
                  <option>50m Freestyle</option>
                </select>
              </div>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center text-gray-500">
                <p>📈 Chart visualization (Recharts to be added)</p>
              </div>
            </div>

            {/* Recent Results */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Results</h3>
              <div className="space-y-3">
                {performanceRecords.slice(0, 3).map((record) => (
                  <div key={record.id} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                    <p className="text-sm font-medium text-gray-900">{record.event}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600">{record.timeSeconds.toFixed(2)}s</p>
                      <span className="text-xs font-semibold text-accent-600">🥇 {record.rank}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Training Goals */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Training Goals</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" checked disabled />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Improve 100m Freestyle by 2 seconds</p>
                  <p className="text-xs text-gray-600">80% progress</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded">
                  NEARLY
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Complete 20 training sessions</p>
                  <p className="text-xs text-gray-600">45% progress</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                  IN PROGRESS
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Achieve A+ rank in backstroke</p>
                  <p className="text-xs text-gray-600">60% progress</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  ONGOING
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
