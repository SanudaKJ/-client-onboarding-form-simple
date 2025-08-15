"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardSchema, parseFormData } from "../lib/schema";
import Image from "next/image";

const SERVICE_OPTIONS = ["UI/UX", "Branding", "Web Dev", "Mobile App"];

export default function OnboardForm() {
  const [serverError, setServerError] = useState("");
  const [successData, setSuccessData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(onboardSchema),
    defaultValues: {
      fullName: "",
      email: "",
      companyName: "",
      services: [],
      budgetUsd: "",
      projectStartDate: new Date().toISOString().slice(0, 10),
      acceptTerms: false,
    },
  });

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const service = params.get("service");
      if (service) {
        const arr = decodeURIComponent(service)
          .split(",")
          .map((s) => s.trim());
        const allowed = arr.filter((a) => SERVICE_OPTIONS.includes(a));
        if (allowed.length > 0) {
          reset((prev) => ({ ...prev, services: allowed }));
        }
      }
    } catch (e) {}
  }, [reset]);

  async function onSubmit(rawData) {
    setServerError("");
    setSuccessData(null);
    setSubmitting(true);

    let payload;
    try {
      payload = parseFormData(rawData);
    } catch (err) {
      if (err?.issues) {
        err.issues.forEach((issue) => {
          const path = issue.path[0];
          setError(path, { type: "manual", message: issue.message });
        });
      } else {
        setServerError("Validation failed");
      }
      setSubmitting(false);
      return;
    }

    const endpoint = process.env.NEXT_PUBLIC_ONBOARD_URL;
    if (!endpoint) {
      setServerError("Server endpoint not configured.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessData(payload);
      } else {
        setServerError(`Server returned ${res.status}`);
      }
    } catch (err) {
      setServerError("Network error: " + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  }

  const watchedServices = watch("services") || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-1 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-25 h-25 bg-white rounded-full shadow-lg mb-6">
            <Image
              src="/assets/BestyLogo.jpg"
              alt="Besty International Logo"
              width={70}
              height={70}
              className="rounded-full object-cover"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to{" "}
            <span className="text-blue-600">Besty International</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let's get started with your project. Please provide some details
            about your requirements.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          noValidate
        >
          {/* Form */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white">
              Client Onboarding Form
            </h2>
            <p className="text-blue-100 mt-1">
              All fields marked with * are required
            </p>
          </div>

          <div className="p-8 space-y-8">
            {/* Status*/}
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm flex items-center">
                <div className="w-5 h-5 mr-3 text-red-500">⚠️</div>
                <strong>Error:</strong>&nbsp;{serverError}
              </div>
            )}

            {successData && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm">
                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 mr-3 text-green-500">✅</div>
                  <strong>Success!</strong>&nbsp;Your submission was received.
                </div>
                <details className="mt-3">
                  <summary className="cursor-pointer text-green-700 font-medium">
                    View submitted data
                  </summary>
                  <pre className="mt-2 text-xs bg-green-100 p-3 rounded-lg overflow-auto">
                    {JSON.stringify(successData, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            {/* Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register("fullName")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    {...register("companyName")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Your company name"
                  />
                  {errors.companyName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.companyName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Project Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Services Interested In *
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {SERVICE_OPTIONS.map((service) => (
                      <label
                        key={service}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          value={service}
                          {...register("services")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700 font-medium">
                          {service}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.services && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.services.message}
                    </p>
                  )}
                  <div className="mt-2 text-sm text-gray-600">
                    Selected:{" "}
                    {watchedServices.length > 0
                      ? watchedServices.join(", ")
                      : "None"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget (USD) - Optional
                  </label>
                  <input
                    type="number"
                    {...register("budgetUsd")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your budget"
                    min="100"
                    max="1000000"
                  />
                  {errors.budgetUsd && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.budgetUsd.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum budget: $100
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Start Date *
                  </label>
                  <input
                    type="date"
                    {...register("projectStartDate")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                  />
                  {errors.projectStartDate && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.projectStartDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms*/}
            <div className="border-t border-gray-200 pt-8 space-y-6">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register("acceptTerms")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <label className="text-sm text-gray-700">
                  I accept the{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    terms and conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    privacy policy
                  </a>{" "}
                  *
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-red-600 text-sm flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.acceptTerms.message}
                </p>
              )}

              {/*Button */}
              <button
                type="submit"
                disabled={submitting || isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {submitting || isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Submitting Application...
                  </div>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
