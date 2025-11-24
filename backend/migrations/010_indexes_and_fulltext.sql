-- 検索高速化用の全文検索（あらすじ含む）
CREATE INDEX IF NOT EXISTS idx_manga_fulltext
ON manga USING gin (title gin_trgm_ops, description gin_trgm_ops);
