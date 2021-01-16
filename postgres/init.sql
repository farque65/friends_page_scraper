CREATE TABLE IF NOT EXISTS table_script_lines(
	character CHAR(50),
	line_number INT,
	line_type CHAR(50),
	script_line VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS table_episodes(
	episode_number INT,
	season INT,
	description VARCHAR(255),
	link VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS table_characters (
	full_name VARCHAR(255),
	first_name VARCHAR(255),
	picture bytea
);
GRANT ALL PRIVILEGES ON DATABASE db_friends TO postgres;
INSERT INTO table_characters(full_name, first_name) VALUES ('Rachel Green', 'Rachel');
INSERT INTO table_characters(full_name, first_name) VALUES ('Joey Tribbiani', 'Joey');
INSERT INTO table_characters(full_name, first_name) VALUES ('Phoebe Buffay', 'Phoebe');
INSERT INTO table_characters(full_name, first_name) VALUES ('Ross Geller', 'Ross');
INSERT INTO table_characters(full_name, first_name) VALUES ('Chandler Bing', 'Chandler');