import { mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tabla para imágenes públicas subidas por usuarios
export const publicImages = mysqlTable("publicImages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  celestialObjectTag: varchar("celestialObjectTag", { length: 100 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type PublicImage = typeof publicImages.$inferSelect;
export type InsertPublicImage = typeof publicImages.$inferInsert;

// Tabla para progreso de juegos de usuarios
export const gameProgress = mysqlTable("gameProgress", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  gameType: varchar("gameType", { length: 50 }).notNull(), // 'puzzle', 'wordsearch', 'quiz'
  celestialObject: varchar("celestialObject", { length: 100 }),
  score: varchar("score", { length: 20 }),
  completedAt: timestamp("completedAt").defaultNow(),
});

export type GameProgress = typeof gameProgress.$inferSelect;
export type InsertGameProgress = typeof gameProgress.$inferInsert;

// Tabla para historial de chat del chatbot
export const chatHistory = mysqlTable("chatHistory", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type ChatHistory = typeof chatHistory.$inferSelect;
export type InsertChatHistory = typeof chatHistory.$inferInsert;
