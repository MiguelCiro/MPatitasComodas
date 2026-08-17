import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  console.log("🔥🔥🔥 PROXY:", request.nextUrl.pathname);

  return await updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};