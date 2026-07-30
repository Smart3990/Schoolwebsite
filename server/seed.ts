import { db } from "./db";
import { users, newsPosts, siteSettings } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // 1. Check if admin user exists
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

  // 2. Check if we have any news posts
  const existingPosts = await db.select().from(newsPosts);

  if (existingPosts.length === 0) {
    console.log("Creating sample news posts...");

    const samplePosts = [
      {
        title: "Welcome to NVTI Kanda - Enrollment Now Open",
        content:
          "We are excited to announce that enrollment for the new academic year is now open. Join us to start your journey towards a successful vocational career with hands-on training and industry-ready skills.",
        excerpt:
          "We are excited to announce that enrollment for the new academic year is now open...",
        featuredImage:
          "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
        category: "Announcements",
        status: "published",
        date: new Date().toISOString().split("T")[0],
        author: "Admin",
      },
      {
        title: "Skills Competition Winners Announced",
        content:
          "Congratulations to our students who excelled in the national vocational skills competition. Their dedication and hard work have made NVTI Kanda proud.",
        excerpt:
          "Congratulations to our students who excelled in the national vocational skills competition...",
        featuredImage:
          "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
        category: "Events",
        status: "published",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        author: "Admin",
      },
      {
        title: "New Workshop Equipment Installed",
        content:
          "Our facilities have been upgraded with state-of-the-art workshop equipment to enhance hands-on learning experiences.",
        excerpt:
          "Our facilities have been upgraded with state-of-the-art workshop equipment...",
        featuredImage:
          "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
        category: "News",
        status: "published",
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        author: "Admin",
      },
      {
        title: "Industry Partnership Program Launch",
        content:
          "NVTI Kanda has partnered with leading industry employers to provide job placement opportunities for our graduates.",
        excerpt:
          "NVTI Kanda has partnered with leading industry employers to provide job placement opportunities...",
        featuredImage:
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
        category: "Achievements",
        status: "published",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        author: "Admin",
      },
    ];

    await db.insert(newsPosts).values(samplePosts);
    console.log(`✓ Created ${samplePosts.length} sample news posts`);
  } else {
    console.log(`✓ Database already has ${existingPosts.length} news posts`);
  }

  // 3. Populate or overwrite siteSettings with actual Unsplash images
  const defaultImages = {
    heroBannerImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80",
    aboutSectionImage:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    galleryImage1:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
    galleryImage2:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    galleryImage3:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    galleryImage4:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
    galleryImage5:
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80",
    galleryImage6:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    updatedAt: new Date().toISOString(),
  };

  const existingSettings = await db.select().from(siteSettings).limit(1);

  if (existingSettings.length === 0) {
    console.log("Creating default site settings with real images...");
    await db.insert(siteSettings).values(defaultImages);
    console.log("✓ Created default site settings with Unsplash images");
  } else {
    console.log("Updating existing site settings with real image URLs...");
    await db
      .update(siteSettings)
      .set(defaultImages)
      .where(eq(siteSettings.id, existingSettings[0].id));
    console.log("✓ Updated site settings with Unsplash images");
  }

  console.log("🎉 Database seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});
