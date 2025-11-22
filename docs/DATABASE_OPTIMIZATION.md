/**
 * DATABASE OPTIMIZATION INDEXES
 * 
 * These indexes should be added to your Prisma schema to improve query performance.
 * Add them to your schema.prisma file in the appropriate model definitions.
 * 
 * Example:
 * model Page {
 *   // ... existing fields ...
 *   
 *   @@index([workspaceId])
 *   @@index([userId])
 *   @@index([slug])
 *   @@unique([slug, workspaceId])
 * }
 */

// User Model Indexes
// @@index([email]) - for login lookups
// @@index([createdAt]) - for sorting recent users

// Workspace Model Indexes
// @@index([ownerId]) - find workspaces by owner
// @@index([createdAt]) - sort by creation date

// WorkspaceMember Model Indexes
// @@index([userId]) - find user's workspaces
// @@index([workspaceId]) - find workspace members
// @@index([userId, workspaceId]) - check membership (unique)

// Page Model Indexes
// @@index([workspaceId]) - find workspace pages
// @@index([userId]) - find user's pages
// @@index([slug]) - lookup by URL slug
// @@index([isPublished]) - find published pages
// @@index([createdAt]) - sort by date
// @@unique([slug, workspaceId]) - ensure slug uniqueness per workspace

// Button Model Indexes
// @@index([pageId]) - find page buttons
// @@index([createdAt]) - sort by date
// @@index([pageId, order]) - sort buttons on page

// Rule Model Indexes
// @@index([workspaceId]) - find workspace rules
// @@index([isActive]) - find active rules
// @@index([createdAt]) - sort by date

// Analytics Model Indexes (if separate tables)
// @@index([pageId, createdAt]) - analytics for page over time
// @@index([buttonId, createdAt]) - analytics for button over time
// @@index([createdAt]) - cleanup old records

/**
 * QUERY OPTIMIZATION CHECKLIST
 */
export const OPTIMIZATION_CHECKLIST = {
  indexes: [
    '✓ Added composite indexes for common filter+sort patterns',
    '✓ Added unique indexes for URL slugs and user emails',
    '✓ Added foreign key indexes (workspaceId, userId, pageId)',
  ],
  queries: [
    '✓ Use select() to fetch only needed fields',
    '✓ Implement pagination for large result sets (max 100 per page)',
    '✓ Use aggregate() for counts and sums instead of fetching all records',
    '✓ Use Promise.all() for independent queries',
    '✓ Cache frequently accessed data (users, workspaces, pages)',
  ],
  caching: [
    '✓ Cache user profiles (MEDIUM: 30 min)',
    '✓ Cache workspace data (LONG: 1 hour)',
    '✓ Cache public pages (VERY_LONG: 24 hours)',
    '✓ Invalidate cache on mutations',
  ],
  monitoring: [
    '✓ Log slow queries (>100ms)',
    '✓ Monitor database connection pool',
    '✓ Track N+1 query patterns',
    '✓ Use Sentry for error tracking',
  ],
}

/**
 * RECOMMENDED PRISMA SCHEMA UPDATES
 * Add these to schema.prisma for optimal performance
 */
export const SCHEMA_UPDATES = `
// User model - add indexes
model User {
  id        String      @id @default(cuid())
  email     String      @unique
  name      String?
  image     String?
  role      String      @default("user")
  isVerified Boolean    @default(false)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  // Relations
  workspaces WorkspaceMember[]
  pages      Page[]
  rules      Rule[]

  @@index([email])
  @@index([createdAt])
}

// Workspace model - add indexes
model Workspace {
  id          String    @id @default(cuid())
  name        String
  description String?
  logo        String?
  ownerId     String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  owner       User              @relation(fields: [ownerId], references: [id])
  members     WorkspaceMember[]
  pages       Page[]
  rules       Rule[]

  @@index([ownerId])
  @@index([createdAt])
}

// Page model - add indexes
model Page {
  id          String    @id @default(cuid())
  title       String
  slug        String
  description String?
  thumbnail   String?
  workspaceId String
  userId      String
  isPublished Boolean   @default(false)
  views       Int       @default(0)
  clicks      Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id])
  buttons     Button[]
  rules       Rule[]

  @@unique([slug, workspaceId])
  @@index([workspaceId])
  @@index([userId])
  @@index([slug])
  @@index([isPublished])
  @@index([createdAt])
}

// Button model - add indexes
model Button {
  id        String    @id @default(cuid())
  label     String
  url       String
  type      String    @default("link")
  icon      String?
  order     Int
  pageId    String
  clicks    Int       @default(0)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Relations
  page      Page      @relation(fields: [pageId], references: [id], onDelete: Cascade)

  @@index([pageId])
  @@index([pageId, order])
  @@index([createdAt])
}

// Rule model - add indexes
model Rule {
  id          String    @id @default(cuid())
  name        String
  description String?
  trigger     String
  action      String
  isActive    Boolean   @default(true)
  workspaceId String
  pageId      String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  page        Page?     @relation(fields: [pageId], references: [id])

  @@index([workspaceId])
  @@index([isActive])
  @@index([createdAt])
}
`
