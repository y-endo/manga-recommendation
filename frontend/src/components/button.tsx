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
    'inline-flex items-center gap-2 rounded-sm border border-indigo-600 px-8 py-3 disabled:cursor-default disabled:opacity-50',
    {
      'bg-indigo-600 text-white hover:bg-transparent hover:text-indigo-600 disabled:hover:bg-indigo-600 disabled:hover:text-white':
        variant === 'primary',
      'text-indigo-600 hover:bg-indigo-600 hover:text-white disabled:hover:bg-indigo-600 disabled:hover:text-white':
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
      className="size-5 rtl:rotate-180"
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
          <span className="text-sm font-medium">{children}</span>
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
        <span className="text-sm font-medium">{children}</span>
        {hasArrow && <ArrowIcon />}
      </a>
    );
  } else {
    const { type = 'button', ...buttonRest } = rest as ButtonProps;
    return (
      <button type={type} className={classNames} disabled={disabled} {...buttonRest}>
        <span className="text-sm font-medium">{children}</span>
        {hasArrow && <ArrowIcon />}
      </button>
    );
  }
}
