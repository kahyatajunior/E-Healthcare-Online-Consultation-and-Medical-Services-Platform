"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { DoctorProfile } from "@/lib/types";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StarRating from "@/components/ui/StarRating";
import { FiSearch, FiFilter } from "react-icons/fi";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    specialization: "",
    sortBy: "rating",
    page: 1,
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.specialization)
          params.set("specialization", filters.specialization);
        params.set("sortBy", filters.sortBy);
        params.set("page", String(filters.page));
        params.set("limit", "12");

        const res = await api.get(`/doctors?${params.toString()}`);
        setDoctors(res.data.doctors);
        setTotalPages(res.data.pages);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [filters]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await api.get("/doctors/specializations");
        setSpecializations(res.data.specializations);
      } catch (error) {
        console.error("Failed to fetch specializations:", error);
      }
    };
    fetchSpecializations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Find a Doctor</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value, page: 1 })
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <select
              value={filters.specialization}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  specialization: e.target.value,
                  page: 1,
                })
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({ ...filters, sortBy: e.target.value, page: 1 })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="rating">Highest Rated</option>
            <option value="experience">Most Experienced</option>
            <option value="fee_low">Lowest Fee</option>
            <option value="fee_high">Highest Fee</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : doctors.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            No doctors found matching your criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Link
                key={doctor._id}
                href={`/doctors/${doctor._id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                    {doctor.user?.name?.charAt(0) || "D"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      Dr. {doctor.user?.name || "N/A"}
                    </h3>
                    <p className="text-sm text-blue-600">
                      {doctor.specialization}
                    </p>
                    <p className="text-sm text-gray-500">
                      {doctor.experience} years experience
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <StarRating rating={doctor.rating} size="sm" />
                    <span className="text-sm text-gray-500">
                      ({doctor.totalReviews})
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    ${doctor.consultationFee}
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
                  onClick={() => setFilters({ ...filters, page: i + 1 })}
                  className={`px-4 py-2 rounded-lg ${
                    filters.page === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
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
