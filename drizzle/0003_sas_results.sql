CREATE TABLE IF NOT EXISTS `sas_results` (
  `id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `userId` int NOT NULL,
  `specialty` varchar(64) NOT NULL,
  `totalScore` int NOT NULL,
  `maxScore` int NOT NULL,
  `percentageScore` decimal(5,2),
  `sectionScores` json,
  `answers` json,
  `feedback` text,
  `competitiveLevel` enum('excellent','competitive','borderline','needs_improvement'),
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP
);
