ALTER TABLE `intakeForms` ADD `accountStatus` enum('pending_account','linked','skipped') DEFAULT 'pending_account' NOT NULL;--> statement-breakpoint
ALTER TABLE `intakeForms` ADD `linkedUserId` int;--> statement-breakpoint
ALTER TABLE `intakeForms` ADD CONSTRAINT `intakeForms_linkedUserId_users_id_fk` FOREIGN KEY (`linkedUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;