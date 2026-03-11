import type { IntegrationId } from "@/types/integration";

const INTEGRATION_NAME_MAP: Record<IntegrationId, string> = {
  "quickbooks-sandbox": "QUICKBOOKS_SANDBOX",
  quickbooks: "QUICKBOOKS",
  wafeq: "WAFEQ",
};

export function getBackendIntegrationName(integrationId: IntegrationId): string {
  return INTEGRATION_NAME_MAP[integrationId] ?? integrationId.toUpperCase();
}

export async function initiateOAuth(
  integrationName: string,
  companyId: string
): Promise<{ authorizationUrl: string; state: string }> {
  const base = process.env.BACKEND_URL || "http://localhost:8000";
  const apiKey = process.env.OAUTH_API_KEY;
  if (!apiKey) {
    throw new Error("OAUTH_API_KEY is not set");
  }

  const res = await fetch(`${base}/oauth/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      integration_name: integrationName,
      company_id: companyId,
      type: "SDK",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Initiate failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as {
    success?: boolean;
    data?: { authorization_url: string; state: string };
  };
  if (!json.success || !json.data?.authorization_url) {
    throw new Error("Invalid initiate response");
  }
  return {
    authorizationUrl: json.data.authorization_url,
    state: json.data.state,
  };
}

export interface OAuthCallbackResponse {
  integration_type: string;
  connection_id: number;
}

export async function completeOAuthCallback(
  authorizationCode: string,
  state: string,
  variables?: { organization_id?: string }
): Promise<OAuthCallbackResponse> {
  const base = process.env.BACKEND_URL || "http://localhost:8000";
  const apiKey = process.env.OAUTH_API_KEY;
  if (!apiKey) {
    throw new Error("OAUTH_API_KEY is not set");
  }

  const body: {
    authorization_code: string;
    state: string;
    variables: { organization_id?: string };
  } = { 
    authorization_code: authorizationCode, 
    state,
    variables: variables || {}
  };

  const res = await fetch(`${base}/oauth/callback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Callback failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as {
    success?: boolean;
    data?: OAuthCallbackResponse;
  };

  if (!json.success || !json.data) {
    throw new Error("Invalid callback response");
  }

  return json.data;
}
