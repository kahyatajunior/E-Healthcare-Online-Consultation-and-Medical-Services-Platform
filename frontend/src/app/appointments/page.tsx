"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import type { Appointment } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatusBadge from "@/components/ui/StatusBadge";
import toast from "react-hot-toast";

export default function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (!user) return;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set("status", statusFilter);
        params.set("page", String(page));
        params.set("limit", "10");

        const res = await api.get(`/appointments?${params.toString()}`);
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

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status}`);
      setAppointments((prev) =>
        prev.map((apt) => (apt._id === id ? { ...apt, status: status as Appointment["status"] } : apt))
      );
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to update");
    }
  };

  if (authLoading) return <LoadingSpinner size="lg" />;
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
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
          <p className="text-gray-500 text-lg mb-4">No appointments found.</p>
          {user.role === "patient" && (
            <Link
              href="/doctors"
              className="text-blue-600 hover:underline"
            >
              Find a doctor to book an appointment
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div
                key={apt._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {user.role === "patient"
                          ? `Dr. ${apt.doctor?.name || "N/A"}`
                          : apt.patient?.name || "N/A"}
                      </h3>
                      <StatusBadge status={apt.status} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {apt.doctorProfile?.specialization &&
                        `${apt.doctorProfile.specialization} | `}
                      {new Date(apt.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      &middot; {apt.timeSlot?.startTime} -{" "}
                      {apt.timeSlot?.endTime}
                    </p>
                    {apt.reason && (
                      <p className="text-sm text-gray-600 mt-1">
                        Reason: {apt.reason}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Type: {apt.type === "video" ? "Video Call" : "Chat"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {apt.status === "pending" && user.role === "doctor" && (
                      <>
                        <button
                          onClick={() => updateStatus(apt._id, "confirmed")}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(apt._id, "cancelled")}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {apt.status === "confirmed" && user.role === "doctor" && (
                      <button
                        onClick={() => updateStatus(apt._id, "completed")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Mark Completed
                      </button>
                    )}
                    {(apt.status === "pending" || apt.status === "confirmed") &&
                      user.role === "patient" && (
                        <button
                          onClick={() => updateStatus(apt._id, "cancelled")}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    <Link
                      href={`/appointments/${apt._id}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
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
