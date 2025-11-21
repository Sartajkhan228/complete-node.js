
import { int, mysqlTable, varchar, timestamp, boolean, text } from 'drizzle-orm/mysql-core';
import { relations } from "drizzle-orm";


export const usersTable = mysqlTable("users", {

    id: int().autoincrement().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()

})

export const sessionsTable = mysqlTable("sessions", {
    id: int().autoincrement().primaryKey(),
    userId: int("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    valid: boolean().default(true).notNull(),
    userAgent: text("user_agent"),
    ip: varchar({ length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
})

export const shortLink = mysqlTable('short_link', {
    id: int().autoincrement().primaryKey(),
    url: varchar({ length: 255 }).notNull(),
    shortCode: varchar("short_code", { length: 20 }).notNull().unique(),
    userId: int("user_id").notNull().references(() => usersTable.id)
});


export const userRelations = relations(usersTable, ({ many }) => ({
    links: many(shortLink),
    session: many(sessionsTable)
}))

export const shortLinkRelations = relations(shortLink, ({ one }) => ({
    user: one(usersTable, {
        fields: [shortLink.userId],
        references: [usersTable.id],
    }),
}))

export const sessionsRelation = relations(sessionsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [sessionsTable.userId],
        references: [usersTable.id]
    })
}))