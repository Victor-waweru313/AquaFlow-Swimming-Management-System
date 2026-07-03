import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "COACH", "ACCOUNTANT", "SWIMMER"]),
  dob: z.string(),
  contact: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    const { name, email, password, role, dob, contact } = validation.data;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return Response.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role,
      },
    });

    if (role === "SWIMMER") {
      const count = await db.swimmer.count();
      const swimmerCode = `AF-${1000 + count + 1}`;

      await db.swimmer.create({
        data: {
          swimmerCode,
          name,
          email: normalizedEmail,
          dob: new Date(dob),
          gender: "Not specified",
          membershipType: "STANDARD",
          status: "ACTIVE",
          contact: contact || "",
          userId: user.id,
        },
      });
    }

    return Response.json(
      {
        message: "Registration successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
