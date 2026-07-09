ALTER TABLE `clientProfiles` ADD `clientPreview` text;--> statement-breakpoint
ALTER TABLE `clientProfiles` ADD `clientPreviewGeneratedAt` timestamp;--> statement-breakpoint
ALTER TABLE `clientProfiles` ADD `clientPreviewReadAt` timestamp;--> statement-breakpoint
ALTER TABLE `clientProfiles` ADD `clientPreviewPublished` tinyint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `intakeForms` ADD `clientPreviewContent` text;--> statement-breakpoint
ALTER TABLE `intakeForms` ADD `clientPreviewPublished` tinyint DEFAULT 0 NOT NULL;