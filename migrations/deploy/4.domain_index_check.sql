-- Deploy kshf:4.domain_index_check to pg

BEGIN;


----- CHECK -----

-- wallet check
ALTER TABLE "user" ADD CONSTRAINT wallet_check CHECK (wallet >= 0);
-- difficulty check
ALTER TABLE "quest" ADD CONSTRAINT difficulty_check CHECK (difficulty IN (1, 2, 3));

----- DOMAIN -----

-- domain level
CREATE DOMAIN level_d AS int
    CHECK (VALUE >= 1);

ALTER TABLE "family" ALTER COLUMN level SET DATA TYPE level_d;
ALTER TABLE "user" ALTER COLUMN level SET DATA TYPE level_d;

-- domain positive
CREATE DOMAIN positive_value AS int
    CHECK (VALUE > 0);

ALTER TABLE "shop" ALTER COLUMN price SET DATA TYPE positive_value;
ALTER TABLE "quest" ALTER COLUMN reward_exp SET DATA TYPE positive_value;
ALTER TABLE "quest" ALTER COLUMN reward_coin SET DATA TYPE positive_value;
ALTER TABLE "budget" ALTER COLUMN amount SET DATA TYPE positive_value;

-- domain email
CREATE DOMAIN email AS TEXT 
CHECK (
    VALUE ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
);

ALTER TABLE "user" 
    ALTER COLUMN email SET DATA TYPE email;


ALTER TABLE "user" 
    ADD COLUMN experience INT NOT NULL DEFAULT 0;
    

----- FONCTION -----
CREATE OR REPLACE FUNCTION calculate_level(user_id INT, quest_exp INT) RETURNS INT AS $$
    DECLARE 
        current_experience INT;
        current_level INT;
        total_experience INT;
    BEGIN
        -- Recuperer l'experience et le level de l'utilisateur
        SELECT experience, level
        INTO current_experience, current_level
        FROM "user"
        WHERE id = user_id;

        total_experience := current_experience + quest_exp;

        IF total_experience >= (current_level * 100) THEN
            UPDATE "user"
            SET level = current_level + 1, experience = total_experience
            WHERE id = user_id;
            RETURN current_level + 1;
        ELSE
            UPDATE "user"
            SET experience = total_experience
            WHERE id = user_id;
            RETURN current_level;
        END IF;
    END;
$$ LANGUAGE plpgsql;

-- SELECT calculate_level(3 , (SELECT reward_exp FROM quest WHERE id = 1));

COMMIT;
