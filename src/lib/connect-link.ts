export interface ConnectLinkData {
  kudwa_id: string;
  kudwa_created_at: string;
  kudwa_updated_at: string;
  kudwa_deleted_at: string | null;
  integration_type: string | null;
  connection_id: string | number | null;
}

export interface ConnectLinkResponse {
  success: boolean;
  data: ConnectLinkData;
}

export async function verifyConnectLink(
  uuid: string
): Promise<ConnectLinkData> {
  const base = process.env.BACKEND_URL || "http://localhost:8000";
  const apiKey = process.env.OAUTH_API_KEY || "VumUPwZ3kthG4RYRTBw4";

  const res = await fetch(`${base}/connect-link/${uuid}`, {
    method: "GET",
    headers: {
      "api-key": apiKey,
    },
  });

  if (!res.ok) {
    throw new Error("Invalid connect link");
  }

  const json = (await res.json()) as ConnectLinkResponse;
  if (!json.success || !json.data) {
    throw new Error("Invalid connect link");
  }

  return json.data;
}

export async function updateConnectLink(
  uuid: string,
  integrationType: string,
  connectionId: number | null
): Promise<void> {
  const base = process.env.BACKEND_URL || "http://localhost:8000";
  const apiKey = process.env.OAUTH_API_KEY;
  if (!apiKey) {
    throw new Error("OAUTH_API_KEY is not set");
  }

  console.log("Updating connect link:", {
    url: `${base}/connect-link/${uuid}`,
    integration_type: integrationType,
    connection_id: connectionId,
  });

  const res = await fetch(`${base}/connect-link/${uuid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      integration_type: integrationType,
      connection_id: connectionId,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Update connect link failed:", res.status, text);
    throw new Error(`Failed to update connect link: ${res.status} ${text}`);
  }

  const json = await res.json();
  console.log("Update connect link response:", json);
}
