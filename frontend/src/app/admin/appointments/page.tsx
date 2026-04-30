"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import type { Appointment } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatusBadge from "@/components/ui/StatusBadge";

export default function AdminAppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard");
      return;
    }
    if (!user) return;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set("status", statusFilter);
        params.set("page", String(page));
        params.set("limit", "20");

        const res = await api.get(`/admin/appointments?${params.toString()}`);
        setAppointments(res.data.appointments);
        setTotalPages(res.data.pages);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user, authLoading, router, statusFilter, page]);

  if (authLoading) return <LoadingSpinner size="lg" />;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Appointments</h1>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : appointments.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No appointments found.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Patient
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Doctor
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Specialization
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Time
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr
                      key={apt._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {apt.patient?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        Dr. {apt.doctor?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {apt.doctorProfile?.specialization || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(apt.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {apt.timeSlot?.startTime} - {apt.timeSlot?.endTime}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={apt.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    page === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
