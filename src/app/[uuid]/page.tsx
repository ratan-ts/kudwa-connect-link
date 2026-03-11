"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import PlatformSelectModal from "@/components/PlatformSelectModal";
import type { Integration } from "@/types/integration";
import type { ConnectLinkData } from "@/lib/connect-link";

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connected Successfully!
          </h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={() => window.location.reload()}
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
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

function AlreadyConnectedMessage({ 
  integrationType, 
  connectionId 
}: { 
  integrationType: string; 
  connectionId: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-black">
        <div className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invite Link Already Connected
          </h2>
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Integration Type:</span> {integrationType}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Connection ID:</span> {connectionId}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InvalidLinkMessage() {
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
            Invalid Connect Link
          </h2>
          <p className="text-gray-600 mb-6">
            This connection link is invalid or has expired.
          </p>
        </div>
      </div>
    </div>
  );
}

function IntegrationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const uuid = params?.uuid as string;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkData, setLinkData] = useState<ConnectLinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const success = searchParams.get("success");
  const errorParam = searchParams.get("error");
  const message = searchParams.get("message");

  useEffect(() => {
    async function checkLink() {
      if (!uuid) {
        setError("Invalid UUID");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/connect-link/${uuid}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        if (!res.ok) {
          throw new Error("Invalid connect link");
        }
        const json = await res.json();
        if (!json.success || !json.data) {
          throw new Error("Invalid connect link");
        }
        const data = json.data as ConnectLinkData;
        setLinkData(data);
        
        console.log("Connect link data:", data);
        
        // If already connected, don't show modal
        // Check if integration_type exists and connection_id is not null/empty
        if (data.integration_type && data.connection_id != null && data.connection_id !== "") {
          console.log("Link is already connected");
          setIsModalOpen(false);
        } else {
          console.log("Link is not connected, showing modal");
          // Show connection flow
          setIsModalOpen(true);
        }
      } catch (err) {
        setError("Invalid connect link");
      } finally {
        setLoading(false);
      }
    }

    checkLink();
  }, [uuid]);

  const handleIntegrationSelect = (integration: Integration) => {
    setIsModalOpen(false);
    router.push(`/api/oauth/start?integration=${integration.id}&kudwa_id=${uuid}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </main>
    );
  }

  if (error) {
    return <InvalidLinkMessage />;
  }

  if (success === "true") {
    return (
      <SuccessMessage message={decodeURIComponent(message || "Your account has been connected successfully.")} />
    );
  }

  if (errorParam) {
    return (
      <ErrorMessage message={decodeURIComponent(message || "Something went wrong. Please try again.")} />
    );
  }

  // If link is already connected
  // Check if integration_type exists and connection_id is not null/undefined/empty
  const isConnected = linkData?.integration_type && 
                      linkData.connection_id != null && 
                      linkData.connection_id !== "";
  
  if (isConnected && linkData.integration_type) {
    return (
      <AlreadyConnectedMessage 
        integrationType={linkData.integration_type}
        connectionId={String(linkData.connection_id)}
      />
    );
  }

  // Show connection flow
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

export default function ConnectLinkPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <IntegrationsContent />
    </Suspense>
  );
}
