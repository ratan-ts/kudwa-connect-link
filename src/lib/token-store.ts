import type { IntegrationId } from "@/types/integration";

export interface StoredTokenEntry {
  integrationId: IntegrationId;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

const tokenStore = new Map<string, StoredTokenEntry>();

export function storeTokens(entry: StoredTokenEntry): void {
  const key = `tokens:${entry.integrationId}`;
  tokenStore.set(key, entry);
}

export function getStoredTokens(integrationId?: IntegrationId): StoredTokenEntry | StoredTokenEntry[] | null {
  if (integrationId) {
    return tokenStore.get(`tokens:${integrationId}`) ?? null;
  }
  return Array.from(tokenStore.values());
}
