import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNewsPostSchema, insertMediaSchema, insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication endpoint
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

  const httpServer = createServer(app);
  return httpServer;
}
