import { TopBar } from "@/components/TopBar";
import { Breadcrumb } from "@/components/Breadcrumb";
import Link from "next/link";
import { db } from "@/lib/db";
import { format } from "date-fns";

export default async function TrainingPage() {
  const sessions = await db.session.findMany({
    include: { pool: true, coach: true, enrollments: true },
    orderBy: { sessionDate: "asc" },
  });

  return (
    <>
      <TopBar title="Training Schedule" />

      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 space-y-6 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Training Schedule" },
            ]}
          />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">
                Manage weekly lane rotations and coach assignments
              </p>
            </div>
            <button className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 text-sm font-medium">
              ➕ New Training Session
            </button>
          </div>

          {/* Sessions List */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Session Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Pool</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Coach</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Enrolled</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{session.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {format(session.sessionDate, "MMM d, yyyy")} {format(session.startTime, "h:mm a")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{session.pool.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <img
                            src={session.coach.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.coach.name}`}
                            alt={session.coach.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span>{session.coach.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          session.sessionType === "COMPETITIVE"
                            ? "bg-blue-100 text-blue-800"
                            : session.sessionType === "JUNIOR_ACADEMY"
                            ? "bg-green-100 text-green-800"
                            : session.sessionType === "PRIVATE"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-teal-100 text-teal-800"
                        }`}>
                          {session.sessionType.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {session.enrollments.length}/{session.capacity}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/training/${session.id}`}
                          className="text-accent-600 hover:text-accent-700 font-medium"
                        >
                          View
                        </Link>
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
