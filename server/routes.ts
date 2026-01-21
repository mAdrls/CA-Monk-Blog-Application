import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.blogs.list.path, async (req, res) => {
    const blogs = await storage.getBlogs();
    res.json(blogs);
  });

  app.get(api.blogs.get.path, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(404).json({ message: "Invalid blog ID" });
    }
    const blog = await storage.getBlog(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  });

  app.post(api.blogs.create.path, async (req, res) => {
    try {
      const input = api.blogs.create.input.parse(req.body);
      const blog = await storage.createBlog(input);
      res.status(201).json(blog);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed data if empty
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getBlogs();
  if (existing.length === 0) {
    const seedData = [
      {
        title: "Future of Fintech",
        category: ["FINANCE", "TECH"],
        description: "Exploring how AI and blockchain are reshaping financial services",
        coverImage: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg",
        content: "The intersection of finance and technology has never been more vibrant. As we look towards 2024, the role of the Chartered Accountant is evolving from mere bookkeeping to strategic financial analysis powered by AI. \n\nThe Rise of Automated Accounting\nAutomation is no longer a buzzword; it's a reality. Routine tasks like data entry, reconciliation, and payroll processing are being automated at an unprecedented pace.",
      },
      {
        title: "Ace Your CA Finals",
        category: ["CAREER", "STUDY"],
        description: "Strategies and study plans to help you clear your exams in the first attempt without burning out.",
        coverImage: "https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg",
        content: "Passing the CA Final exams is a monumental achievement. It requires dedication, strategy, and resilience. Here are some top tips to help you succeed...",
      },
      {
        title: "Understanding Tax Reforms",
        category: ["REGULATIONS"],
        description: "A comprehensive breakdown of the new tax laws introduced this fiscal year and their impact on businesses.",
        coverImage: "https://images.pexels.com/photos/6863255/pexels-photo-6863255.jpeg",
        content: "Tax regulations are constantly evolving. Keeping up with the latest changes is crucial for any finance professional...",
      }
    ];

    for (const blog of seedData) {
      await storage.createBlog(blog);
    }
    console.log("Database seeded successfully");
  }
}
