CREATE TABLE IF NOT EXISTS `wallets` (
    `id` VARCHAR(70) NOT NULL,
    `user_id` BIGINT(20) UNSIGNED NOT NULL,
    `balance` INT(11) NOT NULL DEFAULT '0',
    `pin` TEXT NOT NULL,
    PRIMARY KEY (`id`) USING BTREE,
    INDEX `wallet_to_user` (`user_id`) USING BTREE
) ENGINE = InnoDB;