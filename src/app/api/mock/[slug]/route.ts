import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Handler for all HTTP methods (GET, POST, PUT, DELETE, PATCH)
async function handleMockRequest(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // 1. Fetch matching mock endpoint from DB
    const endpoint = await prisma.apiEndpoint.findUnique({
      where: { slug },
    });

    // 2. Check if endpoint exists and is active
    if (!endpoint || !endpoint.isActive) {
      return NextResponse.json(
        {
          error: "Mock API Endpoint Not Found or Deactivated",
          slug,
          timestamp: new Date().toISOString(),
        },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // 3. Apply Simulated Latency/Delay if set (e.g. 2000ms)
    if (endpoint.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, endpoint.delayMs));
    }

    // 4. Increment Call Count asynchronously in background
    prisma.apiEndpoint
      .update({
        where: { id: endpoint.id },
        data: { callCount: { increment: 1 } },
      })
      .catch((err: unknown) => console.error("Error updating call count:", err));

    // 5. Parse JSON response body safely
    let responseJson = {};
    try {
      responseJson = JSON.parse(endpoint.responseBody);
    } catch {
      responseJson = { raw: endpoint.responseBody };
    }

    // 6. Return exact configured HTTP status code & CORS headers for frontend/mobile apps
    return NextResponse.json(responseJson, {
      status: endpoint.statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Mock Engine Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error in Mock Engine" },
      { status: 500 }
    );
  }
}

// Handle CORS Preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export const GET = handleMockRequest;
export const POST = handleMockRequest;
export const PUT = handleMockRequest;
export const DELETE = handleMockRequest;
export const PATCH = handleMockRequest;
