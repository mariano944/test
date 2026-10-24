CREATE DATABASE IF NOT EXISTS matchday
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE matchday;

CREATE TABLE IF NOT EXISTS matches (
  id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
  competition_code VARCHAR(12) NOT NULL,
  competition_name VARCHAR(100) NOT NULL,
  kickoff_at DATETIME NOT NULL,
  status VARCHAR(24) NOT NULL,
  matchday SMALLINT UNSIGNED NULL,
  home_team VARCHAR(120) NOT NULL,
  away_team VARCHAR(120) NOT NULL,
  home_score SMALLINT UNSIGNED NULL,
  away_score SMALLINT UNSIGNED NULL,
  provider_updated_at DATETIME NULL,
  cached_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  raw_json JSON NOT NULL,
  KEY idx_matches_competition_kickoff (competition_code, kickoff_at),
  KEY idx_matches_status_kickoff (status, kickoff_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS standings (
  competition_code VARCHAR(12) NOT NULL,
  position SMALLINT UNSIGNED NOT NULL,
  team_name VARCHAR(120) NOT NULL,
  played SMALLINT UNSIGNED NOT NULL,
  goal_difference SMALLINT NOT NULL,
  points SMALLINT UNSIGNED NOT NULL,
  provider_updated_at DATETIME NULL,
  cached_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  raw_json JSON NOT NULL,
  PRIMARY KEY (competition_code, position),
  KEY idx_standings_team (team_name)
) ENGINE=InnoDB;

