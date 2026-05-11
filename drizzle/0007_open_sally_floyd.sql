CREATE TABLE `totpSecrets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`secret` varchar(255) NOT NULL,
	`backupCodes` text NOT NULL,
	`isEnabled` tinyint NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`enabledAt` timestamp,
	CONSTRAINT `totpSecrets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `totpSecrets` ADD CONSTRAINT `totpSecrets_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;