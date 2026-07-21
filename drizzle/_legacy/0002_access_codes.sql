-- Create access_codes table
CREATE TABLE IF NOT EXISTS `access_codes` (
  `id` int AUTO_INCREMENT NOT NULL,
  `code` varchar(32) NOT NULL,
  `email` varchar(320) NOT NULL,
  `subscriptionTier` enum('free','pro','premium') NOT NULL DEFAULT 'pro',
  `usedAt` timestamp,
  `usedByUserId` int,
  `expiresAt` timestamp,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `access_codes_id` PRIMARY KEY(`id`),
  CONSTRAINT `access_codes_code_unique` UNIQUE(`code`)
);

-- Add new columns to users table
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `isActivated` boolean NOT NULL DEFAULT false;
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `accessCodeId` int;
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `country` varchar(64);
ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `readinessScore` int;

-- Create onboarding_assessments table
CREATE TABLE IF NOT EXISTS `onboarding_assessments` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `specialty` varchar(64),
  `careerLevel` varchar(64),
  `country` varchar(64),
  `targetSpecialty` varchar(64),
  `targetPathway` varchar(64),
  `englishStatus` varchar(64),
  `oetStatus` varchar(64),
  `researchCount` int DEFAULT 0,
  `auditCount` int DEFAULT 0,
  `qipCount` int DEFAULT 0,
  `teachingExperience` boolean DEFAULT false,
  `leadershipExperience` boolean DEFAULT false,
  `presentationsCount` int DEFAULT 0,
  `currentExams` json,
  `examsPassed` json,
  `mainGoal` varchar(128),
  `availableHoursPerWeek` int,
  `goalTimelineMonths` int,
  `additionalInfo` text,
  `readinessScore` int,
  `completedAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `onboarding_assessments_id` PRIMARY KEY(`id`)
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS `chat_sessions` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `workspace` enum('research','qip','audit','teaching','presentation','interview','oet','cv','pathway','general') NOT NULL,
  `title` varchar(256),
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `chat_sessions_id` PRIMARY KEY(`id`)
);

-- Update chat_messages table to add sessionId column (if not exists)
ALTER TABLE `chat_messages` ADD COLUMN IF NOT EXISTS `sessionId` int;
ALTER TABLE `chat_messages` ADD COLUMN IF NOT EXISTS `attachments` json;
