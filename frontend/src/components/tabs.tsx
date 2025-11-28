import clsx from 'clsx';

export type TabItem = {
  id: string;
  label: string;
  panel: React.ReactNode;
};

type Props = {
  items: TabItem[];
  value?: string;
  onChange?: (id: string) => void;
  className?: string;
};

export default function Tabs({ items, value, onChange, className }: Props) {
  const activeId = value ?? items[0]?.id;

  return (
    <div className={clsx('w-full', className)}>
      <div
        className="flex gap-2 overflow-x-auto border-b border-slate-200 p-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:p-0 [&::-webkit-scrollbar]:hidden"
        role="tablist"
      >
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`tabpanel-${item.id}`}
              className={clsx(
                'rounded-t-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors sm:px-4',
                active ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-700'
              )}
              onClick={() => onChange?.(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-b-md border border-slate-200 bg-white p-3 sm:p-4">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <div
              key={item.id}
              id={`tabpanel-${item.id}`}
              role="tabpanel"
              aria-labelledby={item.id}
              className={clsx(active ? 'block' : 'hidden')}
            >
              {item.panel}
            </div>
          );
        })}
      </div>
    </div>
  );
}
