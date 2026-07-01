import { TopBar } from "@/components/TopBar";
import { Breadcrumb } from "@/components/Breadcrumb";
import Link from "next/link";
import { db } from "@/lib/db";
import { format } from "date-fns";

export default async function SessionDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await db.session.findUnique({
    where: { id: params.id },
    include: {
      pool: true,
      coach: true,
      enrollments: {
        include: { swimmer: true, lane: true },
      },
    },
  });

  if (!session) {
    return (
      <>
        <TopBar title="Session Not Found" showSearch={false} />
        <div className="flex items-center justify-center h-96">
          <p>Session not found</p>
        </div>
      </>
    );
  }

  const lanes = await db.lane.findMany({
    where: { poolId: session.poolId },
    orderBy: { laneNumber: "asc" },
  });

  return (
    <>
      <TopBar title={session.name} showSearch={false} />

      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 space-y-6 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Training", href: "/training" },
              { label: "Session Details" },
            ]}
          />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{session.name}</h1>
              <p className="text-gray-600 text-sm">{session.pool.location}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                📤 Export List
              </button>
              <button className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 text-sm font-medium">
                ➕ Add Swimmers
              </button>
            </div>
          </div>

          {/* Session Info */}
          <div className="grid grid-cols-4 gap-4">
            <div className="card p-4">
              <p className="text-gray-600 text-xs font-medium mb-1">Date</p>
              <p className="text-sm font-semibold">{format(session.sessionDate, "MMM d, yyyy")}</p>
            </div>
            <div className="card p-4">
              <p className="text-gray-600 text-xs font-medium mb-1">Time</p>
              <p className="text-sm font-semibold">
                {format(session.startTime, "h:mm a")} - {format(session.endTime, "h:mm a")}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-gray-600 text-xs font-medium mb-1">Coach</p>
              <p className="text-sm font-semibold">{session.coach.name}</p>
            </div>
            <div className="card p-4">
              <p className="text-gray-600 text-xs font-medium mb-1">Type</p>
              <p className="text-sm font-semibold">{session.sessionType.replace(/_/g, " ")}</p>
            </div>
          </div>

          {/* Capacity and Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
              <p className="text-sm font-semibold text-gray-900 mb-1">Enrolled</p>
              <p className="text-2xl font-bold text-blue-600">{session.enrollments.length}/{session.capacity}</p>
              <p className="text-xs text-gray-600 mt-1">
                {Math.round((session.enrollments.length / session.capacity) * 100)}% capacity
              </p>
            </div>
            <div className="card p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
              <p className="text-sm font-semibold text-gray-900 mb-1">Avg Rank</p>
              <p className="text-2xl font-bold text-purple-600">A+</p>
              <p className="text-xs text-gray-600 mt-1">Elite Tier</p>
            </div>
          </div>

          {/* Lane Management */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Lane Management</h2>
            <div className="grid grid-cols-2 gap-3">
              {lanes.map((lane) => {
                const laneSwimmers = session.enrollments.filter((e) => e.laneId === lane.id);
                return (
                  <div key={lane.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Lane {lane.laneNumber}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        lane.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {lane.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{lane.focusArea}</p>
                    <p className="text-xs text-gray-500">
                      {laneSwimmers.length} swimmer{laneSwimmers.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Swimmer Roster */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Swimmer Roster</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Rank/Level</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Lane</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {session.enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={enrollment.swimmer.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${enrollment.swimmer.name}`}
                            alt={enrollment.swimmer.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="font-medium">{enrollment.swimmer.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">A+</td>
                      <td className="px-4 py-3">{enrollment.lane?.laneNumber || "-"}</td>
                      <td className="px-4 py-3">
                        <span className="text-green-600 font-medium">Active</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-accent-600 hover:text-accent-700 text-xs font-medium">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
