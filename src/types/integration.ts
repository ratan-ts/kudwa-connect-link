export type IntegrationId = "wafeq" | "quickbooks-sandbox" | "quickbooks";

export interface Integration {
  id: IntegrationId;
  name: string;
  description: string;
  logo?: string;
  category: string;
}

export interface StoredTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  integrationId: IntegrationId;
}
