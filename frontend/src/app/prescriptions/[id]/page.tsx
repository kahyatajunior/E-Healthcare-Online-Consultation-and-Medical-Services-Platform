"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import type { Prescription } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";

export default function PrescriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const res = await api.get(`/prescriptions/${params.id}`);
        setPrescription(res.data.prescription);
      } catch (error) {
        console.error("Failed to fetch prescription:", error);
        toast.error("Prescription not found");
        router.push("/prescriptions");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchPrescription();
  }, [params.id, router]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!prescription) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Prescription</h1>
            <p className="text-sm text-gray-400">
              Issued on{" "}
              {new Date(prescription.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Print / Download
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Doctor</h3>
            <p className="font-medium text-gray-900">
              Dr. {prescription.doctor?.name}
            </p>
            <p className="text-sm text-gray-500">
              {prescription.doctor?.email}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Patient</h3>
            <p className="font-medium text-gray-900">
              {prescription.patient?.name}
            </p>
            <p className="text-sm text-gray-500">
              {prescription.patient?.email}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Diagnosis
          </h3>
          <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
            {prescription.diagnosis}
          </p>
        </div>

        {prescription.medications && prescription.medications.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Medications
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Medication
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Dosage
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Frequency
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Duration
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Instructions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prescription.medications.map((med, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {med.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{med.dosage}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {med.frequency}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {med.duration}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {med.instructions || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {prescription.notes && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Additional Notes
            </h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {prescription.notes}
            </p>
          </div>
        )}

        {prescription.followUpDate && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">
              Follow-up Date:{" "}
              {new Date(prescription.followUpDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
