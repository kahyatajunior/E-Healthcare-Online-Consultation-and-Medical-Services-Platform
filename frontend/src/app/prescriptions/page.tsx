"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import type { Prescription } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function PrescriptionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (!user) return;

    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/prescriptions?page=${page}&limit=10`);
        setPrescriptions(res.data.prescriptions);
        setTotalPages(res.data.pages);
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [user, authLoading, router, page]);

  if (authLoading) return <LoadingSpinner size="lg" />;
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Prescriptions</h1>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No prescriptions found.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {prescriptions.map((pres) => (
              <Link
                key={pres._id}
                href={`/prescriptions/${pres._id}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {pres.diagnosis}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {user.role === "patient"
                        ? `Dr. ${pres.doctor?.name || "N/A"}`
                        : `Patient: ${pres.patient?.name || "N/A"}`}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {pres.medications?.length || 0} medication(s)
                      {pres.followUpDate &&
                        ` | Follow-up: ${new Date(pres.followUpDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(pres.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
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
