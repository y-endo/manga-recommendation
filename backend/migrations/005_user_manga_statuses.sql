DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reading_status') THEN
    CREATE TYPE reading_status AS ENUM ('reading', 'completed', 'plan_to_read');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS user_manga_statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    manga_id UUID NOT NULL REFERENCES manga(id) ON DELETE CASCADE,
    status reading_status NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, manga_id)
);

CREATE INDEX IF NOT EXISTS idx_status_user ON user_manga_statuses(user_id);
CREATE INDEX IF NOT EXISTS idx_status_manga ON user_manga_statuses(manga_id);
