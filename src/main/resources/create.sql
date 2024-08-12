CREATE DATABASE "backoffice";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS "voucher";
DROP TABLE IF EXISTS "activity_day";
DROP TABLE IF EXISTS "activity";
DROP TABLE IF EXISTS "track";
DROP TABLE IF EXISTS "file";
DROP TABLE IF EXISTS "user";

CREATE TABLE "user" (
  "id"       UUID,
  "name"     VARCHAR,
  "email"    VARCHAR UNIQUE,
  "phone"    VARCHAR,
  "password" VARCHAR,
  PRIMARY KEY ("id")
);

CREATE TABLE "activity" (
  "id"          UUID,
  "title"       VARCHAR,
  "subtitle"    VARCHAR,
  "description" VARCHAR,
  "images"      JSONB,
  "created_at"  TIMESTAMP,
  "created_by"  UUID,
  "updated_at"  TIMESTAMP,
  "updated_by"  UUID,
  "deleted_at"  TIMESTAMP,
  "deleted_by"  UUID,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("created_by") REFERENCES "user"("id"),
  FOREIGN KEY ("updated_by") REFERENCES "user"("id"),
  FOREIGN KEY ("deleted_by") REFERENCES "user"("id")
);

CREATE TABLE "file" (
  "id"         UUID,
  "name"       VARCHAR,
  "type"       VARCHAR,
  "size"       BIGINT,
  "content"    BYTEA,
  "created_at" TIMESTAMP,
  "created_by" UUID,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("created_by") REFERENCES "user"("id")
);

CREATE TABLE "activity_day" (
  "id"            UUID,
  "activity_id"   UUID,
  "title"         VARCHAR,
  "description"   VARCHAR,
  "images"        JSONB,
  "track"         JSONB,
  "markers"       JSONB,
  "directions"    VARCHAR,
  "created_at"    TIMESTAMP,
  "created_by"    UUID,
  "updated_at"    TIMESTAMP,
  "updated_by"    UUID,
  "deleted_at"    TIMESTAMP,
  "deleted_by"    UUID,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("activity_id") REFERENCES "activity"("id"),
  FOREIGN KEY ("created_by")  REFERENCES "user"("id"),
  FOREIGN KEY ("updated_by")  REFERENCES "user"("id"),
  FOREIGN KEY ("deleted_by")  REFERENCES "user"("id")
);

CREATE TABLE "voucher" (
  "id"             UUID,
  "activity_id"    UUID,
  "start_date"     DATE,
  "client_name"    VARCHAR,
  "client_phone"   VARCHAR,
  "client_email"   VARCHAR,
  "voucher"        VARCHAR UNIQUE,
  "redeem_date"    TIMESTAMP,
  "created_at"     TIMESTAMP,
  "created_by"     UUID,
  "updated_at"     TIMESTAMP,
  "updated_by"     UUID,
  "deleted_at"     TIMESTAMP,
  "deleted_by"     UUID,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("activity_id") REFERENCES "activity"("id"),
  FOREIGN KEY ("created_by")  REFERENCES "user"("id"),
  FOREIGN KEY ("updated_by")  REFERENCES "user"("id"),
  FOREIGN KEY ("deleted_by")  REFERENCES "user"("id")
);


-- DELETE FROM "user";
INSERT INTO "user" ("id", "name", "email", "phone", "password") VALUES
(uuid_generate_v4(), 'Henrique Lourenço', 'henrique@legendatours.com', '+351 960170789', '$2a$12$mTaRyqUGIOw9xprcRsJFVu9dGnwQX5gELtDZRbZjFQMbeFjxtC74e'),
(uuid_generate_v4(), 'Rafael Marmelo', 'rafael@bitstream.pt', '+351 964158903', '$2a$12$tqV7OBYC7fR5r7TzegN2r.DVgTLjgj7bfjdzNFAIJq0KVHNL9PqOq');
-- SELECT * FROM "user";

-- 2020-06-09 add multiple track routes
-- CREATE TABLE activity_day_20200609 AS SELECT * FROM activity_day;
-- UPDATE activity_day SET track = track || jsonb_build_object('routes', jsonb_build_array(track->'points'));

-- 2020-06-17 add multiple track files
-- UPDATE activity_day SET track = track || jsonb_build_object('files', jsonb_build_array(track->'fileId'));
-- UPDATE activity_day SET track = track - 'fileId';
