-- Deploy kshf:3.rework_transaction_table to pg

BEGIN;

CREATE TABLE budget (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    amount int NOT NULL,
    color text NOT NULL,
    user_id int REFERENCES "user"(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

ALTER TABLE transaction
    DROP COLUMN date,
    DROP COLUMN user_id,
    ADD COLUMN budget_id int REFERENCES budget(id);


COMMIT;
