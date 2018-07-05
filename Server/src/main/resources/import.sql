INSERT INTO pokemon_go_back.roles (id, name) VALUES (2, 'ROLE_ADMIN');
INSERT INTO pokemon_go_back.roles (id, name) VALUES (1, 'ROLE_USER');
INSERT INTO pokemon_go_back.users (created_at, updated_at, email, name, password, username) VALUES
  (now(), now(), 'ai@pokemongoback.com', 'pokemonai', '$2a$10$y/NYCsjD75NSVLVlPSs8uuqvSOechIYKOLax/IyTqCIx9yus.Xax6',
   'pokemonai');
INSERT INTO pokemon_go_back.user_roles (user_id, role_id) VALUES (1, 1);