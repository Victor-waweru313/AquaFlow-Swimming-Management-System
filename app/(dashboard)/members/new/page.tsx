"use client";

import { TopBar } from "@/components/TopBar";
import { Breadcrumb } from "@/components/Breadcrumb";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "Male",
    contact: "",
    email: "",
    membershipType: "STANDARD",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/swimmers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/members");
      } else {
        alert("Failed to create member");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <TopBar title="Swimmer Registration" showSearch={false} />

      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 space-y-6 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Members", href: "/members" },
              { label: "Add New Member" },
            ]}
          />

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Swimmer Registration</h1>
            <p className="text-gray-600 text-sm mt-1">Complete the form below to register a new swimmer</p>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center gap-3">
            <span className="text-lg">ℹ️</span>
            <p className="text-sm text-blue-800">
              <strong>Active Session: Coach Marcus</strong> — This registration will be saved for immediate availability.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Photo Upload */}
              <div className="card p-6">
                <label className="block text-sm font-medium text-gray-900 mb-4">Member Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-accent-500 transition-colors cursor-pointer">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-sm text-gray-600">Drag and drop or click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </div>

              {/* Quick Tips */}
              <div className="card p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-3">💡 Quick Tips</h3>
                <ul className="text-xs text-amber-800 space-y-2">
                  <li>• Use legal names for accurate record keeping</li>
                  <li>• Age will be calculated from DOB</li>
                  <li>• Elite membership requires approval from management</li>
                </ul>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="col-span-2">
              <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="First and last name"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                {/* Gender and Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="input-field"
                    required
                  />
                </div>

                {/* Membership Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Membership Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { type: "STANDARD", name: "Standard", desc: "Entry-level access", price: "$50/mo" },
                      { type: "PREMIUM", name: "Premium", desc: "Priority scheduling", price: "$100/mo", popular: true },
                      { type: "ELITE", name: "Elite", desc: "Exclusive coaching", price: "$150/mo" },
                    ].map((tier) => (
                      <button
                        key={tier.type}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, membershipType: tier.type }))}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.membershipType === tier.type
                            ? "border-accent-500 bg-accent-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-sm text-gray-900">{tier.name}</p>
                          {tier.popular && (
                            <span className="text-xs font-bold bg-accent-100 text-accent-700 px-2 py-0.5 rounded">
                              POPULAR
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{tier.desc}</p>
                        <p className="font-semibold text-accent-600 text-sm">{tier.price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 font-medium text-sm disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
