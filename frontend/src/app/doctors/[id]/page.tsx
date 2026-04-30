"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { DoctorProfile, Review } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StarRating from "@/components/ui/StarRating";
import toast from "react-hot-toast";
import { FiClock, FiDollarSign, FiAward, FiCalendar } from "react-icons/fi";

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [booking, setBooking] = useState({
    date: "",
    startTime: "",
    endTime: "",
    type: "chat",
    reason: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${params.id}`);
        setDoctor(res.data.doctor);
        setReviews(res.data.reviews || []);
      } catch (error) {
        console.error("Failed to fetch doctor:", error);
        toast.error("Doctor not found");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchDoctor();
  }, [params.id]);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    setBookingLoading(true);
    try {
      await api.post("/appointments", {
        doctorId: doctor?._id,
        date: booking.date,
        timeSlot: { startTime: booking.startTime, endTime: booking.endTime },
        type: booking.type,
        reason: booking.reason,
      });
      toast.success("Appointment booked successfully!");
      router.push("/appointments");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!doctor) return <p className="text-center py-16 text-gray-500">Doctor not found</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl flex-shrink-0">
            {doctor.user?.name?.charAt(0) || "D"}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Dr. {doctor.user?.name}
            </h1>
            <p className="text-lg text-blue-600 mt-1">
              {doctor.specialization}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <StarRating rating={doctor.rating} />
              <span className="text-gray-500">
                {doctor.rating.toFixed(1)} ({doctor.totalReviews} reviews)
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <InfoItem
                icon={<FiAward className="w-5 h-5" />}
                label="Experience"
                value={`${doctor.experience} years`}
              />
              <InfoItem
                icon={<FiDollarSign className="w-5 h-5" />}
                label="Fee"
                value={`$${doctor.consultationFee}`}
              />
              <InfoItem
                icon={<FiCalendar className="w-5 h-5" />}
                label="Consultations"
                value={String(doctor.totalConsultations)}
              />
              <InfoItem
                icon={<FiClock className="w-5 h-5" />}
                label="Available"
                value={`${doctor.availability?.length || 0} slots`}
              />
            </div>
            {doctor.bio && (
              <p className="mt-4 text-gray-600">{doctor.bio}</p>
            )}
            {doctor.qualifications?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Qualifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.qualifications.map((q, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {q}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {user?.role === "patient" && (
          <div className="mt-6">
            <button
              onClick={() => setShowBooking(!showBooking)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showBooking ? "Cancel" : "Book Appointment"}
            </button>
          </div>
        )}
      </div>

      {showBooking && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Book an Appointment
          </h2>
          <form onSubmit={handleBookAppointment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={booking.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setBooking({ ...booking, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  required
                  value={booking.startTime}
                  onChange={(e) =>
                    setBooking({ ...booking, startTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  required
                  value={booking.endTime}
                  onChange={(e) =>
                    setBooking({ ...booking, endTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consultation Type
              </label>
              <select
                value={booking.type}
                onChange={(e) =>
                  setBooking({ ...booking, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="chat">Chat</option>
                <option value="video">Video Call</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Visit
              </label>
              <textarea
                value={booking.reason}
                onChange={(e) =>
                  setBooking({ ...booking, reason: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your symptoms or reason..."
              />
            </div>
            <button
              type="submit"
              disabled={bookingLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {bookingLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      )}

      {doctor.availability && doctor.availability.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Availability
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {doctor.availability.map((slot, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${
                  slot.isAvailable
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <p className="font-medium capitalize">{slot.day}</p>
                <p className="text-sm text-gray-600">
                  {slot.startTime} - {slot.endTime}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Reviews ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {review.patient?.name || "Anonymous"}
                  </span>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                {review.comment && (
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center space-x-2">
      <div className="text-blue-600">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
