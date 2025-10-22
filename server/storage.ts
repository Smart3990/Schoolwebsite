import {
  type User,
  type InsertUser,
  type NewsPost,
  type InsertNewsPost,
  type Media,
  type InsertMedia,
  type ContactSubmission,
  type InsertContactSubmission,
} from "@shared/schema";
import { randomUUID } from "crypto";

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
    const post: NewsPost = { ...insertPost, id };
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
      submittedAt: new Date().toISOString(),
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }
}

export const storage = new MemStorage();
