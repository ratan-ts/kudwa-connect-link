import { NextRequest, NextResponse } from "next/server";
import { completeOAuthCallback } from "@/lib/backend-oauth";
import { updateConnectLink } from "@/lib/connect-link";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  
  // Get kudwa_id from cookie
  const kudwaId = request.cookies.get("kudwa_id")?.value;
  
  // Check for realmId/realmID (QuickBooks) or organization_id (other integrations)
  const realmId = searchParams.get("realmId") || searchParams.get("realmID");
  const organizationId = searchParams.get("organization_id");
  const orgId = realmId || organizationId;

  // Determine redirect URL - use kudwa_id if provided, otherwise default
  const redirectBase = kudwaId ? `${APP_URL}/${kudwaId}` : APP_URL;

  if (error) {
    const response = NextResponse.redirect(
      `${redirectBase}?error=${encodeURIComponent(error)}&message=${encodeURIComponent(errorDescription || "Authorization failed")}`
    );
    if (kudwaId) {
      response.cookies.delete("kudwa_id");
    }
    return response;
  }

  if (!code || !state) {
    const response = NextResponse.redirect(
      `${redirectBase}?error=missing_params&message=${encodeURIComponent("Missing code or state")}`
    );
    if (kudwaId) {
      response.cookies.delete("kudwa_id");
    }
    return response;
  }

  try {
    const variables =
      orgId != null && orgId !== ""
        ? { organization_id: orgId }
        : undefined;
    const callbackResponse = await completeOAuthCallback(code, state, variables);
    
    console.log("OAuth callback response:", callbackResponse);
    console.log("Kudwa ID from cookie:", kudwaId);
    
    // Update the connect link with integration_type and connection_id
    if (kudwaId && callbackResponse.integration_type && callbackResponse.connection_id) {
      console.log("Updating connect link:", {
        kudwaId,
        integration_type: callbackResponse.integration_type,
        connection_id: callbackResponse.connection_id,
      });
      try {
        await updateConnectLink(
          kudwaId,
          callbackResponse.integration_type,
          callbackResponse.connection_id
        );
        console.log("Successfully updated connect link");
      } catch (updateErr) {
        // Log error but don't fail the OAuth flow
        console.error("Failed to update connect link:", updateErr);
      }
    } else {
      console.warn("Skipping connect link update:", {
        hasKudwaId: !!kudwaId,
        hasIntegrationType: !!callbackResponse.integration_type,
        hasConnectionId: !!callbackResponse.connection_id,
      });
    }
    
    const response = NextResponse.redirect(
      `${redirectBase}?success=true&message=${encodeURIComponent("Connected successfully")}`
    );
    if (kudwaId) {
      response.cookies.delete("kudwa_id");
    }
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Callback failed";
    const response = NextResponse.redirect(
      `${redirectBase}?error=callback_failed&message=${encodeURIComponent(message)}`
    );
    if (kudwaId) {
      response.cookies.delete("kudwa_id");
    }
    return response;
  }
}
