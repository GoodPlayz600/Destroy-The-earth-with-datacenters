CREATE TABLE leaderboard (
  player_id TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('standard', 'noCompute', 'leanPower')),
  name TEXT NOT NULL,
  cells INTEGER NOT NULL CHECK (cells BETWEEN 0 AND 65536),
  earned INTEGER NOT NULL CHECK (earned >= 0),
  completion INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (player_id, mode)
);
--> statement-breakpoint
CREATE INDEX leaderboard_mode_rank ON leaderboard (mode, cells DESC, (completion IS NULL), completion ASC, earned DESC, updated_at ASC);
