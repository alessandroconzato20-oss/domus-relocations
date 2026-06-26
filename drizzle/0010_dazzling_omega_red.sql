CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientProfileId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`appointmentDate` timestamp NOT NULL,
	`location` varchar(255),
	`type` enum('call','viewing','meeting','school_visit','other') NOT NULL DEFAULT 'meeting',
	`status` enum('scheduled','completed','cancelled') NOT NULL DEFAULT 'scheduled',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `checklistItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientProfileId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`isCompleted` tinyint NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`dueDate` timestamp,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `checklistItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clientProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`nationality` varchar(100),
	`currentCity` varchar(100),
	`targetMoveDate` varchar(50),
	`servicePackage` enum('standard','premium','elite') NOT NULL DEFAULT 'standard',
	`notes` text,
	`isActive` tinyint NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clientProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientProfileId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`originalName` varchar(255) NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`fileSize` int NOT NULL,
	`s3Key` varchar(512) NOT NULL,
	`category` varchar(100),
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientProfileId` int NOT NULL,
	`senderRole` enum('admin','client') NOT NULL,
	`content` text NOT NULL,
	`isRead` tinyint NOT NULL DEFAULT 0,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schoolOptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientProfileId` int NOT NULL,
	`schoolName` varchar(255) NOT NULL,
	`type` enum('international','bilingual','local','montessori','other') NOT NULL DEFAULT 'international',
	`ageRange` varchar(50),
	`curriculum` varchar(100),
	`location` varchar(255),
	`website` varchar(512),
	`notes` text,
	`status` enum('shortlisted','applied','accepted','rejected','waitlisted') NOT NULL DEFAULT 'shortlisted',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `schoolOptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_clientProfileId_clientProfiles_id_fk` FOREIGN KEY (`clientProfileId`) REFERENCES `clientProfiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `checklistItems` ADD CONSTRAINT `checklistItems_clientProfileId_clientProfiles_id_fk` FOREIGN KEY (`clientProfileId`) REFERENCES `clientProfiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clientProfiles` ADD CONSTRAINT `clientProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_clientProfileId_clientProfiles_id_fk` FOREIGN KEY (`clientProfileId`) REFERENCES `clientProfiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_clientProfileId_clientProfiles_id_fk` FOREIGN KEY (`clientProfileId`) REFERENCES `clientProfiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `schoolOptions` ADD CONSTRAINT `schoolOptions_clientProfileId_clientProfiles_id_fk` FOREIGN KEY (`clientProfileId`) REFERENCES `clientProfiles`(`id`) ON DELETE cascade ON UPDATE no action;