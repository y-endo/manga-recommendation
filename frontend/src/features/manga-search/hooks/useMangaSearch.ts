import { useEffect } from 'react';
import { useLazyGetMangaListQuery } from '@/shared/api/mangaApi';
import { useMangaSearchStore, MangaSearchParams } from '@/shared/store/mangaSearchStore';

export function useMangaSearch() {
  const [fetchMangaList, { data, error, isLoading }] = useLazyGetMangaListQuery();
  const { params, setParam, setResult, setIsLoading, setError } = useMangaSearchStore();

  /**
   * 検索窓や並び順の入力変更ハンドラ
   * @param event 入力変更イベント
   */
  const handleInputTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = event.target;
    const { name, value } = target;
    setParam(name as keyof MangaSearchParams, value);
  };

  /**
   * チェックボックスの変更ハンドラ
   * @param event チェックボックスの変更イベント
   */
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    const existing = params[name as keyof MangaSearchParams];
    let nextValues: string[] = Array.isArray(existing)
      ? [...(existing as string[])]
      : existing
        ? [existing as string]
        : [];

    if (checked) {
      if (!nextValues.includes(value)) nextValues.push(value);
    } else {
      nextValues = nextValues.filter((v) => v !== value);
    }

    setParam(name as keyof MangaSearchParams, nextValues);
  };

  /**
   * 検索フォームの送信ハンドラ
   * @param event フォーム送信イベント
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchMangaList(params);
  };

  useEffect(() => {
    if (data) {
      setResult(data);
    }
  }, [data, setResult]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  useEffect(() => {
    if (error) {
      setError(error);
    }
  }, [error, setError]);

  return {
    handleInputTextChange,
    handleCheckboxChange,
    handleSubmit,
  };
}
