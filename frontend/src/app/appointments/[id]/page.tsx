"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Appointment, Prescription } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatusBadge from "@/components/ui/StatusBadge";
import StarRating from "@/components/ui/StarRating";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [showPrescription, setShowPrescription] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: "",
    notes: "",
    medications: [
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aptRes, presRes] = await Promise.all([
          api.get(`/appointments/${params.id}`),
          api.get(`/prescriptions/appointment/${params.id}`),
        ]);
        setAppointment(aptRes.data.appointment);
        setPrescriptions(presRes.data.prescriptions || []);
      } catch (error) {
        console.error("Failed to fetch appointment:", error);
        toast.error("Appointment not found");
        router.push("/appointments");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchData();
  }, [params.id, router]);

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;
    try {
      await api.post("/reviews", {
        doctorProfileId: appointment.doctorProfile?._id,
        rating: reviewData.rating,
        comment: reviewData.comment,
        appointmentId: appointment._id,
      });
      toast.success("Review submitted!");
      setShowReview(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  const handlePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;
    try {
      const res = await api.post("/prescriptions", {
        patientId: appointment.patient._id || appointment.patient.id,
        appointmentId: appointment._id,
        diagnosis: prescriptionData.diagnosis,
        notes: prescriptionData.notes,
        medications: prescriptionData.medications.filter((m) => m.name),
      });
      toast.success("Prescription created!");
      setPrescriptions((prev) => [...prev, res.data.prescription]);
      setShowPrescription(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error.response?.data?.message || "Failed to create prescription"
      );
    }
  };

  const addMedication = () => {
    setPrescriptionData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
    }));
  };

  const updateMedication = (
    index: number,
    field: string,
    value: string
  ) => {
    setPrescriptionData((prev) => ({
      ...prev,
      medications: prev.medications.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }));
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!appointment) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Appointment Details
          </h1>
          <StatusBadge status={appointment.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Doctor</h3>
            <p className="text-lg font-medium text-gray-900">
              Dr. {appointment.doctor?.name}
            </p>
            <p className="text-sm text-blue-600">
              {appointment.doctorProfile?.specialization}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Patient</h3>
            <p className="text-lg font-medium text-gray-900">
              {appointment.patient?.name}
            </p>
            <p className="text-sm text-gray-500">
              {appointment.patient?.email}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
            <p className="text-gray-900">
              {new Date(appointment.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-gray-600">
              {appointment.timeSlot?.startTime} -{" "}
              {appointment.timeSlot?.endTime}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Type</h3>
            <p className="text-gray-900">
              {appointment.type === "video" ? "Video Call" : "Chat"}
            </p>
          </div>
          {appointment.reason && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Reason</h3>
              <p className="text-gray-900">{appointment.reason}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          {(appointment.status === "confirmed" ||
            appointment.status === "completed") && (
            <Link
              href={`/chat/${appointment._id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Open Chat
            </Link>
          )}
          {appointment.status === "completed" &&
            user?.role === "patient" && (
              <button
                onClick={() => setShowReview(!showReview)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
              >
                Leave Review
              </button>
            )}
          {user?.role === "doctor" &&
            (appointment.status === "confirmed" ||
              appointment.status === "completed") && (
              <button
                onClick={() => setShowPrescription(!showPrescription)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Write Prescription
              </button>
            )}
        </div>
      </div>

      {showReview && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>
          <form onSubmit={handleReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <StarRating
                rating={reviewData.rating}
                interactive
                onRate={(r) => setReviewData({ ...reviewData, rating: r })}
                size="lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment
              </label>
              <textarea
                value={reviewData.comment}
                onChange={(e) =>
                  setReviewData({ ...reviewData, comment: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}

      {showPrescription && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-semibold mb-4">Write Prescription</h2>
          <form onSubmit={handlePrescription} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnosis
              </label>
              <input
                type="text"
                required
                value={prescriptionData.diagnosis}
                onChange={(e) =>
                  setPrescriptionData({
                    ...prescriptionData,
                    diagnosis: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Medications
                </label>
                <button
                  type="button"
                  onClick={addMedication}
                  className="text-blue-600 hover:underline text-sm"
                >
                  + Add Medication
                </button>
              </div>
              {prescriptionData.medications.map((med, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3 p-3 bg-gray-50 rounded-lg"
                >
                  <input
                    placeholder="Name"
                    value={med.name}
                    onChange={(e) =>
                      updateMedication(i, "name", e.target.value)
                    }
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    placeholder="Dosage"
                    value={med.dosage}
                    onChange={(e) =>
                      updateMedication(i, "dosage", e.target.value)
                    }
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    placeholder="Frequency"
                    value={med.frequency}
                    onChange={(e) =>
                      updateMedication(i, "frequency", e.target.value)
                    }
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    placeholder="Duration"
                    value={med.duration}
                    onChange={(e) =>
                      updateMedication(i, "duration", e.target.value)
                    }
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <input
                    placeholder="Instructions"
                    value={med.instructions}
                    onChange={(e) =>
                      updateMedication(i, "instructions", e.target.value)
                    }
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={prescriptionData.notes}
                onChange={(e) =>
                  setPrescriptionData({
                    ...prescriptionData,
                    notes: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Create Prescription
            </button>
          </form>
        </div>
      )}

      {prescriptions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Prescriptions
          </h2>
          <div className="space-y-4">
            {prescriptions.map((pres) => (
              <Link
                key={pres._id}
                href={`/prescriptions/${pres._id}`}
                className="block p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
              >
                <p className="font-medium text-gray-900">
                  {pres.diagnosis}
                </p>
                <p className="text-sm text-gray-500">
                  {pres.medications?.length || 0} medication(s) &middot;{" "}
                  {new Date(pres.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
