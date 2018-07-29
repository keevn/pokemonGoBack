INSERT INTO pokemon_go_back.roles (id, name) VALUES (2, 'ROLE_ADMIN');
INSERT INTO pokemon_go_back.roles (id, name) VALUES (1, 'ROLE_USER');
INSERT INTO pokemon_go_back.users (created_at, updated_at, email, name, password, username) VALUES (now(), now(), 'ai@pokemongoback.com', 'pokemonai', '$2a$10$y/NYCsjD75NSVLVlPSs8uuqvSOechIYKOLax/IyTqCIx9yus.Xax6','pokemonai');
INSERT INTO pokemon_go_back.user_roles (user_id, role_id) VALUES (1, 1);
INSERT INTO pokemon_go_back.users (created_at, updated_at, email, name, password, username) VALUES (now(), now(), 'player1@pokemongoback.com', 'User1 Demo', '$2a$10$obfUkAEQvaM1dmE1wWrhJOoTbTfnnXF9V/JhMAqZFoS2I5t3QPCfq','player1');
INSERT INTO pokemon_go_back.user_roles (user_id, role_id) VALUES (2, 1);
INSERT INTO pokemon_go_back.users (created_at, updated_at, email, name, password, username) VALUES (now(), now(), 'player2@pokemongoback.com', 'User2 Demo', '$2a$10$xtQWArzfoDPp0kkl/Osb3eB4Fe9OLvU/Y1RRcPPov1Lca6uoAF6lC','player2');
INSERT INTO pokemon_go_back.user_roles (user_id, role_id) VALUES (3, 1);
INSERT INTO pokemon_go_back.user_decks (created_at, updated_at, content, deck_name, user_id) VALUES ( '2018-07-29 21:46:23', '2018-07-29 21:46:23', '25,3,16,1,25,4,5,6,6,14,25,26,25,25,7,20,8,10,25,9,3,9,11,7,26,26,12,25,26,8,14,12,13,2,1,26,25,25,26,26,17,19,15,2,20,26,17,20,18,18,26,26,22,23,24,11,21,13,21,25', 'deck2', 2);
INSERT INTO pokemon_go_back.user_decks (created_at, updated_at, content, deck_name, user_id) VALUES ( '2018-07-29 21:46:27', '2018-07-29 21:46:27', '51,52,53,58,44,43,33,32,57,57,34,35,33,33,45,46,28,31,46,47,29,57,58,57,57,55,58,56,58,58,58,57,48,57,57,38,58,58,34,36,37,54,39,52,41,49,50,37,58,39,40,40,57,47,36,30,58,54,57,30', 'deck1', 2);
UPDATE pokemon_go_back.users SET default_deck_id=1 WHERE id=2