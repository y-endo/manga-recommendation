CREATE OR REPLACE VIEW manga_detail_view AS
SELECT
    m.id,
    m.slug,
    m.title,
    m.description,
    m.cover_image,
    m.published_year,
    m.likes_count,
    m.reviews_count,
    m.avg_rating,

    COALESCE(
        ARRAY_AGG(DISTINCT a.name)
        FILTER (WHERE a.id IS NOT NULL),
        '{}'
    ) AS authors,

    COALESCE(
        ARRAY_AGG(DISTINCT g.name)
        FILTER (WHERE g.id IS NOT NULL),
        '{}'
    ) AS genres,

    COALESCE(
        ARRAY_AGG(DISTINCT t.name)
        FILTER (WHERE t.id IS NOT NULL),
        '{}'
    ) AS tags

FROM manga m
LEFT JOIN manga_authors ma ON ma.manga_id = m.id
LEFT JOIN authors a ON ma.author_id = a.id
LEFT JOIN manga_genres mg ON mg.manga_id = m.id
LEFT JOIN genres g ON mg.genre_id = g.id
LEFT JOIN manga_tags mt ON mt.manga_id = m.id
LEFT JOIN tags t ON mt.tag_id = t.id
GROUP BY m.id;
