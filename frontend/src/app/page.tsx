import Link from "next/link";
import {
  FiCalendar,
  FiMessageSquare,
  FiShield,
  FiSearch,
} from "react-icons/fi";

export default function HomePage() {
  const features = [
    {
      icon: <FiSearch className="w-8 h-8 text-blue-600" />,
      title: "Find Doctors",
      description:
        "Search specialists by specialty, rating, and availability. Find the right doctor for your needs.",
    },
    {
      icon: <FiCalendar className="w-8 h-8 text-blue-600" />,
      title: "Book Appointments",
      description:
        "Schedule appointments with available time slots. Get confirmed quickly and manage your bookings.",
    },
    {
      icon: <FiMessageSquare className="w-8 h-8 text-blue-600" />,
      title: "Online Consultations",
      description:
        "Chat with your doctor in real-time. Share files, images, and get instant medical advice.",
    },
    {
      icon: <FiShield className="w-8 h-8 text-blue-600" />,
      title: "Secure & Private",
      description:
        "Your health data is protected with industry-standard security. Role-based access control ensures privacy.",
    },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Health, Our Priority
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Access quality healthcare from anywhere. Consult with verified
              doctors, book appointments, and manage your medical records
              securely online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/doctors"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg border-2 border-white text-white hover:bg-white/10 transition-colors"
              >
                Find a Doctor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Digital Healthcare
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive tools for patients, doctors,
              and administrators.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                For Patients
              </h3>
              <p className="text-gray-600">
                Search doctors, book appointments, consult online, view
                prescriptions, and rate your experience.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                For Doctors
              </h3>
              <p className="text-gray-600">
                Manage your profile, set availability, accept appointments,
                conduct consultations, and issue prescriptions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                For Admins
              </h3>
              <p className="text-gray-600">
                Full platform control. Manage users, approve doctors, view
                analytics, and oversee all operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-semibold text-white mb-2">E-Healthcare</p>
          <p>Accessible, efficient, and secure online medical consultation services.</p>
        </div>
      </footer>
    </div>
  );
}
