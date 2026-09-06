import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  DATABASE_URL: z.string().url(),
  
  REDIS_URL: z.string().url(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),
  
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().url().optional(),
  
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  
  // A single URL, or a comma-separated list (e.g. production domain + a www. alias).
  CORS_ORIGIN: z
    .string()
    .default('http://localhost:5173')
    .refine(
      (val) => val.split(',').every((origin) => z.string().url().safeParse(origin.trim()).success),
      { message: 'CORS_ORIGIN must be a URL or a comma-separated list of URLs' },
    ),
  // Cookie SameSite for the refresh-token cookie. Defaults to "none" in
  // production (required when frontend/backend are on different domains,
  // e.g. Vercel + Render) and "lax" otherwise. Override to "lax" if both
  // sit under one shared parent domain.
  COOKIE_SAME_SITE: z.enum(['lax', 'none', 'strict']).optional(),
  // Set to "true" to expose Swagger docs (/api/docs) in production; off by default.
  ENABLE_SWAGGER: z.enum(['true', 'false']).optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);
  
  if (!result.success) {
    throw new Error(`Config validation error: ${result.error.message}`);
  }
  
  return result.data;
}
