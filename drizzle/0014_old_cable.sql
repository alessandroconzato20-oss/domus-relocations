CREATE TABLE `cityCostData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`city` varchar(100) NOT NULL,
	`subArea` varchar(100),
	`profileType` enum('solo','couple','family_children') NOT NULL,
	`rentRangeMin` int NOT NULL,
	`rentRangeMax` int NOT NULL,
	`schoolFeeRangeMin` int,
	`schoolFeeRangeMax` int,
	`setupCostEstimate` int NOT NULL,
	`healthcareCostEstimate` int NOT NULL,
	`domusServiceFeeMin` int NOT NULL,
	`domusServiceFeeMax` int NOT NULL,
	`dataSource` enum('market_only','blended','domus_data') NOT NULL DEFAULT 'market_only',
	`dataQuality` enum('full','limited') NOT NULL DEFAULT 'full',
	`lastUpdatedBy` varchar(255) NOT NULL,
	`lastUpdatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cityCostData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `completedEngagementData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`city` varchar(100) NOT NULL,
	`profileType` enum('solo','couple','family_children') NOT NULL,
	`actualRentPaid` int NOT NULL,
	`actualSchoolFeesPaid` int,
	`actualSetupCost` int NOT NULL,
	`actualTimeToHousing` int,
	`actualTimeToSchoolPlacement` int,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`notes` text,
	CONSTRAINT `completedEngagementData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `corporateAccessCodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`createdByAdminId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`usedAt` timestamp,
	`usedByUserId` int,
	`isActive` tinyint NOT NULL DEFAULT 1,
	CONSTRAINT `corporateAccessCodes_id` PRIMARY KEY(`id`),
	CONSTRAINT `corporateAccessCodes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `corporateAccounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`accessCodeId` int,
	`primaryUserId` int NOT NULL,
	`showFullNames` tinyint NOT NULL DEFAULT 0,
	`isActive` tinyint NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `corporateAccounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `corporateAssignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`corporateAccountId` int NOT NULL,
	`employeeInitials` varchar(10) NOT NULL,
	`employeeFullName` varchar(255),
	`seniorityBand` enum('junior','mid','senior','executive') NOT NULL DEFAULT 'mid',
	`familySize` enum('solo','couple','family_children') NOT NULL DEFAULT 'solo',
	`destinationCity` varchar(100) NOT NULL,
	`startDate` timestamp,
	`status` enum('new','on_track','needs_attention','completed') NOT NULL DEFAULT 'new',
	`milestones` json NOT NULL,
	`progressPercent` int NOT NULL DEFAULT 0,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `corporateAssignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `corporateLeads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`workEmail` varchar(320) NOT NULL,
	`relocationsPerYear` varchar(100) NOT NULL,
	`contactName` varchar(255),
	`message` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `corporateLeads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `corporateAccessCodes` ADD CONSTRAINT `corporateAccessCodes_createdByAdminId_users_id_fk` FOREIGN KEY (`createdByAdminId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `corporateAccessCodes` ADD CONSTRAINT `corporateAccessCodes_usedByUserId_users_id_fk` FOREIGN KEY (`usedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `corporateAccounts` ADD CONSTRAINT `corporateAccounts_accessCodeId_corporateAccessCodes_id_fk` FOREIGN KEY (`accessCodeId`) REFERENCES `corporateAccessCodes`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `corporateAccounts` ADD CONSTRAINT `corporateAccounts_primaryUserId_users_id_fk` FOREIGN KEY (`primaryUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `corporateAssignments` ADD CONSTRAINT `corporateAssignments_corporateAccountId_corporateAccounts_id_fk` FOREIGN KEY (`corporateAccountId`) REFERENCES `corporateAccounts`(`id`) ON DELETE cascade ON UPDATE no action;