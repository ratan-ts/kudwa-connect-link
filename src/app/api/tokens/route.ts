import { NextRequest, NextResponse } from "next/server";
import type { IntegrationId } from "@/types/integration";
import { storeTokens, getStoredTokens } from "@/lib/token-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { integrationId, accessToken, refreshToken, expiresAt } = body as {
      integrationId: IntegrationId;
      accessToken: string;
      refreshToken?: string;
      expiresAt?: number;
    };

    if (!integrationId || !accessToken) {
      return NextResponse.json(
        { error: "integrationId and accessToken required" },
        { status: 400 }
      );
    }

    storeTokens({
      integrationId,
      accessToken,
      refreshToken,
      expiresAt,
    });

    return NextResponse.json({ stored: true, integrationId });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const integrationId = request.nextUrl.searchParams.get(
    "integrationId"
  ) as IntegrationId | null;
  if (!integrationId) {
    const entries = (getStoredTokens() as Array<{ integrationId: IntegrationId; accessToken: string }>) || [];
    return NextResponse.json({
      tokens: entries.map((v) => ({
        integrationId: v.integrationId,
        hasAccessToken: !!v.accessToken,
      })),
    });
  }
  const stored = getStoredTokens(integrationId) as { integrationId: IntegrationId; accessToken: string; refreshToken?: string; expiresAt?: number } | null;
  if (!stored) {
    return NextResponse.json({ stored: false }, { status: 404 });
  }
  return NextResponse.json({
    stored: true,
    integrationId: stored.integrationId,
    hasAccessToken: true,
    hasRefreshToken: !!stored.refreshToken,
    expiresAt: stored.expiresAt,
  });
}
