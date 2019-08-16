BEGIN;

TRUNCATE
    projects,
    skills,
    users 
    RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, password, full_name, title, bio, theme_color, github_url, linkedin_url, email_address)
VALUES
    ('chucknorris','$2a$12$WnOgXzPQ/1qz5aynhdWlVeFjbdy8iAnmITbg27I/rq1zSZ4u/m34u','Chuck Norris','Fullstack Ass Kicker', 'Let''s get one thing straight... there''s nothing soft about my software. My programs don''t have version numbers because I only write them once. My code optimizes itself. I don''t use debuggers; I just stare down the bugs until the code confesses. If users report a bug or have a feature request, they don''t live to see the sun set.','blue', 'https://github.com/charlesnorris', 'https://www.linkedin.com/in/chuck-norris-90123b179/','totallynotchucknorris@roundhouse.bam');

INSERT INTO skills (name)
VALUES
    ('JavaScript'),
    ('HTML'),
    ('CSS'),
    ('jQuery'),
    ('Node'),
    ('React'),
    ('Angular'),
    ('Rails'),
    ('Ruby'),
    ('Python'),
    ('PHP'),
    ('Java'),
    ('SQL'),
    ('NoSQL');

INSERT INTO projects (name, description, skills, github_url, demo_url, image_url, user_id)
VALUES
    ('Roundhouse', 'Watch me kick some people. HARD!', '{1, 2, 3, 5, 6}', 'https://github.com/charlesnorris/roundhouse', 'https://www.youtube.com/watch?v=E6UTz_Doic8', 'https://www.shesavvy.com/blog/wp-content/uploads/2016/06/chuck.png', 1),
    ('Bazooka Blast', 'Watch me blow up this helicopter with a bazooka. HARD!', '{8, 9, 14}', 'https://github.com/charlesnorris/bazooka-blast', 'https://www.youtube.com/watch?v=n_BZ-Pl0yMs', 'https://miro.medium.com/max/1600/1*NjpAK6PH9B1JcDYXb6MoFw.jpeg', 1),
    ('Fighting Loggers', 'Watch me fight some people in the woods. HARD!', '{1, 2, 3, 4, 13}', 'https://github.com/charlesnorris/fighting-loggers', 'https://www.youtube.com/watch?v=6DEeSM7o1LA', 'https://secondclasscinema.podbean.com/mf/web/ndbu93/ForestWarriorEpImage.jpg', 1);

COMMIT;
