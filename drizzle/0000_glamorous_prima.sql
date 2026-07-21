CREATE TABLE `access_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`email` varchar(320) NOT NULL,
	`isUsed` boolean NOT NULL DEFAULT false,
	`usedByUserId` int,
	`usedAt` timestamp,
	`subscriptionTier` enum('free','pro','premium') NOT NULL DEFAULT 'pro',
	`expiresAt` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `access_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `access_codes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`attachments` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`workspace` enum('research','qip','audit','teaching','presentation','interview','oet','cv','pathway','general') NOT NULL,
	`title` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `external_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`url` varchar(512) NOT NULL,
	`description` text,
	`category` varchar(64) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`orderIndex` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `external_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `onboarding_assessments` (
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
--> statement-breakpoint
CREATE TABLE `password_reset_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` varchar(128) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`usedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `password_reset_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `password_reset_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `roadmap_milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roadmapId` int NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`category` enum('research','audit','qip','exam','interview','cv','teaching','leadership','presentation','oet','application','other') NOT NULL,
	`dueDate` timestamp,
	`orderIndex` int NOT NULL DEFAULT 0,
	`isCompleted` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	`priority` enum('high','medium','low') NOT NULL DEFAULT 'medium',
	`resources` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `roadmap_milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roadmaps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`assessmentId` int,
	`title` varchar(256) NOT NULL,
	`summary` text,
	`totalDurationMonths` int,
	`generatedContent` json,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `roadmaps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sas_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`specialty` varchar(64) NOT NULL,
	`specialtyName` varchar(128),
	`totalScore` int NOT NULL,
	`maxScore` int NOT NULL,
	`percentageScore` decimal(5,2),
	`sectionScores` json,
	`answers` json,
	`feedback` text,
	`competitiveLevel` enum('excellent','competitive','borderline','needs_improvement'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sas_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscription_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`tier` enum('free','pro','premium') NOT NULL,
	`priceMonthly` decimal(10,2),
	`priceYearly` decimal(10,2),
	`stripePriceIdMonthly` varchar(128),
	`stripePriceIdYearly` varchar(128),
	`features` json,
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `subscription_plans_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscription_plans_tier_unique` UNIQUE(`tier`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`milestoneId` int,
	`title` varchar(256) NOT NULL,
	`description` text,
	`dueDate` timestamp,
	`isCompleted` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	`priority` enum('high','medium','low') NOT NULL DEFAULT 'medium',
	`category` varchar(64),
	`reminderSent` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`isActivated` boolean NOT NULL DEFAULT false,
	`accessCodeId` int,
	`subscriptionTier` enum('free','pro','premium') NOT NULL DEFAULT 'free',
	`subscriptionStatus` enum('active','cancelled','expired','trialing') NOT NULL DEFAULT 'active',
	`subscriptionExpiresAt` timestamp,
	`stripeCustomerId` varchar(128),
	`stripeSubscriptionId` varchar(128),
	`specialty` varchar(64),
	`careerLevel` varchar(64),
	`currentHospital` varchar(256),
	`targetSpecialty` varchar(64),
	`country` varchar(64),
	`availableHoursPerWeek` int,
	`goalTimelineMonths` int,
	`onboardingCompleted` boolean NOT NULL DEFAULT false,
	`readinessScore` int,
	`passwordHash` varchar(256),
	`whatsappNumber` varchar(32),
	`graduationCountry` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
