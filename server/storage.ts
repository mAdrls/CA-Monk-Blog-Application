import { db } from "./db";
import { blogs, type Blog, type InsertBlog } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getBlogs(): Promise<Blog[]>;
  getBlog(id: number): Promise<Blog | undefined>;
  createBlog(blog: InsertBlog): Promise<Blog>;
}

export class DatabaseStorage implements IStorage {
  async getBlogs(): Promise<Blog[]> {
    return await db.select().from(blogs).orderBy(desc(blogs.date));
  }

  async getBlog(id: number): Promise<Blog | undefined> {
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));
    return blog;
  }

  async createBlog(insertBlog: InsertBlog): Promise<Blog> {
    const [blog] = await db.insert(blogs).values(insertBlog).returning();
    return blog;
  }
}

export const storage = new DatabaseStorage();
