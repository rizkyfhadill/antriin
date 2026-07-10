import { pgTable, text, varchar, integer, timestamp, boolean, uuid, pgEnum, doublePrecision, jsonb } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["super_admin", "admin", "operator", "customer"]);
export const queueStatusEnum = pgEnum("queue_status", ["waiting", "called", "checked_in", "serving", "completed", "cancelled", "missed"]);
export const locationCategoryEnum = pgEnum("location_category", ["hospital", "clinic", "barber", "salon", "bank", "government", "restaurant", "workshop", "other"]);
export const counterStatusEnum = pgEnum("counter_status", ["active", "inactive", "busy"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("customer"),
  avatarUrl: text("avatar_url"),
  phone: varchar("phone", { length: 50 }),
  city: varchar("city", { length: 100 }),
  isActive: boolean("is_active").default(true),
  rememberToken: text("remember_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const locations = pgTable("locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: locationCategoryEnum("category").notNull().default("other"),
  description: text("description"),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  openingTime: varchar("opening_time", { length: 10 }).notNull().default("08:00"),
  closingTime: varchar("closing_time", { length: 10 }).notNull().default("17:00"),
  totalCounters: integer("total_counters").notNull().default(3),
  quotaPerDay: integer("quota_per_day").notNull().default(100),
  imageUrl: text("image_url"),
  ownerId: uuid("owner_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  avgServiceTime: integer("avg_service_time").default(8), // minutes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  locationId: uuid("location_id").references(() => locations.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  durationAvg: integer("duration_avg").notNull().default(10), // minutes
  price: integer("price").default(0),
  quota: integer("quota").default(50),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const counters = pgTable("counters", {
  id: uuid("id").defaultRandom().primaryKey(),
  locationId: uuid("location_id").references(() => locations.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  operatorId: uuid("operator_id").references(() => users.id),
  status: counterStatusEnum("status").notNull().default("active"),
  currentQueueId: uuid("current_queue_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const queues = pgTable("queues", {
  id: uuid("id").defaultRandom().primaryKey(),
  ticketNumber: varchar("ticket_number", { length: 20 }).notNull(),
  locationId: uuid("location_id").references(() => locations.id).notNull(),
  serviceId: uuid("service_id").references(() => services.id).notNull(),
  customerId: uuid("customer_id").references(() => users.id).notNull(),
  counterId: uuid("counter_id").references(() => counters.id),
  status: queueStatusEnum("status").notNull().default("waiting"),
  estimatedWaitMinutes: integer("estimated_wait_minutes").notNull().default(0),
  position: integer("position").notNull().default(0),
  qrCode: varchar("qr_code", { length: 255 }).notNull().unique(),
  isQrUsed: boolean("is_qr_used").default(false),
  bookingDate: timestamp("booking_date").defaultNow(),
  calledAt: timestamp("called_at"),
  checkedInAt: timestamp("checked_in_at"),
  servingAt: timestamp("serving_at"),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ratings = pgTable("ratings", {
  id: uuid("id").defaultRandom().primaryKey(),
  queueId: uuid("queue_id").references(() => queues.id, { onDelete: "cascade" }).notNull(),
  customerId: uuid("customer_id").references(() => users.id).notNull(),
  locationId: uuid("location_id").references(() => locations.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).default("info"),
  isRead: boolean("is_read").default(false),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Location = typeof locations.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Counter = typeof counters.$inferSelect;
export type Queue = typeof queues.$inferSelect;
export type Rating = typeof ratings.$inferSelect;
