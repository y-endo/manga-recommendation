CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS manga_embeddings (
    manga_id UUID PRIMARY KEY REFERENCES manga(id) ON DELETE CASCADE,
    embedding vector(1536),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS review_embeddings (
    review_id UUID PRIMARY KEY REFERENCES reviews(id) ON DELETE CASCADE,
    manga_id UUID NOT NULL REFERENCES manga(id) ON DELETE CASCADE,
    embedding vector(1536),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_manga_embedding ON manga_embeddings USING ivfflat (embedding vector_l2_ops);
CREATE INDEX IF NOT EXISTS idx_review_embedding ON review_embeddings USING ivfflat (embedding vector_l2_ops);
