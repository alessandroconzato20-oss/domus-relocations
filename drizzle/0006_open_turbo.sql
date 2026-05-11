CREATE TABLE `trustedNetworkContacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` varchar(255) NOT NULL,
	`category` enum('Medical','Legal & Tax','Education','Property','Lifestyle & Home','Social & Community') NOT NULL,
	`endorsement` text NOT NULL,
	`contactMethod` enum('email','phone') NOT NULL,
	`contactValue` varchar(255) NOT NULL,
	`imageUrl` varchar(512),
	`isActive` tinyint NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trustedNetworkContacts_id` PRIMARY KEY(`id`)
);
