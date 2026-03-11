import { NextRequest, NextResponse } from "next/server";
import { verifyConnectLink } from "@/lib/connect-link";

export async function GET(
  request: NextRequest,
  { params }: { params: { uuid: string } }
) {
  const uuid = params.uuid;

  if (!uuid) {
    return NextResponse.json(
      { error: "UUID is required" },
      { status: 400 }
    );
  }

  try {
    const data = await verifyConnectLink(uuid);
    const response = NextResponse.json({ success: true, data });
    // Disable caching
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid connect link";
    return NextResponse.json(
      { error: message },
      { status: 404 }
    );
  }
}
