import {
  pgTable,
  text,
  timestamp,
  integer,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// --- Tables requises par l'adapter Drizzle d'Auth.js ---

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// --- Tables métier ---

export const practiceCategoryValues = [
  "technique",
  "theorie",
  "morceaux",
  "impro",
  "autre",
] as const;
export type PracticeCategory = (typeof practiceCategoryValues)[number];

export const sessionsPractice = pgTable("sessions_practice", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  startedAt: timestamp("startedAt", { mode: "date" }).notNull(),
  durationSec: integer("durationSec").notNull(),
  category: varchar("category", { length: 32 })
    .$type<PracticeCategory>()
    .notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt", { mode: "date" })
    .notNull()
    .defaultNow(),
});

export const pdfs = pgTable("pdfs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  blobUrl: text("blobUrl").notNull(),
  sizeBytes: integer("sizeBytes").notNull(),
  uploadedAt: timestamp("uploadedAt", { mode: "date" })
    .notNull()
    .defaultNow(),
  tags: text("tags").array().notNull().default([]),
});

export const repertoireStatusValues = [
  "to_learn",
  "in_progress",
  "mastered",
] as const;
export type RepertoireStatus = (typeof repertoireStatusValues)[number];

export const repertoire = pgTable("repertoire", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  artist: text("artist"),
  difficulty: integer("difficulty").notNull().default(1),
  status: varchar("status", { length: 32 })
    .$type<RepertoireStatus>()
    .notNull()
    .default("to_learn"),
  progress: integer("progress").notNull().default(0),
  notes: text("notes"),
  createdAt: timestamp("createdAt", { mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" })
    .notNull()
    .defaultNow(),
});

export const goals = pgTable("goals", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  deadline: timestamp("deadline", { mode: "date" }),
  completedAt: timestamp("completedAt", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" })
    .notNull()
    .defaultNow(),
});

export const journalEntries = pgTable("journal_entries", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  mood: integer("mood").notNull().default(3),
  sessionId: text("sessionId").references(() => sessionsPractice.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("createdAt", { mode: "date" })
    .notNull()
    .defaultNow(),
});
