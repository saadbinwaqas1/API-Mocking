import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE endpoint by ID
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as { id: string }).id;

    const endpoint = await prisma.apiEndpoint.findUnique({
      where: { id },
    });

    if (!endpoint || endpoint.userId !== userId) {
      return NextResponse.json(
        { error: "Endpoint not found or permission denied" },
        { status: 404 }
      );
    }

    await prisma.apiEndpoint.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Endpoint deleted successfully" });
  } catch (error) {
    console.error("DELETE endpoint error:", error);
    return NextResponse.json(
      { error: "Failed to delete endpoint" },
      { status: 500 }
    );
  }
}

// PATCH endpoint (e.g. toggle isActive or update values)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as { id: string }).id;
    const body = await req.json();

    const endpoint = await prisma.apiEndpoint.findUnique({
      where: { id },
    });

    if (!endpoint || endpoint.userId !== userId) {
      return NextResponse.json(
        { error: "Endpoint not found or permission denied" },
        { status: 404 }
      );
    }

    const updated = await prisma.apiEndpoint.update({
      where: { id },
      data: {
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.name && { name: body.name }),
        ...(body.httpMethod && { httpMethod: body.httpMethod }),
        ...(body.statusCode !== undefined && { statusCode: Number(body.statusCode) }),
        ...(body.delayMs !== undefined && { delayMs: Number(body.delayMs) }),
        ...(body.responseBody && { responseBody: body.responseBody }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH endpoint error:", error);
    return NextResponse.json(
      { error: "Failed to update endpoint" },
      { status: 500 }
    );
  }
}
