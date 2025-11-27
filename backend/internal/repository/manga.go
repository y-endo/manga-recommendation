package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type MangaListItem struct {
	Slug          string   `json:"slug"`
	Title         string   `json:"title"`
	Author        string   `json:"author"`
	CoverImage    *string  `json:"cover_image"`
	Genre         []string `json:"genre"`
	Tags          []string `json:"tags"`
	LikesCount    int      `json:"likes_count"`
	AvgRating     float64  `json:"avg_rating"`
	PublishedYear int      `json:"published_year"`
}

type MangaDetail struct {
	Slug          string   `json:"slug"`
	Title         string   `json:"title"`
	Description   string   `json:"description"`
	CoverImage    *string  `json:"cover_image"`
	PublishedYear int      `json:"published_year"`
	LikesCount    int      `json:"likes_count"`
	ReviewsCount  int      `json:"reviews_count"`
	AvgRating     float64  `json:"avg_rating"`
	Authors       []string `json:"authors"`
	Genres        []string `json:"genres"`
	Tags          []string `json:"tags"`
}

type MangaReview struct {
	Rating       int       `json:"rating"`
	Title        string    `json:"title"`
	Body         string    `json:"body"`
	HelpfulCount int       `json:"helpful_count"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type MangaRepository struct {
	DB *pgxpool.Pool
}

func (r *MangaRepository) GetList(ctx context.Context) ([]MangaListItem, error) {
	query := `
		SELECT
			m.slug,
			m.title,
			COALESCE(
				STRING_AGG(DISTINCT a.name, ', ')
				FILTER (WHERE a.name IS NOT NULL),
				''
			) AS author,
			m.cover_image,
			COALESCE(
				ARRAY_AGG(DISTINCT g.name)
				FILTER (WHERE g.name IS NOT NULL),
				'{}'
			) AS genres,
			COALESCE(
				ARRAY_AGG(DISTINCT t.name)
				FILTER (WHERE t.name IS NOT NULL),
				'{}'
			) AS tags,
			m.likes_count,
			m.avg_rating,
			m.published_year
		FROM manga m
		LEFT JOIN manga_authors ma ON ma.manga_id = m.id
		LEFT JOIN authors a ON ma.author_id = a.id
		LEFT JOIN manga_genres mg ON mg.manga_id = m.id
		LEFT JOIN genres g ON mg.genre_id = g.id
		LEFT JOIN manga_tags mt ON mt.manga_id = m.id
		LEFT JOIN tags t ON mt.tag_id = t.id
		GROUP BY m.id
		ORDER BY m.likes_count DESC;
	`

	rows, err := r.DB.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	list := []MangaListItem{}

	for rows.Next() {
		var item MangaListItem
		err := rows.Scan(
			&item.Slug,
			&item.Title,
			&item.Author,
			&item.CoverImage,
			&item.Genre,
			&item.Tags,
			&item.LikesCount,
			&item.AvgRating,
			&item.PublishedYear,
		)
		if err != nil {
			return nil, err
		}
		list = append(list, item)
	}

	return list, nil
}

func (r *MangaRepository) GetDetail(ctx context.Context, slug string) (*MangaDetail, error) {
	query := `
		SELECT * FROM manga_detail_view
		WHERE slug = $1
		LIMIT 1;
	`

	var md MangaDetail
	err := r.DB.QueryRow(ctx, query, slug).Scan(
		&md.Slug,
		&md.Title,
		&md.Description,
		&md.CoverImage,
		&md.PublishedYear,
		&md.LikesCount,
		&md.ReviewsCount,
		&md.AvgRating,
		&md.Authors,
		&md.Genres,
		&md.Tags,
	)
	if err != nil {
		return nil, err
	}

	return &md, nil
}

func (r *MangaRepository) GetReviews(ctx context.Context, mangaID string) ([]MangaReview, error) {
	query := `
		SELECT
			r.rating,
			r.title,
			r.body,
			r.helpful_count,
			r.created_at,
			r.updated_at
		FROM reviews r
		WHERE r.manga_id = $1
		ORDER BY r.created_at DESC;
	`

	rows, err := r.DB.Query(ctx, query, mangaID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reviews := []MangaReview{}

	for rows.Next() {
		var review MangaReview
		err := rows.Scan(
			&review.Rating,
			&review.Title,
			&review.Body,
			&review.HelpfulCount,
			&review.CreatedAt,
			&review.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		reviews = append(reviews, review)
	}

	return reviews, nil
}
