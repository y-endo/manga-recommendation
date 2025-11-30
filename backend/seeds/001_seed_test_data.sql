CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  -- 検証データ：ユーザー
  admin_user_id UUID;
  user_taro_id  UUID;
  user_hanako_id UUID;

  -- 検証データ：作者
  author_naruto UUID;
  author_bleach UUID;
  author_kimetsu UUID;

  -- 検証データ：ジャンル
  genre_shonen_id INTEGER;
  genre_battle_action_id INTEGER;
  genre_dark_fantasy_id INTEGER;
  genre_japanese_fantasy_id INTEGER;

  -- 検証データ：タグ
  tag_anime_id INTEGER;
  tag_live_action_id INTEGER;
  tag_completed_id INTEGER;

  -- 検証データ：漫画
  manga_naruto_id UUID;
  manga_bleach_id UUID;
  manga_kimetsu_id UUID;

  -- 検証データ：レビュー
  review_naruto_admin_id UUID;
  review_naruto_taro_id  UUID;
  review_bleach_admin_id UUID;
  review_bleach_hanako_id UUID;
  review_kimetsu_admin_id UUID;
  review_kimetsu_taro_id  UUID;
  review_kimetsu_hanako_id UUID;

  -- ジャンル
  genre_names TEXT[] := ARRAY[
    '少年マンガ','青年マンガ','少女マンガ','女性マンガ','アクション・バトル','ファンタジー','異世界・転生','SF',
    'ホラー・サスペンス','ギャグ・コメディ','恋愛・ラブコメ','音楽・芸能','スポーツ','日常・ほのぼの','ミステリー・推理','歴史・時代劇'
  ];
  -- タグ
  tag_names TEXT[] := ARRAY[
    '主人公最強','チート','無双','天才','かわいい系主人公','ダークヒーロー','悪役令嬢','魔法使い','学生','社会人','異世界','現代',
    '現代ファンタジー','学園','江戸','歴史','未来','SF','ダークファンタジー','成長物語','逆転劇','シリアス','ほのぼの','王道','泣ける',
    '熱い','伏線回収','恋愛要素あり','復讐','バトル','冒険','グルメ','ギャンブル','スポーツ','職業物','音楽',
    '部活','育児','社会問題系','暗い','明るい','コメディ','カオス','心温まる','重い','こわい','連載中','完結','長編','短編','ネット小説原作'
  ];

  -- 検証用自動生成
  i INT;
  new_manga_id UUID;
  v_author_name TEXT;
  v_slug TEXT;
  v_title TEXT;
  pub_year INT;
  genre_id_int INT;
  tag_id_int INT;
  -- 配列走査用の一時変数
  g TEXT;
  t TEXT;
  prefix TEXT := 'test-manga-';
BEGIN
  INSERT INTO users (email, username, user_slug, password_hash, role)
  VALUES ('a@gmail.com','管理者ユーザー','a',crypt('a', gen_salt('bf')),'admin')
  ON CONFLICT (email) DO UPDATE SET username = EXCLUDED.username, role = EXCLUDED.role
  RETURNING id INTO admin_user_id;

  INSERT INTO users (email, username, user_slug, password_hash, role)
  VALUES ('taro@example.com','太郎','taro',crypt('password1', gen_salt('bf')),'user')
  ON CONFLICT (email) DO UPDATE SET username = EXCLUDED.username
  RETURNING id INTO user_taro_id;

  INSERT INTO users (email, username, user_slug, password_hash, role)
  VALUES ('hanako@example.com','花子','hanako',crypt('password2', gen_salt('bf')),'user')
  ON CONFLICT (email) DO UPDATE SET username = EXCLUDED.username
  RETURNING id INTO user_hanako_id;

  INSERT INTO user_profiles (user_id, bio)
  VALUES
    (admin_user_id,'漫画レコメンドアプリの管理者です。'),
    (user_taro_id,'少年漫画が大好きな社会人エンジニアです。'),
    (user_hanako_id,'ダークファンタジーと感動系の作品が好きです。')
  ON CONFLICT (user_id) DO UPDATE SET bio = EXCLUDED.bio, updated_at = now();

  INSERT INTO user_follows (follower_id, followee_id) VALUES
    (user_taro_id, admin_user_id),
    (user_hanako_id, admin_user_id),
    (admin_user_id, user_taro_id)
  ON CONFLICT DO NOTHING;

  INSERT INTO authors (name) VALUES ('岸本斉史')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO author_naruto;

  INSERT INTO authors (name) VALUES ('久保帯人')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO author_bleach;

  INSERT INTO authors (name) VALUES ('吾峠呼世晴')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO author_kimetsu;

  INSERT INTO genres (name) VALUES ('少年漫画')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO genre_shonen_id;

  INSERT INTO genres (name) VALUES ('バトル')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO genre_battle_action_id;

  INSERT INTO genres (name) VALUES ('ダークファンタジー')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO genre_dark_fantasy_id;

  INSERT INTO genres (name) VALUES ('和風')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO genre_japanese_fantasy_id;

  INSERT INTO tags (name) VALUES ('アニメ化')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO tag_anime_id;

  INSERT INTO tags (name) VALUES ('実写化')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO tag_live_action_id;

  INSERT INTO tags (name) VALUES ('完結済み')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO tag_completed_id;

  INSERT INTO manga (slug, title, description, cover_image, published_year)
  VALUES ('naruto','NARUTO -ナルト-','落ちこぼれ忍者・うずまきナルトが火影を目指して成長していく王道バトル作品。',NULL,1999)
  ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, published_year = EXCLUDED.published_year
  RETURNING id INTO manga_naruto_id;

  INSERT INTO manga (slug, title, description, cover_image, published_year)
  VALUES ('bleach','BLEACH','死神代行となった高校生・黒崎一護が虚や死神たちと戦うスタイリッシュバトルアクション。',NULL,2001)
  ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, published_year = EXCLUDED.published_year
  RETURNING id INTO manga_bleach_id;

  INSERT INTO manga (slug, title, description, cover_image, published_year)
  VALUES ('kimetsu-no-yaiba','鬼滅の刃','家族を鬼に殺された少年・竈門炭治郎が鬼殺隊として鬼と戦う和風ダークファンタジー。',NULL,2016)
  ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, published_year = EXCLUDED.published_year
  RETURNING id INTO manga_kimetsu_id;

  INSERT INTO manga_authors (manga_id, author_id) VALUES
    (manga_naruto_id,  author_naruto),
    (manga_bleach_id,  author_bleach),
    (manga_kimetsu_id, author_kimetsu)
  ON CONFLICT DO NOTHING;

  INSERT INTO manga_genres (manga_id, genre_id) VALUES
    (manga_naruto_id,  genre_shonen_id),
    (manga_naruto_id,  genre_battle_action_id),
    (manga_bleach_id,  genre_shonen_id),
    (manga_bleach_id,  genre_battle_action_id),
    (manga_bleach_id,  genre_dark_fantasy_id),
    (manga_kimetsu_id, genre_shonen_id),
    (manga_kimetsu_id, genre_battle_action_id),
    (manga_kimetsu_id, genre_dark_fantasy_id),
    (manga_kimetsu_id, genre_japanese_fantasy_id)
  ON CONFLICT DO NOTHING;

  INSERT INTO manga_tags (manga_id, tag_id) VALUES
    (manga_naruto_id, tag_anime_id),
    (manga_naruto_id, tag_live_action_id),
    (manga_naruto_id, tag_completed_id),
    (manga_bleach_id, tag_anime_id),
    (manga_bleach_id, tag_completed_id),
    (manga_kimetsu_id, tag_anime_id),
    (manga_kimetsu_id, tag_completed_id)
  ON CONFLICT DO NOTHING;

  INSERT INTO user_manga_statuses (user_id, manga_id, status, is_public) VALUES
    (admin_user_id, manga_naruto_id,  'completed',    TRUE),
    (admin_user_id, manga_bleach_id,  'plan_to_read', TRUE),
    (admin_user_id, manga_kimetsu_id, 'completed',    TRUE)
  ON CONFLICT (user_id, manga_id) DO UPDATE SET status = EXCLUDED.status, is_public = EXCLUDED.is_public, updated_at = now();

  INSERT INTO user_manga_statuses (user_id, manga_id, status, is_public) VALUES
    (user_taro_id, manga_naruto_id,  'completed',    TRUE),
    (user_taro_id, manga_bleach_id,  'completed',    TRUE),
    (user_taro_id, manga_kimetsu_id, 'plan_to_read', TRUE)
  ON CONFLICT (user_id, manga_id) DO UPDATE SET status = EXCLUDED.status, is_public = EXCLUDED.is_public, updated_at = now();

  INSERT INTO user_manga_statuses (user_id, manga_id, status, is_public) VALUES
    (user_hanako_id, manga_naruto_id,  'reading',     TRUE),
    (user_hanako_id, manga_kimetsu_id, 'completed',   TRUE)
  ON CONFLICT (user_id, manga_id) DO UPDATE SET status = EXCLUDED.status, is_public = EXCLUDED.is_public, updated_at = now();

  INSERT INTO manga_likes (user_id, manga_id) VALUES
    (admin_user_id, manga_naruto_id),
    (admin_user_id, manga_bleach_id),
    (admin_user_id, manga_kimetsu_id),
    (user_taro_id,  manga_naruto_id),
    (user_taro_id,  manga_kimetsu_id),
    (user_hanako_id, manga_bleach_id),
    (user_hanako_id, manga_kimetsu_id)
  ON CONFLICT DO NOTHING;

  INSERT INTO reviews (user_id, manga_id, rating, title, body)
  VALUES (admin_user_id, manga_naruto_id, 5, '少年漫画の王道', '序盤のコメディから中盤以降のシリアス展開まで、とてもバランスが良い王道バトル漫画だと思います。')
  ON CONFLICT (user_id, manga_id) DO UPDATE SET rating = EXCLUDED.rating, title = EXCLUDED.title, body = EXCLUDED.body, updated_at = now()
  RETURNING id INTO review_naruto_admin_id;

  INSERT INTO reviews (user_id, manga_id, rating, title, body)
  VALUES (user_taro_id, manga_naruto_id, 4, '中盤以降が特に好き', '中忍試験あたりから一気に面白くなります。キャラ同士の成長と因縁が熱いです。')
  ON CONFLICT (user_id, manga_id) DO UPDATE SET rating = EXCLUDED.rating, title = EXCLUDED.title, body = EXCLUDED.body, updated_at = now()
  RETURNING id INTO review_naruto_taro_id;

  INSERT INTO reviews (user_id, manga_id, rating, title, body)
  VALUES (admin_user_id, manga_bleach_id, 4, 'オサレ感が最高', '世界観とキャラクターデザインがとにかくかっこいい作品です。技名のセンスも含めて唯一無二。')
  ON CONFLICT (user_id, manga_id) DO UPDATE SET rating = EXCLUDED.rating, title = EXCLUDED.title, body = EXCLUDED.body, updated_at = now()
  RETURNING id INTO review_bleach_admin_id;

  INSERT INTO reviews (user_id, manga_id, rating, title, body)
  VALUES (user_hanako_id, manga_bleach_id, 3, '序盤は好き', '尸魂界篇までは一気読みしました。後半は好みが分かれるかもしれませんが、雰囲気が好きな人には刺さると思います。')
  ON CONFLICT (user_id, manga_id) DO UPDATE SET rating = EXCLUDED.rating, title = EXCLUDED.title, body = EXCLUDED.body, updated_at = now()
  RETURNING id INTO review_bleach_hanako_id;

  INSERT INTO reviews (user_id, manga_id, rating, title, body)
  VALUES (admin_user_id, manga_kimetsu_id, 5, 'テンポの良さが◎', 'ストーリーのテンポが非常に良く、無駄な引き延ばしが少ないので最後まで気持ちよく読めました。')
  ON CONFLICT (user_id, manga_id) DO UPDATE SET rating = EXCLUDED.rating, title = EXCLUDED.title, body = EXCLUDED.body, updated_at = now()
  RETURNING id INTO review_kimetsu_admin_id;

  INSERT INTO reviews (user_id, manga_id, rating, title, body)
  VALUES (user_taro_id, manga_kimetsu_id, 5, 'アニメから入って原作も読破', 'キャラクター一人ひとりに背景があり、サブキャラまでしっかり描かれているのが良かったです。')
  ON CONFLICT (user_id, manga_id) DO UPDATE SET rating = EXCLUDED.rating, title = EXCLUDED.title, body = EXCLUDED.body, updated_at = now()
  RETURNING id INTO review_kimetsu_taro_id;

  INSERT INTO reviews (user_id, manga_id, rating, title, body)
  VALUES (user_hanako_id, manga_kimetsu_id, 4, '感動系としてもおすすめ', 'バトルだけでなく家族愛や仲間との絆など、感情を揺さぶられるシーンが多い作品でした。')
  ON CONFLICT (user_id, manga_id) DO UPDATE SET rating = EXCLUDED.rating, title = EXCLUDED.title, body = EXCLUDED.body, updated_at = now()
  RETURNING id INTO review_kimetsu_hanako_id;

  INSERT INTO review_helpful_votes (user_id, review_id) VALUES
    (user_taro_id,   review_naruto_admin_id),
    (user_hanako_id, review_naruto_admin_id),
    (user_taro_id,   review_bleach_admin_id),
    (user_taro_id,   review_kimetsu_admin_id),
    (user_hanako_id, review_kimetsu_admin_id),
    (admin_user_id,  review_kimetsu_taro_id)
  ON CONFLICT DO NOTHING;

  UPDATE reviews r
  SET helpful_count = v.cnt
  FROM (SELECT review_id, COUNT(*) AS cnt FROM review_helpful_votes GROUP BY review_id) v
  WHERE r.id = v.review_id;

  -- ジャンル配列をインデックスで走査（FOREACH問題回避）
  FOR i IN 1..COALESCE(array_length(genre_names, 1), 0) LOOP
    g := genre_names[i];
    INSERT INTO genres(name) VALUES (g)
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
  END LOOP;

  -- タグ配列をインデックスで走査（FOREACH問題回避）
  FOR i IN 1..COALESCE(array_length(tag_names, 1), 0) LOOP
    t := tag_names[i];
    INSERT INTO tags(name) VALUES (t)
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
  END LOOP;

  FOR i IN 1..100 LOOP
    v_slug := prefix || LPAD(i::TEXT, 3, '0');
    v_title := '検証用有名漫画 ' || LPAD(i::TEXT, 3, '0');
    v_author_name := '検証作者 ' || LPAD(i::TEXT, 3, '0');
    pub_year := (1980 + floor(random() * 45))::INT;

    PERFORM 1 FROM authors WHERE name = v_author_name;
    IF NOT FOUND THEN
      INSERT INTO authors(name) VALUES (v_author_name) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    END IF;

    INSERT INTO manga (slug, title, description, cover_image, published_year)
    VALUES (v_slug, v_title, '自動生成の検証用データです。検索・絞り込み・関連ビューの動作検証に使用します。', NULL, pub_year)
    ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, published_year = EXCLUDED.published_year
    RETURNING id INTO new_manga_id;

    INSERT INTO manga_authors(manga_id, author_id)
    SELECT new_manga_id, a.id FROM authors a WHERE a.name = v_author_name
    ON CONFLICT DO NOTHING;

    FOR genre_id_int IN SELECT id FROM genres ORDER BY random() LIMIT 3 LOOP
      INSERT INTO manga_genres(manga_id, genre_id) VALUES (new_manga_id, genre_id_int)
      ON CONFLICT DO NOTHING;
    END LOOP;

    FOR tag_id_int IN SELECT id FROM tags ORDER BY random() LIMIT 5 LOOP
      INSERT INTO manga_tags(manga_id, tag_id) VALUES (new_manga_id, tag_id_int)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  /* ------------------------- 集計更新 ---------------------------------------- */
  UPDATE manga m
  SET likes_count = COALESCE(l.likes_cnt, 0),
      reviews_count = COALESCE(r.reviews_cnt, 0),
      avg_rating = r.avg_rating
  FROM (
    SELECT manga_id, COUNT(*) AS likes_cnt FROM manga_likes GROUP BY manga_id
  ) l
  FULL OUTER JOIN (
    SELECT manga_id, COUNT(*) AS reviews_cnt, ROUND(AVG(rating)::numeric, 2) AS avg_rating
    FROM reviews GROUP BY manga_id
  ) r ON l.manga_id = r.manga_id
  WHERE m.id = COALESCE(l.manga_id, r.manga_id);
END $$ LANGUAGE plpgsql;
