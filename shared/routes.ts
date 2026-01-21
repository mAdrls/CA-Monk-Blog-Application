import { z } from 'zod';
import { insertBlogSchema, blogs } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  blogs: {
    list: {
      method: 'GET' as const,
      path: '/api/blogs',
      responses: {
        200: z.array(z.custom<typeof blogs.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/blogs/:id',
      responses: {
        200: z.custom<typeof blogs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/blogs',
      input: insertBlogSchema,
      responses: {
        201: z.custom<typeof blogs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
