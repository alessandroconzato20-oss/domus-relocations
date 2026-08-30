CREATE TABLE `intakeSubmissionLimits` (
	`ipHash` varchar(64) NOT NULL,
	`windowStartedAt` timestamp NOT NULL,
	`submissionCount` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `intakeSubmissionLimits_ipHash` PRIMARY KEY(`ipHash`)
);
