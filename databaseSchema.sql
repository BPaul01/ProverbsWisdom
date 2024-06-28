CREATE TABLE app_user (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password_hash VARCHAR(255) NOT NULL
        );

CREATE TABLE conversation (
            id SERIAL PRIMARY KEY,
            userId INTEGER NOT NULL,
            FOREIGN KEY (userId) REFERENCES app_user(id)
        );

CREATE TABLE messages (
            id SERIAL PRIMARY KEY,
            conversationId INTEGER NOT NULL,
            position INTEGER NOT NULL,
            text TEXT NOT NULL,
            role VARCHAR(50) NOT NULL,
            FOREIGN KEY (conversationId) REFERENCES conversation(id)
        );