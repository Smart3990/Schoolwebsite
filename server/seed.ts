import { db } from "./db";
import { users, newsPosts } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // Check if admin user exists
  const [existingAdmin] = await db
    .select()
    .from(users)
    .where(eq(users.username, "admin"));

  if (!existingAdmin) {
    console.log("Creating default admin user...");
    await db.insert(users).values({
      username: "admin",
      password: "admin123", // In production, this should be hashed
    });
    console.log("✓ Admin user created (username: admin, password: admin123)");
  } else {
    console.log("✓ Admin user already exists");
  }

  // Check if we have any news posts
  const existingPosts = await db.select().from(newsPosts);

  if (existingPosts.length === 0) {
    console.log("Creating sample news posts...");
    
    const samplePosts = [
      {
        title: "Welcome to NVTI Kanda - Enrollment Now Open",
        content: "We are excited to announce that enrollment for the new academic year is now open. Join us to start your journey towards a successful vocational career with hands-on training and industry-ready skills. Our programs are designed to equip you with the practical knowledge and expertise needed to excel in your chosen field.",
        excerpt: "We are excited to announce that enrollment for the new academic year is now open...",
        featuredImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
        category: "Announcements",
        status: "published",
        date: new Date().toISOString().split('T')[0],
        author: "Admin",
      },
      {
        title: "Skills Competition Winners Announced",
        content: "Congratulations to our students who excelled in the national vocational skills competition. Their dedication and hard work have made NVTI Kanda proud. Winners received awards and recognition for their outstanding performance in various technical categories including electrical installation, welding, and carpentry.",
        excerpt: "Congratulations to our students who excelled in the national vocational skills competition...",
        featuredImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
        category: "Events",
        status: "published",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        author: "Admin",
      },
      {
        title: "New Workshop Equipment Installed",
        content: "Our facilities have been upgraded with state-of-the-art workshop equipment to enhance hands-on learning experiences. The new equipment includes modern welding machines, electrical testing apparatus, and precision carpentry tools that will help students gain practical skills aligned with industry standards.",
        excerpt: "Our facilities have been upgraded with state-of-the-art workshop equipment...",
        featuredImage: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
        category: "News",
        status: "draft",
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        author: "Admin",
      },
      {
        title: "Industry Partnership Program Launch",
        content: "NVTI Kanda has partnered with leading industry employers to provide job placement opportunities for our graduates. This partnership program ensures that students have direct pathways to employment upon completing their training, with companies committed to hiring our skilled graduates.",
        excerpt: "NVTI Kanda has partnered with leading industry employers to provide job placement opportunities...",
        featuredImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
        category: "Achievements",
        status: "published",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        author: "Admin",
      },
    ];

    await db.insert(newsPosts).values(samplePosts);
    console.log(`✓ Created ${samplePosts.length} sample news posts`);
  } else {
    console.log(`✓ Database already has ${existingPosts.length} news posts`);
  }

  console.log("🎉 Database seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});
