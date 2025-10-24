import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Funciones para imágenes públicas
import { publicImages, InsertPublicImage, PublicImage, gameProgress, InsertGameProgress, chatHistory, InsertChatHistory } from "../drizzle/schema";
import { desc } from "drizzle-orm";

export async function createPublicImage(image: InsertPublicImage): Promise<PublicImage | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create public image: database not available");
    return undefined;
  }

  try {
    await db.insert(publicImages).values(image);
    const result = await db.select().from(publicImages).where(eq(publicImages.id, image.id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to create public image:", error);
    throw error;
  }
}

export async function getAllPublicImages(): Promise<PublicImage[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get public images: database not available");
    return [];
  }

  try {
    const result = await db.select().from(publicImages).orderBy(desc(publicImages.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get public images:", error);
    return [];
  }
}

export async function getUserPublicImages(userId: string): Promise<PublicImage[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user public images: database not available");
    return [];
  }

  try {
    const result = await db.select().from(publicImages).where(eq(publicImages.userId, userId)).orderBy(desc(publicImages.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get user public images:", error);
    return [];
  }
}

// Funciones para progreso de juegos
export async function saveGameProgress(progress: InsertGameProgress): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save game progress: database not available");
    return;
  }

  try {
    await db.insert(gameProgress).values(progress);
  } catch (error) {
    console.error("[Database] Failed to save game progress:", error);
    throw error;
  }
}

export async function getUserGameProgress(userId: string): Promise<typeof gameProgress.$inferSelect[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user game progress: database not available");
    return [];
  }

  try {
    const result = await db.select().from(gameProgress).where(eq(gameProgress.userId, userId)).orderBy(desc(gameProgress.completedAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get user game progress:", error);
    return [];
  }
}

// Funciones para historial de chat
export async function saveChatMessage(chat: InsertChatHistory): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save chat message: database not available");
    return;
  }

  try {
    await db.insert(chatHistory).values(chat);
  } catch (error) {
    console.error("[Database] Failed to save chat message:", error);
    throw error;
  }
}

export async function getUserChatHistory(userId: string): Promise<typeof chatHistory.$inferSelect[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user chat history: database not available");
    return [];
  }

  try {
    const result = await db.select().from(chatHistory).where(eq(chatHistory.userId, userId)).orderBy(desc(chatHistory.createdAt)).limit(50);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get user chat history:", error);
    return [];
  }
}
