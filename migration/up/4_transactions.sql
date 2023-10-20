CREATE TABLE IF NOT EXISTS `transactions` (
	`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
	`wallet_id` VARCHAR(70) NOT NULL DEFAULT '',
	`amount` INT(10) UNSIGNED NOT NULL DEFAULT '0',
	`newest_wallet_balance` INT(10) UNSIGNED NOT NULL DEFAULT '0',
	`latest_wallet_balance` INT(10) UNSIGNED NOT NULL DEFAULT '0',
	`operation` ENUM('ADD','SUB') NOT NULL,
	`created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `transation_to_wallet` (`wallet_id`) USING BTREE
)
ENGINE=InnoDB
;
