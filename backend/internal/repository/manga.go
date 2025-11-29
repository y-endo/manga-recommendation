package repository

import (
	"context"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/y-endo/manga-recommendation/internal/model"
)

type MangaRepository struct {
	DB *pgxpool.Pool
}

func (r *MangaRepository) GetList(ctx context.Context, f model.MangaListFilter) ([]model.MangaListItem, error) {
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
	`

	conds := []string{}
	args := []interface{}{}
	argPos := 1

	if f.Title != nil && *f.Title != "" {
		conds = append(conds, fmt.Sprintf("m.title ILIKE '%%' || $%d || '%%'", argPos))
		args = append(args, *f.Title)
		argPos++
	}
	if f.Author != nil && *f.Author != "" {
		// 作者名は authors テーブルの a.name に対してフィルタ
		conds = append(conds, fmt.Sprintf("a.name ILIKE '%%' || $%d || '%%'", argPos))
		args = append(args, *f.Author)
		argPos++
	}
	if len(f.Genres) > 0 {
		// OR で任意一致: g.name = ANY($n)
		conds = append(conds, fmt.Sprintf("g.name = ANY($%d)", argPos))
		args = append(args, f.Genres)
		argPos++
	}
	if len(f.Tags) > 0 {
		conds = append(conds, fmt.Sprintf("t.name = ANY($%d)", argPos))
		args = append(args, f.Tags)
		argPos++
	}
	if f.PublishedYearMin != nil {
		conds = append(conds, fmt.Sprintf("m.published_year >= $%d", argPos))
		args = append(args, *f.PublishedYearMin)
		argPos++
	}
	if f.PublishedYearMax != nil {
		conds = append(conds, fmt.Sprintf("m.published_year <= $%d", argPos))
		args = append(args, *f.PublishedYearMax)
		argPos++
	}
	if f.MinRating != nil {
		conds = append(conds, fmt.Sprintf("m.avg_rating >= $%d", argPos))
		args = append(args, *f.MinRating)
		argPos++
	}

	if len(conds) > 0 {
		query += "WHERE " + strings.Join(conds, " AND ") + "\n"
	}

	// GROUP BY & ソート
	query += "GROUP BY m.id\n"
	query += "ORDER BY m.likes_count DESC\n"

	// ページネーション (デフォルト値)
	limit := f.Limit
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	offset := (f.Offset - 1) * limit
	query += fmt.Sprintf("LIMIT %d OFFSET %d", limit, offset)

	rows, err := r.DB.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []model.MangaListItem
	for rows.Next() {
		var item model.MangaListItem
		if err := rows.Scan(
			&item.Slug,
			&item.Title,
			&item.Author,
			&item.CoverImage,
			&item.Genres,
			&item.Tags,
			&item.LikesCount,
			&item.AvgRating,
			&item.PublishedYear,
		); err != nil {
			return nil, err
		}
		list = append(list, item)
	}
	return list, rows.Err()
}

func (r *MangaRepository) GetDetail(ctx context.Context, slug string) (*model.MangaDetail, error) {
	query := `
		SELECT * FROM manga_detail_view
		WHERE slug = $1
		LIMIT 1;
	`

	var md model.MangaDetail
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

func (r *MangaRepository) GetGenres(ctx context.Context) ([]model.MangaGenre, error) {
	query := `SELECT id, name FROM genres ORDER BY name;`
	rows, err := r.DB.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	genres := []model.MangaGenre{}

	for rows.Next() {
		var genre model.MangaGenre
		err := rows.Scan(
			&genre.ID,
			&genre.Name,
		)
		if err != nil {
			return nil, err
		}
		genres = append(genres, genre)
	}

	return genres, nil
}

func (r *MangaRepository) GetTags(ctx context.Context) ([]model.MangaTag, error) {
	query := `SELECT id, name FROM tags ORDER BY name;`
	rows, err := r.DB.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tags := []model.MangaTag{}

	for rows.Next() {
		var tag model.MangaTag
		err := rows.Scan(
			&tag.ID,
			&tag.Name,
		)
		if err != nil {
			return nil, err
		}
		tags = append(tags, tag)
	}

	return tags, nil
}

func (r *MangaRepository) GetReviews(ctx context.Context, mangaID string) ([]model.MangaReview, error) {
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

	reviews := []model.MangaReview{}

	for rows.Next() {
		var review model.MangaReview
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
