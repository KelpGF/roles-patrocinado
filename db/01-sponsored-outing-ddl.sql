CREATE DATABASE sponsored_outing;

\c sponsored_outing;

CREATE TABLE users (
    "id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);