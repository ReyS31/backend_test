CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `date_of_birth` VARCHAR(15) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
    `street_address` TEXT NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `province` VARCHAR(50) NOT NULL,
    `telephone` VARCHAR(25) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` TEXT NOT NULL,
    `registered_at` TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;