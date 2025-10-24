CREATE TABLE `chatHistory` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`message` text NOT NULL,
	`response` text NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `chatHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gameProgress` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`gameType` varchar(50) NOT NULL,
	`celestialObject` varchar(100),
	`score` varchar(20),
	`completedAt` timestamp DEFAULT (now()),
	CONSTRAINT `gameProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `publicImages` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`imageUrl` text NOT NULL,
	`celestialObjectTag` varchar(100),
	`description` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `publicImages_id` PRIMARY KEY(`id`)
);
