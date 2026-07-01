"use client";

import { TopBar } from "@/components/TopBar";
import { Breadcrumb } from "@/components/Breadcrumb";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Swimmer {
  id: string;
  swimmerCode: string;
  name: string;
  email: string;
  dob: string;
  gender: string;
  membershipType: string;
  status: string;
  photoUrl: string | null;
  contact: string;
}

export default function ManageMemberPage() {
  const router = useRouter();
  const params = useParams();
  const swimmerId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [swimmer, setSwimmer] = useState<Swimmer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "Male",
    contact: "",
    email: "",
    membershipType: "STANDARD",
  });

  useEffect(() => {
    async function fetchSwimmer() {
      try {
        const res = await fetch(`/api/swimmers/${swimmerId}`);
        if (res.ok) {
          const data = await res.json();
          setSwimmer(data);
          setFormData({
            name: data.name,
            dob: new Date(data.dob).toISOString().split("T")[0],
            gender: data.gender,
            contact: data.contact,
            email: data.email,
            membershipType: data.membershipType,
          });
        }
      } catch (error) {
        console.error("Error fetching swimmer:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSwimmer();
  }, [swimmerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/swimmers/${swimmerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/members");
      } else {
        alert("Failed to update member");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <>
        <TopBar title="Member Profile" showSearch={false} />
        <div className="flex items-center justify-center h-96">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (!swimmer) {
    return (
      <>
        <TopBar title="Member Profile" showSearch={false} />
        <div className="flex items-center justify-center h-96">
          <p>Swimmer not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title={`${swimmer.name} - Member Profile`} showSearch={false} />

      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 space-y-6 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Members", href: "/members" },
              { label: "Edit Member" },
            ]}
          />

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Member</h1>
            <p className="text-gray-600 text-sm mt-1">Update swimmer information and membership details</p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Member Info Card */}
              <div className="card p-6">
                <img
                  src={swimmer.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${swimmer.name}`}
                  alt={swimmer.name}
                  className="w-full h-48 rounded-lg object-cover mb-4"
                />
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Swimmer Code</p>
                    <p className="text-lg font-bold text-primary-700">{swimmer.swimmerCode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Status</p>
                    <p className="text-sm font-medium">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        swimmer.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {swimmer.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Change Photo */}
              <div className="card p-6">
                <label className="block text-sm font-medium text-gray-900 mb-4">Update Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-accent-500 transition-colors cursor-pointer">
                  <div className="text-3xl mb-2">📸</div>
                  <p className="text-xs text-gray-600">Click to upload</p>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
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
                      { type: "PREMIUM", name: "Premium", desc: "Priority scheduling", price: "$100/mo" },
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
                        <p className="font-semibold text-sm text-gray-900">{tier.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{tier.desc}</p>
                        <p className="font-semibold text-accent-600 text-sm mt-2">{tier.price}</p>
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
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 font-medium text-sm disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Save Changes"}
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
