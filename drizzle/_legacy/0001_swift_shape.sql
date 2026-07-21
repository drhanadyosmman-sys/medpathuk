CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`titleAr` varchar(256),
	`slug` varchar(256) NOT NULL,
	`category` enum('research','audit','qip','interview','cv','specialty_choice','hospital_choice','exams','general') NOT NULL,
	`content` text NOT NULL,
	`contentAr` text,
	`summary` text,
	`summaryAr` text,
	`requiredTier` enum('free','pro','premium') NOT NULL DEFAULT 'free',
	`tags` json,
	`isPublished` boolean NOT NULL DEFAULT true,
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_items_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `external_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`nameAr` varchar(256),
	`url` varchar(512) NOT NULL,
	`description` text,
	`descriptionAr` text,
	`category` varchar(64) NOT NULL,
	`requiredTier` enum('free','pro','premium') NOT NULL DEFAULT 'free',
	`isActive` boolean NOT NULL DEFAULT true,
	`orderIndex` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `external_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questionnaire_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`specialty` varchar(64) NOT NULL,
	`careerLevel` varchar(64) NOT NULL,
	`targetSpecialty` varchar(64),
	`currentExams` json,
	`researchCount` int DEFAULT 0,
	`auditCount` int DEFAULT 0,
	`qipCount` int DEFAULT 0,
	`teachingExperience` boolean DEFAULT false,
	`leadershipExperience` boolean DEFAULT false,
	`availableHoursPerWeek` int,
	`goalTimelineMonths` int,
	`mainGoal` varchar(128),
	`additionalInfo` text,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `questionnaire_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roadmap_milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roadmapId` int NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`category` enum('research','audit','qip','exam','interview','cv','teaching','leadership','other') NOT NULL,
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
	`questionnaireId` int NOT NULL,
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
CREATE TABLE `subscription_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`nameAr` varchar(64),
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
ALTER TABLE `users` ADD `subscriptionTier` enum('free','pro','premium') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionStatus` enum('active','cancelled','expired','trialing') DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionExpiresAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeSubscriptionId` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `specialty` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `careerLevel` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `currentHospital` varchar(256);--> statement-breakpoint
ALTER TABLE `users` ADD `targetSpecialty` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `availableHoursPerWeek` int;--> statement-breakpoint
ALTER TABLE `users` ADD `goalTimelineMonths` int;--> statement-breakpoint
ALTER TABLE `users` ADD `onboardingCompleted` boolean DEFAULT false NOT NULL;