import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNewsPostSchema, insertMediaSchema, insertContactSubmissionSchema, insertSiteSettingsSchema } from "@shared/schema";
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve the standalone HTML editor
  app.get("/editor", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "editor.html"));
  });

  // Authentication endpoints
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, error: "Invalid credentials" });
      }
      
      res.json({ success: true, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ success: false, error: "Login failed" });
    }
  });

  app.post("/api/change-password", async (req, res) => {
    try {
      const { username, oldPassword, newPassword } = req.body;

      if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
      }

      // Verify old password
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== oldPassword) {
        return res.status(401).json({ success: false, error: "Invalid current password" });
      }

      // Update password
      const success = await storage.updateUserPassword(username, newPassword);

      if (success) {
        res.json({ success: true, message: "Password updated successfully" });
      } else {
        res.status(500).json({ success: false, error: "Failed to update password" });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: "Password change failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      res.json({ success: true, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // News posts endpoints
  app.get("/api/news", async (req, res) => {
    try {
      const posts = await storage.getAllNewsPosts();
      
      // Filter to only published posts for public endpoint
      const publicPosts = posts.filter(post => post.status === "published");
      
      res.json(publicPosts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news posts" });
    }
  });

  app.get("/api/news/all", async (req, res) => {
    try {
      const posts = await storage.getAllNewsPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch all news posts" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const post = await storage.getNewsPost(req.params.id);
      
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const validatedData = insertNewsPostSchema.parse(req.body);
      const post = await storage.createNewsPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid post data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  app.put("/api/news/:id", async (req, res) => {
    try {
      const validatedData = insertNewsPostSchema.partial().parse(req.body);
      const post = await storage.updateNewsPost(req.params.id, validatedData);
      
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid post data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update post" });
    }
  });

  app.delete("/api/news/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteNewsPost(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Post not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // Media endpoints
  app.get("/api/media", async (req, res) => {
    try {
      const media = await storage.getAllMedia();
      res.json(media);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch media" });
    }
  });

  app.get("/api/media/:id", async (req, res) => {
    try {
      const media = await storage.getMedia(req.params.id);
      
      if (!media) {
        return res.status(404).json({ error: "Media not found" });
      }
      
      res.json(media);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch media" });
    }
  });

  app.post("/api/media", async (req, res) => {
    try {
      const validatedData = insertMediaSchema.parse(req.body);
      const media = await storage.createMedia(validatedData);
      res.status(201).json(media);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid media data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create media" });
    }
  });

  app.delete("/api/media/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMedia(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Media not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete media" });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid contact data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact submissions" });
    }
  });

  // Site settings endpoints
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const validatedData = insertSiteSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateSiteSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid settings data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
