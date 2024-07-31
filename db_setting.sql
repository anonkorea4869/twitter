CREATE TABLE user (
    id VARCHAR(16) NOT NULL PRIMARY KEY,
    pw VARCHAR(257) NOT NULL
);

CREATE TABLE article (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(16) NOT NULL,
    content VARCHAR(280) NOT NULL,
    time DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE comment (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    user_id VARCHAR(16) NOT NULL,
    content VARCHAR(280) NOT NULL,
    time DATETIME NOT NULL,
    FOREIGN KEY (article_id) REFERENCES article(idx),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE comment_like (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    comment_id INT NOT NULL,
    like_id VARCHAR(16) NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comment(idx)
);

CREATE TABLE article_like (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    like_id VARCHAR(16) NOT NULL,
    FOREIGN KEY (article_id) REFERENCES article(idx)
);

CREATE TABLE follow (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    follower_id VARCHAR(16) NOT NULL,
    following_id VARCHAR(16) NOT NULL,
    FOREIGN KEY (follower_id) REFERENCES user(id),
    FOREIGN KEY (following_id) REFERENCES user(id)
);

CREATE TABLE session (
    idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(16) NOT NULL,
    session VARCHAR(256) NOT NULL,
    init_time DATETIME NOT NULL,
    last_time DATETIME NOT NULL,
    manual_expired TINYINT NOT NULL DEFAULT 0
);
