import {
  type User,
  type InsertUser,
  type NewsPost,
  type InsertNewsPost,
  type Media,
  type InsertMedia,
  type ContactSubmission,
  type InsertContactSubmission,
  type SiteSettings,
  type InsertSiteSettings,
  users,
  newsPosts,
  media,
  contactSubmissions,
  siteSettings,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // News posts methods
  getAllNewsPosts(): Promise<NewsPost[]>;
  getNewsPost(id: string): Promise<NewsPost | undefined>;
  createNewsPost(post: InsertNewsPost): Promise<NewsPost>;
  updateNewsPost(id: string, post: Partial<InsertNewsPost>): Promise<NewsPost | undefined>;
  deleteNewsPost(id: string): Promise<boolean>;

  // Media methods
  getAllMedia(): Promise<Media[]>;
  getMedia(id: string): Promise<Media | undefined>;
  createMedia(media: InsertMedia): Promise<Media>;
  deleteMedia(id: string): Promise<boolean>;

  // Contact submissions methods
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;

  // Site settings methods
  getSiteSettings(): Promise<SiteSettings | undefined>;
  updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private newsPosts: Map<string, NewsPost>;
  private media: Map<string, Media>;
  private contactSubmissions: Map<string, ContactSubmission>;

  constructor() {
    this.users = new Map();
    this.newsPosts = new Map();
    this.media = new Map();
    this.contactSubmissions = new Map();

    // Create default admin user
    const adminId = randomUUID();
    this.users.set(adminId, {
      id: adminId,
      username: "admin",
      password: "admin123", // In production, this would be hashed
    });

    // Create sample news posts
    const samplePosts: NewsPost[] = [
      {
        id: randomUUID(),
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
        id: randomUUID(),
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
        id: randomUUID(),
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
        id: randomUUID(),
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

    samplePosts.forEach((post) => {
      this.newsPosts.set(post.id, post);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // News posts methods
  async getAllNewsPosts(): Promise<NewsPost[]> {
    return Array.from(this.newsPosts.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getNewsPost(id: string): Promise<NewsPost | undefined> {
    return this.newsPosts.get(id);
  }

  async createNewsPost(insertPost: InsertNewsPost): Promise<NewsPost> {
    const id = randomUUID();
    const post: NewsPost = { 
      ...insertPost, 
      id,
      featuredImage: insertPost.featuredImage ?? null,
      status: insertPost.status ?? "draft",
      author: insertPost.author ?? "Admin",
    };
    this.newsPosts.set(id, post);
    return post;
  }

  async updateNewsPost(
    id: string,
    updates: Partial<InsertNewsPost>
  ): Promise<NewsPost | undefined> {
    const existing = this.newsPosts.get(id);
    if (!existing) return undefined;

    const updated: NewsPost = { ...existing, ...updates };
    this.newsPosts.set(id, updated);
    return updated;
  }

  async deleteNewsPost(id: string): Promise<boolean> {
    return this.newsPosts.delete(id);
  }

  // Media methods
  async getAllMedia(): Promise<Media[]> {
    return Array.from(this.media.values()).sort(
      (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
  }

  async getMedia(id: string): Promise<Media | undefined> {
    return this.media.get(id);
  }

  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const id = randomUUID();
    const media: Media = { ...insertMedia, id };
    this.media.set(id, media);
    return media;
  }

  async deleteMedia(id: string): Promise<boolean> {
    return this.media.delete(id);
  }

  // Contact submissions methods
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values()).sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  async createContactSubmission(
    insertSubmission: InsertContactSubmission
  ): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = {
      ...insertSubmission,
      id,
      phone: insertSubmission.phone ?? null,
      submittedAt: new Date().toISOString(),
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  // Site settings methods (not used in MemStorage, but required by interface)
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    return undefined;
  }

  async updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    throw new Error("Site settings not supported in MemStorage");
  }
}

// Database-backed storage implementation (from javascript_database blueprint)
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // News posts methods
  async getAllNewsPosts(): Promise<NewsPost[]> {
    return await db.select().from(newsPosts).orderBy(desc(newsPosts.date));
  }

  async getNewsPost(id: string): Promise<NewsPost | undefined> {
    const [post] = await db.select().from(newsPosts).where(eq(newsPosts.id, id));
    return post || undefined;
  }

  async createNewsPost(insertPost: InsertNewsPost): Promise<NewsPost> {
    const [post] = await db
      .insert(newsPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async updateNewsPost(
    id: string,
    updates: Partial<InsertNewsPost>
  ): Promise<NewsPost | undefined> {
    const [updated] = await db
      .update(newsPosts)
      .set(updates)
      .where(eq(newsPosts.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteNewsPost(id: string): Promise<boolean> {
    const result = await db.delete(newsPosts).where(eq(newsPosts.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Media methods
  async getAllMedia(): Promise<Media[]> {
    return await db.select().from(media).orderBy(desc(media.uploadDate));
  }

  async getMedia(id: string): Promise<Media | undefined> {
    const [item] = await db.select().from(media).where(eq(media.id, id));
    return item || undefined;
  }

  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const [mediaItem] = await db
      .insert(media)
      .values(insertMedia)
      .returning();
    return mediaItem;
  }

  async deleteMedia(id: string): Promise<boolean> {
    const result = await db.delete(media).where(eq(media.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Contact submissions methods
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.submittedAt));
  }

  async createContactSubmission(
    insertSubmission: InsertContactSubmission
  ): Promise<ContactSubmission> {
    const submission = {
      ...insertSubmission,
      submittedAt: new Date().toISOString(),
    };
    const [created] = await db
      .insert(contactSubmissions)
      .values(submission)
      .returning();
    return created;
  }

  // Site settings methods
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    const [settings] = await db.select().from(siteSettings).limit(1);
    return settings || undefined;
  }

  async updateSiteSettings(updates: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    // Get existing settings or create new one
    const existing = await this.getSiteSettings();
    
    if (existing) {
      // Update existing settings
      const [updated] = await db
        .update(siteSettings)
        .set({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(siteSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new settings
      const [created] = await db
        .insert(siteSettings)
        .values({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
