CREATE TABLE user.pv_users(id INT PRIMARY KEY NOT NULL,pageid INT NOT NULL,age INT NOT NULL);
INSERT INTO pv_users (id,pageid, age) VALUES (1,2,25);
SELECT * FROM pv_users;
SELECT pageid, age, count(1) as count FROM pv_users GROUP BY pageid, age;