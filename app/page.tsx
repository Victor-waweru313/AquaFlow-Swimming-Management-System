"use client";

import Link from "next/link";

export default function Home() {
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
          <Link href="/login" className="text-gray-600 hover:text-primary-700 transition-colors">Login</Link>
          <Link href="/register" className="text-gray-600 hover:text-primary-700 transition-colors">Sign Up</Link>
          <a href="#features" className="text-gray-600 hover:text-primary-700 transition-colors">Platform</a>
          <a href="#pricing" className="text-gray-600 hover:text-primary-700 transition-colors">Pricing</a>
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

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input-field"
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Role
                </label>
                <select className="input-field">
                  <option>Select a role...</option>
                  <option>Admin</option>
                  <option>Coach</option>
                  <option>Accountant</option>
                  <option>Swimmer</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full btn-primary bg-primary-700 hover:bg-primary-800 py-2.5"
              >
                Login
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <a href="#" className="text-accent-600 hover:text-accent-700 font-medium">
                Request Access
              </a>
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

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex items-center justify-between">
            <p>&copy; 2024 AquaFlow. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs">
              <span>Powered by Vercel</span>
              <span>Secure Auth by NextAuth.js</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
