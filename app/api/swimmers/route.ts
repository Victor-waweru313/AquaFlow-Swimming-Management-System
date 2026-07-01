import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const swimmers = await db.swimmer.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(swimmers);
  } catch (error) {
    console.error("Error fetching swimmers:", error);
    return NextResponse.json(
      { error: "Failed to fetch swimmers" },
      { status: 500 }
    );
  }
}

const createSwimmerSchema = z.object({
  name: z.string().min(1),
  dob: z.string(),
  gender: z.string(),
  contact: z.string(),
  email: z.string().email(),
  membershipType: z.enum(["STANDARD", "PREMIUM", "ELITE"]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createSwimmerSchema.parse(body);

    // Generate swimmer code
    const lastSwimmer = await db.swimmer.findFirst({
      orderBy: { swimmerCode: "desc" },
      select: { swimmerCode: true },
    });

    let nextCode = 1000;
    if (lastSwimmer) {
      const currentNumber = parseInt(lastSwimmer.swimmerCode.split("-")[1]);
      nextCode = currentNumber + 1;
    }

    const swimmer = await db.swimmer.create({
      data: {
        swimmerCode: `AF-${nextCode}`,
        name: validatedData.name,
        dob: new Date(validatedData.dob),
        gender: validatedData.gender,
        contact: validatedData.contact,
        email: validatedData.email,
        membershipType: validatedData.membershipType,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(swimmer);
  } catch (error) {
    console.error("Error creating swimmer:", error);
    return NextResponse.json(
      { error: "Failed to create swimmer" },
      { status: 500 }
    );
  }
}
