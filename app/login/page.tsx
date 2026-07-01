"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const roleMap: Record<string, string> = {
        "admin@aquaflow.com": "ADMIN",
        "coach@aquaflow.com": "COACH",
        "accountant@aquaflow.com": "ACCOUNTANT",
        "swimmer@aquaflow.com": "SWIMMER",
      };

      const resolvedRole = roleMap[email.toLowerCase()] || role;

      const result = await signIn("credentials", {
        email,
        password,
        role: resolvedRole,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email, password, or role");
      } else if (result?.ok) {
        // Redirect based on user role
        const redirectMap: { [key: string]: string } = {
          ADMIN: "/dashboard",
          COACH: "/training",
          ACCOUNTANT: "/finances",
          SWIMMER: "/performance",
        };
        const targetPage = redirectMap[role] || redirectMap[resolvedRole] || "/dashboard";
        router.push(targetPage);
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">≈</span>
          </div>
          <span className="font-bold text-lg text-primary-700">AquaFlow</span>
        </div>
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

        {/* Right side - Login card */}
        <div className="bg-white flex flex-col justify-center px-12 py-16">
          <div className="max-w-sm mx-auto w-full">
            {/* Lock icon badge */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Sign in to manage your aquatic workflow
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-xs text-accent-600 hover:text-accent-700">
                    Forgot?
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Role
                </label>
                <select
                  className="input-field"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="COACH">Coach</option>
                  <option value="ACCOUNTANT">Accountant</option>
                  <option value="SWIMMER">Swimmer</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary bg-primary-700 hover:bg-primary-800 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Login"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link href="/register" className="text-accent-600 hover:text-accent-700 font-medium">
                Create Account
              </Link>
            </p>

            <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>🔒</span>
                <span>SSL Secure</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>☁️</span>
                <span>Cloud Synced</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
