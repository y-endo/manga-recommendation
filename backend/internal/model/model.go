package model

import "time"

type MangaListItem struct {
	Slug          string   `json:"slug"`
	Title         string   `json:"title"`
	Author        string   `json:"author"`
	CoverImage    *string  `json:"cover_image"`
	Genres        []string `json:"genres"`
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

type MangaGenre struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type MangaTag struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type MangaReview struct {
	Rating       int       `json:"rating"`
	Title        string    `json:"title"`
	Body         string    `json:"body"`
	HelpfulCount int       `json:"helpful_count"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type MangaListFilter struct {
	Title            *string
	Author           *string
	Genres           []string
	Tags             []string
	PublishedYearMin *int
	PublishedYearMax *int
	MinRating        *float64
	Limit            int
	Offset           int
}
