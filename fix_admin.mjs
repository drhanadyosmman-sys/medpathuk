import mysql2 from 'mysql2/promise';

const OWNER_OPEN_ID = process.env.OWNER_OPEN_ID;

if (!OWNER_OPEN_ID) {
  console.error('OWNER_OPEN_ID not set');
  process.exit(1);
}

const conn = await mysql2.createConnection(process.env.DATABASE_URL);

// Step 1: Check what columns exist in users table
const [cols] = await conn.execute("SHOW COLUMNS FROM users");
const colNames = cols.map(c => c.Field.toLowerCase());
console.log('Existing columns:', colNames);

// Step 2: Add missing columns if they don't exist
const missingColsSQL = [];

if (!colNames.includes('isactivated')) {
  missingColsSQL.push('ALTER TABLE `users` ADD COLUMN `isActivated` boolean NOT NULL DEFAULT false');
}
if (!colNames.includes('accesscodeid')) {
  missingColsSQL.push('ALTER TABLE `users` ADD COLUMN `accessCodeId` int');
}
if (!colNames.includes('country')) {
  missingColsSQL.push('ALTER TABLE `users` ADD COLUMN `country` varchar(64)');
}
if (!colNames.includes('readinessscore')) {
  missingColsSQL.push('ALTER TABLE `users` ADD COLUMN `readinessScore` int');
}

for (const sql of missingColsSQL) {
  try {
    await conn.execute(sql);
    console.log('Applied:', sql.substring(0, 60));
  } catch (e) {
    console.log('Skip:', e.message.substring(0, 80));
  }
}

// Step 3: Check if access_codes table exists
const [tables] = await conn.execute("SHOW TABLES LIKE 'access_codes'");
if (tables.length === 0) {
  await conn.execute(`CREATE TABLE IF NOT EXISTS \`access_codes\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`code\` varchar(32) NOT NULL,
    \`email\` varchar(320) NOT NULL,
    \`subscriptionTier\` enum('free','pro','premium') NOT NULL DEFAULT 'pro',
    \`usedAt\` timestamp NULL,
    \`usedByUserId\` int NULL,
    \`expiresAt\` timestamp NULL,
    \`notes\` text NULL,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`access_codes_id\` PRIMARY KEY(\`id\`),
    CONSTRAINT \`access_codes_code_unique\` UNIQUE(\`code\`)
  )`);
  console.log('Created access_codes table');
}

// Step 4: Check if onboarding_assessments table exists
const [oaTables] = await conn.execute("SHOW TABLES LIKE 'onboarding_assessments'");
if (oaTables.length === 0) {
  await conn.execute(`CREATE TABLE IF NOT EXISTS \`onboarding_assessments\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`userId\` int NOT NULL,
    \`specialty\` varchar(64),
    \`careerLevel\` varchar(64),
    \`country\` varchar(64),
    \`targetSpecialty\` varchar(64),
    \`targetPathway\` varchar(64),
    \`englishStatus\` varchar(64),
    \`oetStatus\` varchar(64),
    \`researchCount\` int DEFAULT 0,
    \`auditCount\` int DEFAULT 0,
    \`qipCount\` int DEFAULT 0,
    \`teachingExperience\` boolean DEFAULT false,
    \`leadershipExperience\` boolean DEFAULT false,
    \`presentationsCount\` int DEFAULT 0,
    \`currentExams\` json,
    \`examsPassed\` json,
    \`mainGoal\` varchar(128),
    \`availableHoursPerWeek\` int,
    \`goalTimelineMonths\` int,
    \`additionalInfo\` text,
    \`readinessScore\` int,
    \`completedAt\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`onboarding_assessments_id\` PRIMARY KEY(\`id\`)
  )`);
  console.log('Created onboarding_assessments table');
}

// Step 5: Check if chat_sessions table exists
const [csTables] = await conn.execute("SHOW TABLES LIKE 'chat_sessions'");
if (csTables.length === 0) {
  await conn.execute(`CREATE TABLE IF NOT EXISTS \`chat_sessions\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`userId\` int NOT NULL,
    \`workspace\` enum('research','qip','audit','teaching','presentation','interview','oet','cv','pathway','general') NOT NULL,
    \`title\` varchar(256),
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`chat_sessions_id\` PRIMARY KEY(\`id\`)
  )`);
  console.log('Created chat_sessions table');
}

// Step 6: Add sessionId to chat_messages if missing
const [cmCols] = await conn.execute("SHOW COLUMNS FROM chat_messages");
const cmColNames = cmCols.map(c => c.Field.toLowerCase());
if (!cmColNames.includes('sessionid')) {
  await conn.execute('ALTER TABLE `chat_messages` ADD COLUMN `sessionId` int NULL');
  console.log('Added sessionId to chat_messages');
}
if (!cmColNames.includes('attachments')) {
  await conn.execute('ALTER TABLE `chat_messages` ADD COLUMN `attachments` json NULL');
  console.log('Added attachments to chat_messages');
}

// Step 7: Find and update owner to admin
const [rows] = await conn.execute(
  'SELECT id, openId, name, email, role FROM users WHERE openId = ?',
  [OWNER_OPEN_ID]
);
console.log('Owner user found:', rows);

if (rows.length > 0) {
  await conn.execute(
    'UPDATE users SET role = "admin", isActivated = 1 WHERE openId = ?',
    [OWNER_OPEN_ID]
  );
  console.log('SUCCESS: Updated owner to admin role and activated');
} else {
  console.log('Owner not in DB yet — will be set to admin on first login');
}

// Show all users
const [allUsers] = await conn.execute(
  'SELECT id, name, email, role, isActivated, subscriptionTier FROM users LIMIT 10'
);
console.log('All users:', allUsers);

await conn.end();
console.log('Done!');
