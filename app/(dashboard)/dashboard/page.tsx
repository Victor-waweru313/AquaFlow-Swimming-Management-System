import { TopBar } from "@/components/TopBar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  // Fetch statistics
  const totalSwimmers = await db.swimmer.count();
  const activeSwimmers = await db.swimmer.count({ where: { status: "ACTIVE" } });
  const activeCoaches = await db.coach.count();
  const totalCoaches = await db.coach.count();
  
  // Get today's sessions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysSessions = await db.session.count({
    where: {
      sessionDate: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  // Get total revenue from payments
  const payments = await db.payment.aggregate({
    where: { status: "PAID" },
    _sum: { amount: true },
  });
  const monthlyRevenue = payments._sum.amount || 0;

  // Get recent activity
  const recentEnrollments = await db.sessionEnrollment.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      swimmer: true,
      session: true,
    },
  });

  const recentAttendance = await db.attendance.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      swimmer: true,
      session: true,
    },
  });

  // Combine recent activity
  const recentActivity = [
    ...recentEnrollments.map((e) => ({
      type: "ENROLLMENT",
      swimmer: e.swimmer,
      description: `Enrolled in ${e.session.name}`,
      timestamp: e.createdAt,
    })),
    ...recentAttendance.map((a) => ({
      type: "ATTENDANCE",
      swimmer: a.swimmer,
      description: `Attended ${a.session.name}`,
      timestamp: a.createdAt,
    })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);

  return (
    <>
      <TopBar title="Dashboard Overview" />

      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 space-y-6 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Dashboard" },
            ]}
          />

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Swimmers</p>
                  <p className="text-3xl font-bold text-gray-900">{totalSwimmers}</p>
                  <p className="text-sm text-green-600 font-medium mt-2">+12% this month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">👥</div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Active Coaches</p>
                  <p className="text-3xl font-bold text-gray-900">{activeCoaches}</p>
                  <p className="text-sm text-gray-600 font-medium mt-2">Stable</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-xl">🏊</div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Upcoming Sessions</p>
                  <p className="text-3xl font-bold text-gray-900">{todaysSessions}</p>
                  <p className="text-sm text-gray-600 font-medium mt-2">Today</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-xl">📅</div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">${monthlyRevenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600 font-medium mt-2">+4% trend</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-xl">💰</div>
              </div>
            </div>
          </div>

          {/* Financial Summary and Quick Actions */}
          <div className="grid grid-cols-3 gap-6">
            {/* Financial Summary */}
            <div className="col-span-2 card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Financial Summary</h2>
                <select className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white">
                  <option>Last 6 Months</option>
                  <option>Last 3 Months</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center text-gray-500">
                <p>📊 Chart visualization (Recharts to be added)</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👤</span>
                    <span className="text-sm font-medium text-gray-700">Add New Member</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600">›</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📋</span>
                    <span className="text-sm font-medium text-gray-700">Create Session</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600">›</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📊</span>
                    <span className="text-sm font-medium text-gray-700">Generate Report</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600">›</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⚙️</span>
                    <span className="text-sm font-medium text-gray-700">System Preferences</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600">›</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              <a href="#" className="text-accent-600 hover:text-accent-700 text-sm font-medium">
                View All →
              </a>
            </div>
            <div className="space-y-0 divide-y divide-gray-200">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={activity.swimmer.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.swimmer.name}`}
                      alt={activity.swimmer.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.swimmer.name}</p>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {format(activity.timestamp, "MMM d, h:mm a")}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      activity.type === "ENROLLMENT"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {activity.type === "ENROLLMENT" ? "NEW ENROLLMENT" : "ATTENDANCE"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
