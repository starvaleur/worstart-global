import { pgTable, text, serial, integer, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", ["customer", "seller", "business", "admin", "operations"]);
export const paymentStatusEnum = pgEnum("payment_status", ["requires_action", "pending", "succeeded", "failed", "refunded", "partially_refunded"]);
export const shipmentStatusEnum = pgEnum("shipment_status", ["pending", "in_transit", "customs", "delivered", "exception"]);

const ts = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

export const enquiriesTable = pgTable("enquiries", {
  id: serial("id").primaryKey(), kind: text("kind").notNull().default("logistics"),
  name: text("name").notNull(), email: text("email").notNull(), phone: text("phone"), company: text("company"),
  service: text("service").notNull(), origin: text("origin"), destination: text("destination"),
  details: jsonb("details").$type<Record<string, string>>().notNull().default({}), createdAt: ts(),
});

export const shipmentsTable = pgTable("shipments", {
  id: serial("id").primaryKey(), trackingNumber: text("tracking_number").notNull().unique(),
  status: shipmentStatusEnum("status").notNull().default("pending"), origin: text("origin").notNull(),
  destination: text("destination").notNull(), estimatedArrival: timestamp("estimated_arrival", { withTimezone: true }), createdAt: ts(),
});

export const shipmentEventsTable = pgTable("shipment_events", {
  id: serial("id").primaryKey(), shipmentId: integer("shipment_id").notNull().references(() => shipmentsTable.id),
  label: text("label").notNull(), location: text("location"), occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
});

export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(), reference: text("reference").notNull().unique(), provider: text("provider").notNull(),
  providerPaymentId: text("provider_payment_id"), amountMinor: integer("amount_minor").notNull(), currency: text("currency").notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"), orderRef: text("order_ref"),
  /** Status is only ever written from verified provider webhooks / server-side provider lookups. */
  createdAt: ts(),
});

export const appointmentsTable = pgTable("appointments", {
  id: serial("id").primaryKey(), destination: text("destination").notNull(), visaType: text("visa_type").notNull(),
  serviceType: text("service_type").notNull(), preferredDate: text("preferred_date"), preferredTime: text("preferred_time"),
  status: text("status").notNull().default("requested"), enquiryId: integer("enquiry_id").references(() => enquiriesTable.id), createdAt: ts(),
});
