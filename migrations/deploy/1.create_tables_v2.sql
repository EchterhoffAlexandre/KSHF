BEGIN;

-- DROP TABLE IF EXISTS shop,collection,quest,transaction,user_has_friend,user_has_family,"user",family,user_has_collection,user_has_quest,user_has_shop CASCADE;

CREATE TABLE family (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    level int NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "user" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    password TEXT NOT NULL,
    level int NOT NULL DEFAULT 1,
    wallet int NOT NULL DEFAULT 50,
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
    price int NOT NULL,
    collection_id INT REFERENCES collection(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE transaction (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name text,
    amount int NOT NULL,
    user_id int REFERENCES "user"(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE quest (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    description TEXT NOT NULL,
    difficulty int NOT NULL, -- 1 easy 2 medium 3 hard
    reward_exp int NOT NULL, -- valeur en expérience
    reward_coin int NOT NULL, -- valeur en or
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

COMMIT;