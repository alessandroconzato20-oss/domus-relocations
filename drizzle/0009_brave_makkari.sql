ALTER TABLE `quizResponses` ADD `profile` text;--> statement-breakpoint
ALTER TABLE `quizResponses` ADD `recommendations` text;--> statement-breakpoint
ALTER TABLE `quizResponses` ADD `leadScore` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `quizResponses` ADD `leadPriority` enum('high','standard','future') DEFAULT 'standard' NOT NULL;--> statement-breakpoint
ALTER TABLE `quizResponses` ADD `reportUrl` varchar(512);--> statement-breakpoint
ALTER TABLE `quizResponses` ADD `emailSent` tinyint DEFAULT 0 NOT NULL;