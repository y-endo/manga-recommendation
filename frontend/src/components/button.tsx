import clsx from 'clsx';
import Link from 'next/link';

type Variant = 'primary' | 'secondary';

interface BaseProps {
  variant?: Variant; // 見た目のバリエーション
  hasArrow?: boolean; // 矢印アイコンを表示するかどうか
  disabled?: boolean; // 無効化するかどうか
  className?: string; // 追加のクラス名
  isNextLink?: boolean; // Next.jsのLinkとして動作させるかどうか
  children: React.ReactNode;
}

type AnchorProps = BaseProps & { as: 'a' } & React.AnchorHTMLAttributes<HTMLAnchorElement>;
type ButtonProps = BaseProps & { as?: 'button' } & React.ButtonHTMLAttributes<HTMLButtonElement>;
type Props = AnchorProps | ButtonProps;

/**
 * ボタンのクラス名を構築する
 * @param variant 見た目のバリエーション
 * @param className 追加のクラス名
 * @returns clsxで合成したクラス名の文字列
 */
function buildClasses(variant: Variant, className?: string) {
  return clsx(
    'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    {
      'bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300':
        variant === 'primary',
      'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200':
        variant === 'secondary',
    },
    className
  );
}

/**
 * 矢印アイコンコンポーネント
 * @returns 矢印アイコンのSVG要素
 */
function ArrowIcon() {
  return (
    <svg
      className="size-4 rtl:rotate-180"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
    </svg>
  );
}

export default function Button({
  as = 'button',
  variant = 'primary',
  hasArrow,
  disabled,
  className,
  children,
  ...rest
}: Props) {
  const classNames = buildClasses(variant, className);

  if (as === 'a') {
    const { href, isNextLink, ...anchorRest } = rest as AnchorProps;
    if (isNextLink && href) {
      return (
        <Link className={classNames} href={href} {...anchorRest}>
          <span>{children}</span>
          {hasArrow && <ArrowIcon />}
        </Link>
      );
    }

    return (
      <a
        className={classNames}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : anchorRest.tabIndex}
        {...anchorRest}
      >
        <span>{children}</span>
        {hasArrow && <ArrowIcon />}
      </a>
    );
  } else {
    const { type = 'button', ...buttonRest } = rest as ButtonProps;
    return (
      <button type={type} className={classNames} disabled={disabled} {...buttonRest}>
        <span>{children}</span>
        {hasArrow && <ArrowIcon />}
      </button>
    );
  }
}
