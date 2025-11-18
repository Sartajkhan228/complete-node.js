CREATE TABLE `user_table` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`age` int NOT NULL,
	`email` varchar(255) NOT NULL,
	CONSTRAINT `user_table_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_table_email_unique` UNIQUE(`email`)
);
