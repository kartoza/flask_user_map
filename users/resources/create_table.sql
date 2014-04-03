 CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  guid VARCHAR(37) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  role INTEGER DEFAULT 0,
  email_updates BOOL DEFAULT 0,
  date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
  latitude FLOAT,
  longitude FLOAT);

  CREATE TABLE event (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  guid VARCHAR(37) NOT NULL,
  event_type INTEGER DEFAULT 0,
  name TEXT NOT NULL,
  organizer TEXT NOT NULL,
  presenter_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  number_participant INTEGER NOT NULL,
  latitude FLOAT,
  longitude FLOAT);
