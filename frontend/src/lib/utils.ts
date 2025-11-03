/**
 * 日付を日本語フォーマットに変換
 * @param dateString - ISO形式の日付文字列
 * @returns フォーマットされた日付文字列
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * 相対時間を計算（例：3時間前、2日前）
 * @param dateString - ISO形式の日付文字列
 * @returns 相対時間の文字列
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'たった今'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分前`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}時間前`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}日前`
  
  return formatDate(dateString)
}

/**
 * 評価を星の数に変換
 * @param rating - 1-5の評価値
 * @returns 星の文字列
 */
export const formatRating = (rating: number): string => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

/**
 * クラス名を結合するヘルパー関数
 * @param classes - クラス名の配列
 * @returns 結合されたクラス名
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}
