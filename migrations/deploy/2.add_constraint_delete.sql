-- Deploy kshf:2.add_constrainst_delete to pg

BEGIN;

--  shop --

ALTER TABLE shop
DROP CONSTRAINT IF EXISTS shop_collection_id_fkey;

ALTER TABLE shop
ADD CONSTRAINT shop_collection_id_fkey
FOREIGN KEY (collection_id)
REFERENCES collection(id)
ON DELETE CASCADE;


--  user_has_collection --
ALTER TABLE user_has_collection
DROP CONSTRAINT IF EXISTS user_has_collection_pkey;

ALTER TABLE user_has_collection
ADD CONSTRAINT user_has_collection_pkey
FOREIGN KEY (collection_id)
REFERENCES collection(id)
ON DELETE CASCADE;


--  user_has_shop --
ALTER TABLE user_has_shop
DROP CONSTRAINT IF EXISTS user_has_shop_pkey;

ALTER TABLE user_has_shop
ADD CONSTRAINT user_has_shop_pkey
FOREIGN KEY (shop_id)
REFERENCES shop(id)
ON DELETE CASCADE;




COMMIT;
