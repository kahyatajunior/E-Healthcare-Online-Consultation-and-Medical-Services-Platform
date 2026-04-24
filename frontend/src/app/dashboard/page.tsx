"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import type { Appointment, DashboardStats } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  FiCalendar,
  FiUsers,
  FiActivity,
  FiMessageSquare,
  FiFileText,
  FiSearch,
} from "react-icons/fi";

export default function DashboardPage() {
  const { user, doctorProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (!user) return;

    const fetchData = async () => {
      try {
        if (user.role === "admin") {
          const res = await api.get("/admin/dashboard");
          setStats(res.data.stats);
          setAppointments(res.data.recentAppointments);
        } else {
          const res = await api.get("/appointments?limit=5");
          setAppointments(res.data.appointments);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, authLoading, router]);

  if (authLoading || loading) return <LoadingSpinner size="lg" />;
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-600 mt-1">
          {user.role === "admin"
            ? "Platform Overview"
            : user.role === "doctor"
              ? doctorProfile?.specialization
                ? `${doctorProfile.specialization} Specialist`
                : "Doctor Dashboard"
              : "Manage your health journey"}
        </p>
        {user.role === "doctor" && !user.isApproved && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              Your account is pending admin approval. You won&apos;t appear in
              search results until approved.
            </p>
          </div>
        )}
      </div>

      {user.role === "admin" && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FiUsers className="w-6 h-6" />}
            label="Total Patients"
            value={stats.totalPatients}
            color="blue"
          />
          <StatCard
            icon={<FiActivity className="w-6 h-6" />}
            label="Active Doctors"
            value={stats.approvedDoctors}
            subtext={`${stats.pendingDoctors} pending`}
            color="green"
          />
          <StatCard
            icon={<FiCalendar className="w-6 h-6" />}
            label="Total Appointments"
            value={stats.totalAppointments}
            color="purple"
          />
          <StatCard
            icon={<FiFileText className="w-6 h-6" />}
            label="Completed"
            value={stats.completedAppointments}
            subtext={`${stats.cancelledAppointments} cancelled`}
            color="orange"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Appointments
              </h2>
              <Link
                href={
                  user.role === "admin"
                    ? "/admin/appointments"
                    : "/appointments"
                }
                className="text-blue-600 hover:underline text-sm"
              >
                View all
              </Link>
            </div>
            {appointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No appointments yet
              </p>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div
                    key={apt._id}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.role === "patient" || user.role === "admin"
                          ? `Dr. ${apt.doctor?.name || "N/A"}`
                          : apt.patient?.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(apt.date).toLocaleDateString()} &middot;{" "}
                        {apt.timeSlot?.startTime}
                      </p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          {user.role === "patient" && (
            <>
              <QuickAction
                href="/doctors"
                icon={<FiSearch className="w-5 h-5" />}
                label="Find a Doctor"
              />
              <QuickAction
                href="/appointments"
                icon={<FiCalendar className="w-5 h-5" />}
                label="My Appointments"
              />
              <QuickAction
                href="/prescriptions"
                icon={<FiFileText className="w-5 h-5" />}
                label="My Prescriptions"
              />
              <QuickAction
                href="/chat"
                icon={<FiMessageSquare className="w-5 h-5" />}
                label="Messages"
              />
            </>
          )}
          {user.role === "doctor" && (
            <>
              <QuickAction
                href="/appointments"
                icon={<FiCalendar className="w-5 h-5" />}
                label="My Appointments"
              />
              <QuickAction
                href="/prescriptions"
                icon={<FiFileText className="w-5 h-5" />}
                label="Prescriptions"
              />
              <QuickAction
                href="/chat"
                icon={<FiMessageSquare className="w-5 h-5" />}
                label="Messages"
              />
              <QuickAction
                href="/profile"
                icon={<FiUsers className="w-5 h-5" />}
                label="My Profile"
              />
            </>
          )}
          {user.role === "admin" && (
            <>
              <QuickAction
                href="/admin/users"
                icon={<FiUsers className="w-5 h-5" />}
                label="Manage Users"
              />
              <QuickAction
                href="/admin/appointments"
                icon={<FiCalendar className="w-5 h-5" />}
                label="All Appointments"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  subtext?: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="text-blue-600">{icon}</div>
      <span className="font-medium text-gray-700">{label}</span>
    </Link>
  );
}
