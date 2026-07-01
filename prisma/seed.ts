import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Clear existing data
  await prisma.trainingGoal.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.performanceRecord.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.sessionEnrollment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.lane.deleteMany();
  await prisma.coach.deleteMany();
  await prisma.swimmer.deleteMany();
  await prisma.pool.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@aquaflow.com",
      name: "Admin User",
      passwordHash: await hashPassword("password123"),
      role: "ADMIN",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
  });

  const coachUser = await prisma.user.create({
    data: {
      email: "coach@aquaflow.com",
      name: "Coach Marcus",
      passwordHash: await hashPassword("password123"),
      role: "COACH",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=coach",
    },
  });

  const accountantUser = await prisma.user.create({
    data: {
      email: "accountant@aquaflow.com",
      name: "Accountant",
      passwordHash: await hashPassword("password123"),
      role: "ACCOUNTANT",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=accountant",
    },
  });

  const swimmerUser = await prisma.user.create({
    data: {
      email: "swimmer@aquaflow.com",
      name: "Alex Johnson",
      passwordHash: await hashPassword("password123"),
      role: "SWIMMER",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=swimmer",
    },
  });

  // Create coach
  const coach = await prisma.coach.create({
    data: {
      name: "Coach Sarah Jenkins",
      specialty: "Freestyle",
      phone: "555-0101",
      photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      userId: coachUser.id,
    },
  });

  // Create pools
  const mainPool = await prisma.pool.create({
    data: {
      name: "Main Olympic Tank",
      location: "Central Facility",
    },
  });

  const trainingPool = await prisma.pool.create({
    data: {
      name: "Training Hub North",
      location: "North Campus",
    },
  });

  const warmupPool = await prisma.pool.create({
    data: {
      name: "Private Warmup Pool",
      location: "East Wing",
    },
  });

  // Create lanes
  const lanes = [];
  for (let i = 1; i <= 8; i++) {
    const lane = await prisma.lane.create({
      data: {
        laneNumber: i,
        focusArea: i <= 4 ? "Competitive" : "Training",
        status: "ACTIVE",
        poolId: mainPool.id,
      },
    });
    lanes.push(lane);
  }

  // Create swimmers
  const swimmers = [];
  const swimmerNames = [
    { name: "Ethan Mitchell", email: "ethan@example.com" },
    { name: "Sarah Chen", email: "sarah@example.com" },
    { name: "Marcus Thompson", email: "marcus@example.com" },
    { name: "Jessica Rivera", email: "jessica@example.com" },
    { name: "David Kim", email: "david@example.com" },
    { name: "Emma Wilson", email: "emma@example.com" },
    { name: "James Brown", email: "james@example.com" },
    { name: "Sophia Martinez", email: "sophia@example.com" },
    { name: "Michael Lee", email: "michael@example.com" },
    { name: "Isabella Garcia", email: "isabella@example.com" },
  ];

  for (let i = 0; i < swimmerNames.length; i++) {
    const swimmer = await prisma.swimmer.create({
      data: {
        swimmerCode: `AF-${1000 + i}`,
        name: swimmerNames[i].name,
        email: swimmerNames[i].email,
        dob: new Date(2005 + Math.floor(i / 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        gender: i % 2 === 0 ? "Male" : "Female",
        contact: `555-${1000 + i}`,
        membershipType: i < 4 ? "ELITE" : i < 7 ? "PREMIUM" : "STANDARD",
        status: "ACTIVE",
        photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${swimmerNames[i].name}`,
        userId: i === 0 ? swimmerUser.id : undefined,
      },
    });
    swimmers.push(swimmer);
  }

  // Create sessions
  const today = new Date();
  const sessions = [];

  // Session 1: Elite Performance Squad - Morning
  const session1 = await prisma.session.create({
    data: {
      name: "Elite Performance Squad - Morning",
      sessionDate: today,
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 30),
      sessionType: "COMPETITIVE",
      capacity: 24,
      poolId: mainPool.id,
      coachId: coach.id,
    },
  });
  sessions.push(session1);

  // Session 2: Junior Academy
  const session2 = await prisma.session.create({
    data: {
      name: "Junior Academy",
      sessionDate: today,
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 30),
      sessionType: "JUNIOR_ACADEMY",
      capacity: 20,
      poolId: trainingPool.id,
      coachId: coach.id,
    },
  });
  sessions.push(session2);

  // Enroll swimmers in sessions
  for (let i = 0; i < Math.min(18, swimmers.length); i++) {
    await prisma.sessionEnrollment.create({
      data: {
        swimmerId: swimmers[i].id,
        sessionId: session1.id,
        laneId: lanes[i % lanes.length].id,
      },
    });
  }

  for (let i = 0; i < Math.min(15, swimmers.length); i++) {
    await prisma.sessionEnrollment.create({
      data: {
        swimmerId: swimmers[i].id,
        sessionId: session2.id,
        laneId: lanes[i % lanes.length].id,
      },
    });
  }

  // Create attendance records
  for (const swimmer of swimmers.slice(0, 5)) {
    await prisma.attendance.create({
      data: {
        swimmerId: swimmer.id,
        sessionId: session1.id,
        checkIn: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6, 5),
        checkOut: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 30),
        status: "ATTENDED",
      },
    });
  }

  // Create performance records
  for (let i = 0; i < swimmers.length; i++) {
    const records = [
      { event: "100m Freestyle", time: 55 + Math.random() * 15, rank: "A+" },
      { event: "200m Freestyle", time: 120 + Math.random() * 30, rank: "A" },
      { event: "50m Freestyle", time: 25 + Math.random() * 8, rank: "B+" },
    ];

    for (const record of records) {
      await prisma.performanceRecord.create({
        data: {
          swimmerId: swimmers[i].id,
          event: record.event,
          date: new Date(today.getFullYear(), today.getMonth(), Math.max(1, today.getDate() - Math.floor(Math.random() * 30))),
          timeSeconds: record.time,
          rank: record.rank,
        },
      });
    }
  }

  // Create payments
  for (let i = 0; i < swimmers.length; i++) {
    const statuses: ("PAID" | "PENDING")[] = ["PAID", "PENDING"];
    await prisma.payment.create({
      data: {
        swimmerId: swimmers[i].id,
        amount: swimmers[i].membershipType === "ELITE" ? 150 : swimmers[i].membershipType === "PREMIUM" ? 100 : 50,
        status: statuses[Math.floor(Math.random() * 2)],
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - Math.floor(Math.random() * 5)),
        description: `Monthly membership - ${swimmers[i].membershipType}`,
      },
    });
  }

  // Create training goals
  for (const swimmer of swimmers) {
    await prisma.trainingGoal.create({
      data: {
        swimmerId: swimmer.id,
        description: "Improve 100m Freestyle time",
        month: today.getMonth() + 1,
        year: today.getFullYear(),
        completed: Math.random() > 0.5,
        progressNote: "On track for completion",
      },
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
