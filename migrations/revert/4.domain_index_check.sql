-- Revert kshf:4.domain_index_check from pg

BEGIN;

----- CHECK -----

ALTER TABLE "user" DROP CONSTRAINT wallet_check;
ALTER TABLE "quest" DROP CONSTRAINT difficulty_check;

----- DOMAIN -----

ALTER TABLE "family" ALTER COLUMN level SET DATA TYPE int;
ALTER TABLE "user" ALTER COLUMN level SET DATA TYPE int;

DROP DOMAIN level_d;

ALTER TABLE "shop" ALTER COLUMN price SET DATA TYPE int;
ALTER TABLE "quest" ALTER COLUMN reward_exp SET DATA TYPE int;
ALTER TABLE "quest" ALTER COLUMN reward_coin SET DATA TYPE int;
ALTER TABLE "budget" ALTER COLUMN value SET DATA TYPE int;

DROP DOMAIN positive_value;

ALTER TABLE "user" ALTER COLUMN email SET DATA TYPE text;

DROP DOMAIN email;

ALTER TABLE "user" DROP COLUMN experience;


----- FUNCTION -----

DROP FUNCTION calculate_level;

COMMIT;