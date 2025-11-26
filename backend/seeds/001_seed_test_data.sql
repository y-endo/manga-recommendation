CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    -- ユーザー
    admin_user_id UUID;
    user_taro_id  UUID;
    user_hanako_id UUID;

    -- 作者
    author_naruto UUID;
    author_bleach UUID;
    author_kimetsu UUID;

    -- ジャンル（genres.id は SERIAL なので INTEGER）
    genre_shonen_id          INTEGER;
    genre_battle_action_id   INTEGER;
    genre_dark_fantasy_id    INTEGER;
    genre_japanese_fantasy_id INTEGER;

    -- 漫画
    manga_naruto_id UUID;
    manga_bleach_id UUID;
    manga_kimetsu_id UUID;

    -- レビュー
    review_naruto_admin_id UUID;
    review_naruto_taro_id  UUID;
    review_bleach_admin_id UUID;
    review_bleach_hanako_id UUID;
    review_kimetsu_admin_id UUID;
    review_kimetsu_taro_id  UUID;
    review_kimetsu_hanako_id UUID;
BEGIN
    -----------------------------------------
    -- ユーザー
    -----------------------------------------
    -- 管理者
    INSERT INTO users (email, username, user_slug, password_hash, role)
    VALUES (
        'a@gmail.com',
        '管理者ユーザー',
        'a',
        crypt('a', gen_salt('bf')), -- password: a（開発用）
        'admin'
    )
    ON CONFLICT (email) DO UPDATE
      SET username = EXCLUDED.username,
          role = EXCLUDED.role
    RETURNING id INTO admin_user_id;

    -- 一般ユーザー1
    INSERT INTO users (email, username, user_slug, password_hash, role)
    VALUES (
        'taro@example.com',
        '太郎',
        'taro',
        crypt('password1', gen_salt('bf')),
        'user'
    )
    ON CONFLICT (email) DO UPDATE
      SET username = EXCLUDED.username
    RETURNING id INTO user_taro_id;

    -- 一般ユーザー2
    INSERT INTO users (email, username, user_slug, password_hash, role)
    VALUES (
        'hanako@example.com',
        '花子',
        'hanako',
        crypt('password2', gen_salt('bf')),
        'user'
    )
    ON CONFLICT (email) DO UPDATE
      SET username = EXCLUDED.username
    RETURNING id INTO user_hanako_id;

    -----------------------------------------
    -- プロフィール
    -----------------------------------------
    INSERT INTO user_profiles (user_id, bio)
    VALUES
      (admin_user_id, '漫画レコメンドアプリの管理者です。'),
      (user_taro_id,  '少年漫画が大好きな社会人エンジニアです。'),
      (user_hanako_id,'ダークファンタジーと感動系の作品が好きです。')
    ON CONFLICT (user_id) DO UPDATE
      SET bio = EXCLUDED.bio,
          updated_at = now();

    -----------------------------------------
    -- フォロー
    -----------------------------------------
    INSERT INTO user_follows (follower_id, followee_id) VALUES
      (user_taro_id, admin_user_id),
      (user_hanako_id, admin_user_id),
      (admin_user_id, user_taro_id)
    ON CONFLICT DO NOTHING;

    -----------------------------------------
    -- 作者
    -----------------------------------------
    INSERT INTO authors (name)
    VALUES ('岸本斉史')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO author_naruto;

    INSERT INTO authors (name)
    VALUES ('久保帯人')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO author_bleach;

    INSERT INTO authors (name)
    VALUES ('吾峠呼世晴')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO author_kimetsu;

    -----------------------------------------
    -- ジャンル（すべて日本語）
    -----------------------------------------
    INSERT INTO genres (name)
    VALUES ('少年漫画')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO genre_shonen_id;

    INSERT INTO genres (name)
    VALUES ('バトル')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO genre_battle_action_id;

    INSERT INTO genres (name)
    VALUES ('ダークファンタジー')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO genre_dark_fantasy_id;

    INSERT INTO genres (name)
    VALUES ('和風')
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO genre_japanese_fantasy_id;

    -----------------------------------------
    -- 漫画
    -----------------------------------------
    INSERT INTO manga (slug, title, description, cover_image, published_year)
    VALUES (
        'naruto',
        'NARUTO -ナルト-',
        '落ちこぼれ忍者・うずまきナルトが火影を目指して成長していく王道バトル作品。',
        NULL,
        1999
    )
    ON CONFLICT (slug) DO UPDATE
      SET title = EXCLUDED.title,
          description = EXCLUDED.description,
          published_year = EXCLUDED.published_year
    RETURNING id INTO manga_naruto_id;

    INSERT INTO manga (slug, title, description, cover_image, published_year)
    VALUES (
        'bleach',
        'BLEACH',
        '死神代行となった高校生・黒崎一護が虚や死神たちと戦うスタイリッシュバトルアクション。',
        NULL,
        2001
    )
    ON CONFLICT (slug) DO UPDATE
      SET title = EXCLUDED.title,
          description = EXCLUDED.description,
          published_year = EXCLUDED.published_year
    RETURNING id INTO manga_bleach_id;

    INSERT INTO manga (slug, title, description, cover_image, published_year)
    VALUES (
        'kimetsu-no-yaiba',
        '鬼滅の刃',
        '家族を鬼に殺された少年・竈門炭治郎が鬼殺隊として鬼と戦う和風ダークファンタジー。',
        NULL,
        2016
    )
    ON CONFLICT (slug) DO UPDATE
      SET title = EXCLUDED.title,
          description = EXCLUDED.description,
          published_year = EXCLUDED.published_year
    RETURNING id INTO manga_kimetsu_id;

    -----------------------------------------
    -- 漫画と作者
    -----------------------------------------
    INSERT INTO manga_authors (manga_id, author_id) VALUES
      (manga_naruto_id,  author_naruto),
      (manga_bleach_id,  author_bleach),
      (manga_kimetsu_id, author_kimetsu)
    ON CONFLICT DO NOTHING;

    -----------------------------------------
    -- 漫画とジャンル（日本語名）
    -----------------------------------------
    INSERT INTO manga_genres (manga_id, genre_id) VALUES
      -- NARUTO
      (manga_naruto_id,  genre_shonen_id),
      (manga_naruto_id,  genre_battle_action_id),

      -- BLEACH
      (manga_bleach_id,  genre_shonen_id),
      (manga_bleach_id,  genre_battle_action_id),
      (manga_bleach_id,  genre_dark_fantasy_id),

      -- 鬼滅の刃
      (manga_kimetsu_id, genre_shonen_id),
      (manga_kimetsu_id, genre_battle_action_id),
      (manga_kimetsu_id, genre_dark_fantasy_id),
      (manga_kimetsu_id, genre_japanese_fantasy_id)
    ON CONFLICT DO NOTHING;

    -----------------------------------------
    -- 読書ステータス（user_manga_statuses）
    -----------------------------------------
    -- admin
    INSERT INTO user_manga_statuses (user_id, manga_id, status, is_public)
    VALUES
      (admin_user_id, manga_naruto_id,  'completed',    TRUE),
      (admin_user_id, manga_bleach_id,  'plan_to_read', TRUE),
      (admin_user_id, manga_kimetsu_id, 'completed',    TRUE)
    ON CONFLICT (user_id, manga_id) DO UPDATE
      SET status = EXCLUDED.status,
          is_public = EXCLUDED.is_public,
          updated_at = now();

    -- 太郎
    INSERT INTO user_manga_statuses (user_id, manga_id, status, is_public)
    VALUES
      (user_taro_id, manga_naruto_id,  'completed',    TRUE),
      (user_taro_id, manga_bleach_id,  'completed',    TRUE),
      (user_taro_id, manga_kimetsu_id, 'plan_to_read', TRUE)
    ON CONFLICT (user_id, manga_id) DO UPDATE
      SET status = EXCLUDED.status,
          is_public = EXCLUDED.is_public,
          updated_at = now();

    -- 花子
    INSERT INTO user_manga_statuses (user_id, manga_id, status, is_public)
    VALUES
      (user_hanako_id, manga_naruto_id,  'reading',     TRUE),
      (user_hanako_id, manga_kimetsu_id, 'completed',   TRUE)
    ON CONFLICT (user_id, manga_id) DO UPDATE
      SET status = EXCLUDED.status,
          is_public = EXCLUDED.is_public,
          updated_at = now();

    -----------------------------------------
    -- いいね（manga_likes）
    -----------------------------------------
    INSERT INTO manga_likes (user_id, manga_id) VALUES
      (admin_user_id, manga_naruto_id),
      (admin_user_id, manga_bleach_id),
      (admin_user_id, manga_kimetsu_id),

      (user_taro_id,  manga_naruto_id),
      (user_taro_id,  manga_kimetsu_id),

      (user_hanako_id, manga_bleach_id),
      (user_hanako_id, manga_kimetsu_id)
    ON CONFLICT DO NOTHING;

    -----------------------------------------
    -- レビュー（reviews）
    -----------------------------------------
    -- NARUTO
    INSERT INTO reviews (user_id, manga_id, rating, title, body)
    VALUES (
        admin_user_id,
        manga_naruto_id,
        5,
        '少年漫画の王道',
        '序盤のコメディから中盤以降のシリアス展開まで、とてもバランスが良い王道バトル漫画だと思います。'
    )
    ON CONFLICT (user_id, manga_id) DO UPDATE
      SET rating = EXCLUDED.rating,
          title = EXCLUDED.title,
          body  = EXCLUDED.body,
          updated_at = now()
    RETURNING id INTO review_naruto_admin_id;

    INSERT INTO reviews (user_id, manga_id, rating, title, body)
    VALUES (
        user_taro_id,
        manga_naruto_id,
        4,
        '中盤以降が特に好き',
        '中忍試験あたりから一気に面白くなります。キャラ同士の成長と因縁が熱いです。'
    )
    ON CONFLICT (user_id, manga_id) DO UPDATE
      SET rating = EXCLUDED.rating,
          title = EXCLUDED.title,
          body  = EXCLUDED.body,
          updated_at = now()
    RETURNING id INTO review_naruto_taro_id;

    -- BLEACH
    INSERT INTO reviews (user_id, manga_id, rating, title, body)
    VALUES (
        admin_user_id,
        manga_bleach_id,
        4,
        'オサレ感が最高',
        '世界観とキャラクターデザインがとにかくかっこいい作品です。技名のセンスも含めて唯一無二。'
    )
    ON CONFLICT (user_id, manga_id) DO UPDATE
      SET rating = EXCLUDED.rating,
          title = EXCLUDED.title,
          body  = EXCLUDED.body,
          updated_at = now()
    RETURNING id INTO review_bleach_admin_id;

    INSERT INTO reviews (user_id, manga_id, rating, title, body)
    VALUES (
        user_hanako_id,
        manga_bleach_id,
        3,
        '序盤は好き',
        '尸魂界篇までは一気読みしました。後半は好みが分かれるかもしれませんが、雰囲気が好きな人には刺さると思います。'
    )
    ON CONFLICT (user_id, manga_id) DO UPDATE
      SET rating = EXCLUDED.rating,
          title = EXCLUDED.title,
          body  = EXCLUDED.body,
          updated_at = now()
    RETURNING id INTO review_bleach_hanako_id;

    -- 鬼滅の刃
    INSERT INTO reviews (user_id, manga_id, rating, title, body)
    VALUES (
        admin_user_id,
        manga_kimetsu_id,
        5,
        'テンポの良さが◎',
        'ストーリーのテンポが非常に良く、無駄な引き延ばしが少ないので最後まで気持ちよく読めました。'
    )
    ON CONFLICT (user_id, manga_id) DO UPDATE
      SET rating = EXCLUDED.rating,
          title = EXCLUDED.title,
          body  = EXCLUDED.body,
          updated_at = now()
    RETURNING id INTO review_kimetsu_admin_id;

    INSERT INTO reviews (user_id, manga_id, rating, title, body)
    VALUES (
        user_taro_id,
        manga_kimetsu_id,
        5,
        'アニメから入って原作も読破',
        'キャラクター一人ひとりに背景があり、サブキャラまでしっかり描かれているのが良かったです。'
    )
    ON CONFLICT (user_id, manga_id) DO UPDATE
      SET rating = EXCLUDED.rating,
          title = EXCLUDED.title,
          body  = EXCLUDED.body,
          updated_at = now()
    RETURNING id INTO review_kimetsu_taro_id;

    INSERT INTO reviews (user_id, manga_id, rating, title, body)
    VALUES (
        user_hanako_id,
        manga_kimetsu_id,
        4,
        '感動系としてもおすすめ',
        'バトルだけでなく家族愛や仲間との絆など、感情を揺さぶられるシーンが多い作品でした。'
    )
    ON CONFLICT (user_id, manga_id) DO UPDATE
      SET rating = EXCLUDED.rating,
          title = EXCLUDED.title,
          body  = EXCLUDED.body,
          updated_at = now()
    RETURNING id INTO review_kimetsu_hanako_id;

    -----------------------------------------
    -- 「参考になった」投票（review_helpful_votes）
    -----------------------------------------
    INSERT INTO review_helpful_votes (user_id, review_id) VALUES
      -- NARUTO
      (user_taro_id,   review_naruto_admin_id),
      (user_hanako_id, review_naruto_admin_id),

      -- BLEACH
      (user_taro_id,   review_bleach_admin_id),

      -- 鬼滅の刃
      (user_taro_id,   review_kimetsu_admin_id),
      (user_hanako_id, review_kimetsu_admin_id),
      (admin_user_id,  review_kimetsu_taro_id)
    ON CONFLICT DO NOTHING;

    -----------------------------------------
    -- reviews.helpful_count を実データから更新
    -----------------------------------------
    UPDATE reviews r
    SET helpful_count = v.cnt
    FROM (
      SELECT review_id, COUNT(*) AS cnt
      FROM review_helpful_votes
      GROUP BY review_id
    ) AS v
    WHERE r.id = v.review_id;

    -----------------------------------------
    -- manga.likes_count / reviews_count / avg_rating を更新
    -----------------------------------------
    UPDATE manga m
    SET
      likes_count = COALESCE(l.likes_cnt, 0),
      reviews_count = COALESCE(r.reviews_cnt, 0),
      avg_rating = r.avg_rating
    FROM (
      SELECT 
        manga_id,
        COUNT(*) AS likes_cnt
      FROM manga_likes
      GROUP BY manga_id
    ) l
    FULL OUTER JOIN (
      SELECT 
        manga_id,
        COUNT(*) AS reviews_cnt,
        ROUND(AVG(rating)::numeric, 2) AS avg_rating
      FROM reviews
      GROUP BY manga_id
    ) r
    ON l.manga_id = r.manga_id
    WHERE m.id = COALESCE(l.manga_id, r.manga_id);
END $$;
