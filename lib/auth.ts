import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

type DemoUserRole = "ADMIN" | "COACH" | "ACCOUNTANT" | "SWIMMER";

type DemoUser = {
  id: string;
  email: string;
  name: string;
  role: DemoUserRole;
  passwordHash: string;
  avatarUrl?: string | null;
};

const demoUsers = new Map<string, DemoUser>();

for (const user of [
  {
    id: "demo-admin",
    email: "admin@aquaflow.com",
    name: "Admin User",
    role: "ADMIN" as DemoUserRole,
    passwordHash: "demo:password123",
  },
  {
    id: "demo-coach",
    email: "coach@aquaflow.com",
    name: "Coach User",
    role: "COACH" as DemoUserRole,
    passwordHash: "demo:password123",
  },
  {
    id: "demo-accountant",
    email: "accountant@aquaflow.com",
    name: "Accountant User",
    role: "ACCOUNTANT" as DemoUserRole,
    passwordHash: "demo:password123",
  },
  {
    id: "demo-swimmer",
    email: "swimmer@aquaflow.com",
    name: "Swimmer User",
    role: "SWIMMER" as DemoUserRole,
    passwordHash: "demo:password123",
  },
]) {
  demoUsers.set(user.email.toLowerCase(), user);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  password: string,
  hash: string
): Promise<boolean> {
  if (hash.startsWith("demo:")) {
    return password === hash.slice(5);
  }

  return bcrypt.compare(password, hash);
}

export async function findDemoUserByEmail(email: string) {
  return demoUsers.get(email.toLowerCase()) ?? null;
}

export async function registerDemoUser({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password: string;
  role: DemoUserRole;
}) {
  const normalizedEmail = email.toLowerCase();
  if (demoUsers.has(normalizedEmail)) {
    return null;
  }

  const user: DemoUser = {
    id: `demo-${Date.now()}`,
    email: normalizedEmail,
    name,
    role,
    passwordHash: `demo:${password}`,
  };

  demoUsers.set(normalizedEmail, user);
  return user;
}
