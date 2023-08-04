BEGIN;

-- DROP TABLE IF EXISTS shop,collection,quest,transaction,user_has_friend,user_has_family,"user",family,user_has_collection,user_has_quest,user_has_shop CASCADE;

CREATE DOMAIN level_d AS int
    CHECK (VALUE >= 1);

CREATE DOMAIN positive_value AS int
    CHECK (VALUE > 0);

CREATE DOMAIN email AS TEXT 
    CHECK (
        VALUE ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    );

CREATE TABLE family (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    level level_d NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "user" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email email NOT NULL UNIQUE,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    password TEXT NOT NULL,
    level level_d NOT NULL DEFAULT 1,
    experience INT NOT NULL DEFAULT 0,
    wallet int NOT NULL DEFAULT 50 CHECK (wallet >= 0),
    family_id int REFERENCES family(id),
    isAdmin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE collection (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    require_level INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE shop (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    price positive_value NOT NULL,
    collection_id INT REFERENCES collection(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE budget (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    amount positive_value NOT NULL,
    color text NOT NULL,
    user_id int REFERENCES "user"(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE transaction (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    amount numeric NOT NULL,
    budget_id int REFERENCES budget(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);



CREATE TABLE quest (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    description TEXT NOT NULL,
    difficulty int NOT NULL CHECK (difficulty IN (1, 2, 3)), -- 1 easy 2 medium 3 hard
    reward_exp positive_value NOT NULL, -- valeur en expérience
    reward_coin positive_value NOT NULL, -- valeur en or
    reward_item int REFERENCES collection(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE user_has_collection(
    collection_id int REFERENCES collection(id) ON DELETE CASCADE,
    user_id int REFERENCES "user"(id),
    active BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (collection_id, user_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE user_has_friend (
    user_id int REFERENCES "user"(id),
    friend_id int REFERENCES "user"(id),
    date TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, friend_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE user_has_quest (
    user_id int REFERENCES "user"(id),
    quest_id int REFERENCES quest(id),
    PRIMARY KEY (user_id, quest_id),
    state int CHECK (state IN (1, 2, 3)) DEFAULT 1, -- 1 = pas acceptée | 2 = en cours | 3 = terminée
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE user_has_shop (
    user_id int REFERENCES "user"(id),
    shop_id int REFERENCES shop(id) ON DELETE CASCADE,
    date TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, shop_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);


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

COMMIT;