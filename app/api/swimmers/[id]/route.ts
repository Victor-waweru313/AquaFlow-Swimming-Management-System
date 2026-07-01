import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const swimmer = await db.swimmer.findUnique({
      where: { id: params.id },
    });

    if (!swimmer) {
      return NextResponse.json(
        { error: "Swimmer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(swimmer);
  } catch (error) {
    console.error("Error fetching swimmer:", error);
    return NextResponse.json(
      { error: "Failed to fetch swimmer" },
      { status: 500 }
    );
  }
}

const updateSwimmerSchema = z.object({
  name: z.string().min(1).optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().email().optional(),
  membershipType: z.enum(["STANDARD", "PREMIUM", "ELITE"]).optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validatedData = updateSwimmerSchema.parse(body);

    const updatePayload: any = { ...validatedData };
    if (validatedData.dob) {
      updatePayload.dob = new Date(validatedData.dob);
    }

    const swimmer = await db.swimmer.update({
      where: { id: params.id },
      data: updatePayload,
    });

    return NextResponse.json(swimmer);
  } catch (error) {
    console.error("Error updating swimmer:", error);
    return NextResponse.json(
      { error: "Failed to update swimmer" },
      { status: 500 }
    );
  }
}
