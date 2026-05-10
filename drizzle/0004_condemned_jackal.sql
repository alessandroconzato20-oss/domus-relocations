CREATE TABLE `families` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`familyName` varchar(255) NOT NULL,
	`serviceTier` varchar(100) NOT NULL DEFAULT 'standard',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `families_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `familyAppointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`familyId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`appointmentDate` timestamp NOT NULL,
	`location` varchar(255),
	`status` varchar(100) NOT NULL DEFAULT 'scheduled',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `familyAppointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `familyDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`familyId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`documentUrl` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `familyDocuments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `familyMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`familyId` int NOT NULL,
	`senderName` varchar(255) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`isRead` tinyint NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `familyMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `familySchools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`familyId` int NOT NULL,
	`schoolName` varchar(255) NOT NULL,
	`schoolInitials` varchar(10) NOT NULL,
	`curriculumType` varchar(100) NOT NULL,
	`ageRange` varchar(100) NOT NULL,
	`status` varchar(100) NOT NULL DEFAULT 'reviewed',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `familySchools_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `familyTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`familyId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100) NOT NULL,
	`dueDate` timestamp,
	`isCompleted` tinyint NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `familyTasks_id` PRIMARY KEY(`id`)
);
