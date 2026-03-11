import { NextRequest, NextResponse } from "next/server";
import type { IntegrationId } from "@/types/integration";
import {
  getBackendIntegrationName,
  initiateOAuth,
} from "@/lib/backend-oauth";

export async function GET(request: NextRequest) {
  const integration = request.nextUrl.searchParams.get(
    "integration"
  ) as IntegrationId | null;
  const companyId =
    request.nextUrl.searchParams.get("company_id") || "user123";
  const kudwaId = request.nextUrl.searchParams.get("kudwa_id");

  if (!integration || !["wafeq", "quickbooks-sandbox", "quickbooks"].includes(integration)) {
    return NextResponse.json(
      { error: "Invalid or missing integration" },
      { status: 400 }
    );
  }

  const integrationName = getBackendIntegrationName(integration);

  try {
    const { authorizationUrl } = await initiateOAuth(integrationName, companyId);
    
    // Create response with redirect
    const response = NextResponse.redirect(authorizationUrl);
    
    // Store kudwa_id in a cookie so we can retrieve it in the callback
    if (kudwaId) {
      console.log("Setting kudwa_id cookie:", kudwaId);
      response.cookies.set("kudwa_id", kudwaId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10, // 10 minutes
      });
    } else {
      console.warn("No kudwa_id provided in OAuth start");
    }
    
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "OAuth initiate failed";
    return NextResponse.json(
      { error: message },
      { status: 502 }
    );
  }
}
