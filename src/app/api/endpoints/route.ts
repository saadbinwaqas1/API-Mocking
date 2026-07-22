import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch all endpoints for logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const endpoints = await prisma.apiEndpoint.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(endpoints);
  } catch (error) {
    console.error("GET endpoints error:", error);
    return NextResponse.json(
      { error: "Failed to fetch endpoints" },
      { status: 500 }
    );
  }
}

// POST: Create a new mock endpoint
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { name, slug, httpMethod, statusCode, delayMs, responseBody } =
      await req.json();

    if (!name || !slug || !responseBody) {
      return NextResponse.json(
        { error: "Name, slug, and response body are required" },
        { status: 400 }
      );
    }

    // Format slug (lowercase, alphanumeric + hyphens)
    const formattedSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    // Check slug uniqueness
    const existing = await prisma.apiEndpoint.findUnique({
      where: { slug: formattedSlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists. Please choose a unique slug." },
        { status: 400 }
      );
    }

    // Validate JSON format
    try {
      JSON.parse(responseBody);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in response body" },
        { status: 400 }
      );
    }

    const newEndpoint = await prisma.apiEndpoint.create({
      data: {
        name,
        slug: formattedSlug,
        httpMethod: httpMethod || "GET",
        statusCode: Number(statusCode) || 200,
        delayMs: Number(delayMs) || 0,
        responseBody,
        userId,
      },
    });

    return NextResponse.json(newEndpoint, { status: 201 });
  } catch (error) {
    console.error("POST endpoint error:", error);
    return NextResponse.json(
      { error: "Failed to create endpoint" },
      { status: 500 }
    );
  }
}
