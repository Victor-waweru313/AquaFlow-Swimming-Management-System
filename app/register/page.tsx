"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    contact: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.dob) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Create the user account
      const normalizedEmail = formData.email.toLowerCase();
      const createRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: normalizedEmail,
          password: formData.password,
          role: "SWIMMER",
          dob: formData.dob,
          contact: formData.contact,
        }),
      });

      if (!createRes.ok) {
        const data = await createRes.json();
        setError(data.error || "Registration failed");
        return;
      }

      // Auto-login after registration
      const result = await signIn("credentials", {
        email: normalizedEmail,
        password: formData.password,
        role: "SWIMMER",
        redirect: false,
      });

      if (result?.error) {
        setError(
          result.error
            ? `Account created but login failed: ${result.error}. Please login manually.`
            : "Account created but login failed. Please login manually."
        );
      } else if (result?.ok) {
        // Redirect swimmer to performance page
        router.push("/performance");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">≈</span>
          </div>
          <span className="font-bold text-lg text-primary-700">AquaFlow</span>
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/" className="text-gray-600 hover:text-primary-700 transition-colors">
            Home
          </Link>
          <a href="#" className="text-gray-600 hover:text-primary-700 transition-colors">
            Platform
          </a>
          <a href="#" className="text-gray-600 hover:text-primary-700 transition-colors">
            Pricing
          </a>
          <button className="px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 transition-colors">
            Contact Sales
          </button>
        </div>
      </nav>

      <section className="grid grid-cols-2 min-h-[calc(100vh-80px)]">
        {/* Left side - Pool image with overlay */}
        <div className="relative bg-gradient-to-br from-primary-900 via-primary-700 to-primary-600 flex flex-col justify-center px-12 py-16">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <div className="relative z-20">
            <div className="inline-block mb-4 px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium">
              Professional Grade
            </div>
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Centralized Digital Platform for Swimming Excellence
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Real-time attendance tracking, performance analytics, and financial management for swimming organizations.
            </p>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg">
                <span className="text-xl">⚡</span>
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg">
                <span className="text-xl">🔒</span>
                <span>Bank-grade Security</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Registration card */}
        <div className="bg-white flex flex-col justify-center px-12 py-16">
          <div className="max-w-sm mx-auto w-full">
            {/* User icon badge */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Join AquaFlow
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Create your account and track your swimming progress
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-accent-600 hover:text-accent-700 font-medium">
                Sign In
              </Link>
            </p>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
              <span className="text-xs text-gray-600">🔒 SSL Secure</span>
              <span className="text-xs text-gray-600">☁️ Cloud Synced</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
