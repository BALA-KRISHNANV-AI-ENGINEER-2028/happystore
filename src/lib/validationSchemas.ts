// =============================================================================
// Happy Store — Validation Schemas (Zod)
// Centralized schemas imported by forms across the app. Pages should import
// from here rather than defining schemas inline.
// =============================================================================

import { z } from "zod";
import { VALIDATION } from "@/constants";

// ---------------------------------------------------------------------------
// Auth Schemas
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(VALIDATION.FULL_NAME_MIN_LENGTH, "Enter your full name"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z
      .string()
      .min(VALIDATION.PASSWORD_MIN_LENGTH, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z
      .boolean()
      .refine((v) => v === true, {
        message: "You must accept the terms to continue",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(VALIDATION.PASSWORD_MIN_LENGTH, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

// ---------------------------------------------------------------------------
// Profile Schemas
// ---------------------------------------------------------------------------

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(VALIDATION.FULL_NAME_MIN_LENGTH, "Enter your full name"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z.string().optional(),
});
export type ProfileValues = z.infer<typeof profileSchema>;

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z
      .string()
      .min(VALIDATION.PASSWORD_MIN_LENGTH, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;

export const addressSchema = z.object({
  label: z.string().min(1, "Enter a label (e.g. Home)"),
  detail: z.string().min(5, "Enter a full address"),
  isDefault: z.boolean().optional(),
});
export type AddressValues = z.infer<typeof addressSchema>;

// ---------------------------------------------------------------------------
// Review Schema
// ---------------------------------------------------------------------------

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z
    .string()
    .min(
      VALIDATION.REVIEW_COMMENT_MIN_LENGTH,
      `Write at least ${VALIDATION.REVIEW_COMMENT_MIN_LENGTH} characters`,
    )
    .max(VALIDATION.REVIEW_COMMENT_MAX_LENGTH),
});
export type ReviewValues = z.infer<typeof reviewSchema>;

// ---------------------------------------------------------------------------
// Search Schema
// ---------------------------------------------------------------------------

export const searchSchema = z.object({
  q: z.string().min(1, "Enter a search term"),
});
export type SearchValues = z.infer<typeof searchSchema>;
