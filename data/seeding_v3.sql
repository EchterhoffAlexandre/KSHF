BEGIN;

TRUNCATE "user", quest, family, shop, collection, budget, transaction, user_has_friend, user_has_collection, user_has_quest, user_has_shop RESTART IDENTITY;

INSERT INTO family(name,level)
VALUES ('teamdevback', 1),
('teamdevfront', 1);
-- ('frfgredf', 0)

INSERT INTO "user"(email,firstname,lastname,password, isAdmin, family_id, wallet)
VALUES ('echterhoff.a@gmail.com', 'echterhoff', 'alexandre', 'azerty', true, 1, 50),
('guillaumegandolfi@gmail.com','guillaume', 'gandolfi', 'abcd', true, 1, 50),
('abdelaziz@gmail.com', 'abdel', 'aziz', 'azerty', false, 2, 50),
('peterMounier@gmail.com', 'peter', 'mounier', 'azerty', false, 2, 50),
('sondes@gmail.com', 'sondes', 'nefzi', 'azerty', false, 2, 50),
('john@johndoe.com', 'john', 'doe', '$2b$05$i6Hb8iqIYUPNDEeKZ5VX5uEeLkmDwKcdUYFlu/60jvX4pKeGVB/b.', false, 1, 50),
('john@johndoee.com', 'john', 'doee', '$2b$05$qGANHBWteT9Ffwdr56RbzuDHIBihNhUGBAxMi6nkBAL5OjJ07y5k2', true, 1, 50);
-- ('negatif@gmail.com', 'jesuis', 'negatif', 'azerty', false, 1, -50);
-- Les deux johndoe mdp = azerty





INSERT INTO user_has_friend(user_id, friend_id)
VALUES (1,2),(1,3),(1,4),(1,5),(2,5),(2,4),(2,3),(6,1);

INSERT INTO quest(description, difficulty, reward_exp, reward_coin) VALUES 
('Mois sans tabac : nous te demanderons pas d arreter de fumer, mais diminue tes dépenses de moitié !', 3, 150, 150),
('C est la saint valentin, achète des fleurs a ta compagne', 1, 75, 75),
('Noel ! Fait attention a ton budget, mais ne néglige pas tes proches', 2, 100, 100),
('Le printemps est là ! profite en pour aller cueillir quelques fleurs et dire qu elles viennent du fleuriste :)', 1, 50, 50);
-- ('bvefefszef', 3, -20, 50);

INSERT INTO collection (description, category) VALUES
('background vert','Theme'),
('background bleu','Theme'),
('background rouge','Theme'),
('Graphique camembert','Outil financier'),
('Police Impact','Police'),
('Police Roboto','Police');

INSERT INTO shop(price, collection_id) VALUES
(10, 1),
(10, 2),
(80, 3),
(30, 4),
(30, 5);

INSERT INTO user_has_collection(collection_id,user_id) 
VALUES (1,1),(2,1),(3,2),(4,2),(5,2);

INSERT INTO budget(label, value, user_id) VALUES
('Voiture', 1000, 6),
('Courses', 750, 6),
('Vacances', 2000, 6);


INSERT INTO transaction(label, operation, budget_id) VALUES
('Auchan', 150, 2),
('Leclerc',85, 2),
('Intermarché', 100, 2),
('Frein',150, 1),
('Climatisation',80, 1),
('Billet avion',800, 3);





INSERT INTO user_has_quest(user_id, quest_id) VALUES
(1,1),
(1,2),
(2,4),
(2,1),
(6,1),
(6,2),
(6,3),
(6,4);



INSERT INTO user_has_shop(user_id, shop_id) VALUES
(1,1),
(1,2),
(1,3),
(1,4),
(2,1),
(2,2),
(2,3),
(2,4),
(3,1),
(3,2),
(4,3),
(4,4);

COMMIT;