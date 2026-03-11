"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import PlatformSelectModal from "@/components/PlatformSelectModal";
import type { Integration } from "@/types/integration";
import { INTEGRATIONS } from "@/lib/integrations";

function SuccessMessage({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-black">
        <div className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-black rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Connected Successfully!
          </h2>
          <button
            onClick={() => window.location.href = "/"}
            className="w-full px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-black">
        <div className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connection Failed
          </h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={() => window.location.href = "/"}
            className="w-full px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

function IntegrationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const success = searchParams.get("success");
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  const handleIntegrationSelect = (integration: Integration) => {
    setIsModalOpen(false);
    router.push(`/api/oauth/start?integration=${integration.id}`);
  };

  if (success === "true") {
    return (
      <SuccessMessage message={decodeURIComponent(message || "Your account has been connected successfully.")} />
    );
  }

  if (error) {
    return (
      <ErrorMessage message={decodeURIComponent(message || "Something went wrong. Please try again.")} />
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <PlatformSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleIntegrationSelect}
      />
    </main>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <IntegrationsContent />
    </Suspense>
  );
}
