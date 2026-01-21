import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").array().notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  coverImage: text("cover_image").notNull(),
  content: text("content").notNull(),
});

export const insertBlogSchema = createInsertSchema(blogs).omit({ 
  id: true,
  date: true 
});

export type Blog = typeof blogs.$inferSelect;
export type InsertBlog = z.infer<typeof insertBlogSchema>;

export type CreateBlogRequest = InsertBlog;
export type BlogResponse = Blog;
export type BlogsListResponse = Blog[];
