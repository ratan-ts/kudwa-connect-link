"use client";

import { useState, useMemo } from "react";
import { INTEGRATIONS } from "@/lib/integrations";
import type { Integration } from "@/types/integration";

interface PlatformSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (integration: Integration) => void;
}

// Logo component that displays logo image or falls back to initials
function PlatformLogo({ name, logo }: { name: string; logo?: string }) {
  const getInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (logo) {
    return (
      <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-gray-200">
        <img
          src={logo}
          alt={name}
          className="w-full h-full object-contain p-2"
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              parent.className = "w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg";
              parent.textContent = getInitials(name);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg">
      {getInitials(name)}
    </div>
  );
}

export default function PlatformSelectModal({
  isOpen,
  onClose,
  onSelect,
}: PlatformSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);

  const filteredIntegrations = useMemo(() => {
    if (!searchQuery.trim()) return INTEGRATIONS;
    const query = searchQuery.toLowerCase();
    return INTEGRATIONS.filter(
      (integration) =>
        integration.name.toLowerCase().includes(query) ||
        integration.description.toLowerCase().includes(query) ||
        integration.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleContinue = () => {
    if (selectedIntegration) {
      onSelect(selectedIntegration);
      setSelectedIntegration(null);
      setSearchQuery("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-black relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black">
          <div className="flex items-center gap-8">
            <img
              src="/Kudwa-Prod.png"
              alt="Kudwa"
              className="h-6 w-auto"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Select your platform
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Link your account.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
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
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 pt-6 pb-3">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 backdrop-blur-sm bg-white/50 rounded-full p-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search Integration"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Platform Grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-24">
          {filteredIntegrations.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p>No integrations found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIntegrations.map((integration) => {
                const isSelected = selectedIntegration?.id === integration.id;
                return (
                  <button
                    key={integration.id}
                    onClick={() => setSelectedIntegration(integration)}
                    className={`relative p-6 border rounded-xl transition-all text-left ${
                      isSelected
                        ? "border-black bg-gray-50 shadow-lg"
                        : "border-gray-100 bg-white hover:shadow-lg hover:border-black"
                    }`}
                    style={{ borderRadius: "12px" }}
                  >
                    {/* Check Badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="flex flex-col items-center text-center">
                      <PlatformLogo name={integration.name} logo={integration.logo} />
                      <h3 className="font-bold text-gray-900 mt-4 mb-1">
                        {integration.name}
                      </h3>
                      <p className="text-sm text-gray-500">{integration.category}</p>
                    </div>
                  </button>
                );
              })}

            </div>
          )}
        </div>

        {/* Fixed Continue Button */}
        <div className="absolute bottom-6 right-6">
          <button
            onClick={handleContinue}
            disabled={!selectedIntegration}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg ${
              selectedIntegration
                ? "bg-black text-white hover:shadow-xl hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
